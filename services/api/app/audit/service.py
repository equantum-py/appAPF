"""Audit writes share the caller transaction; reads never expose raw legacy JSON."""

import json
from dataclasses import dataclass
from uuid import UUID, uuid4

from pydantic import ValidationError
from sqlalchemy import select, text, tuple_

from app.audit.models import audit_log
from app.audit.schemas import (
    SPECS,
    Action,
    AuditQuery,
    EventInput,
    ProjectedDetails,
)


class InvalidAuditEvent(Exception):
    """Sanitized internal contract violation."""


@dataclass(frozen=True)
class AuthorizedContext:
    actor_id: UUID
    organization_id: UUID


class AuditService:
    def record(
        self,
        connection,
        authorized_context,
        action,
        resource_type,
        resource_id,
        request_id,
        attributes,
    ):
        # Validate closed input before SQL or logging; never include supplied values.
        try:
            raw = {
                "request_id": request_id,
                "resource_type": resource_type,
                "resource_id": resource_id,
                "attributes": attributes,
            }
            if len(json.dumps(raw, default=str).encode("utf-8")) > 4096:
                raise InvalidAuditEvent()
            payload = EventInput.model_validate({"action": action, "details": raw})
            if not isinstance(authorized_context, AuthorizedContext):
                raise InvalidAuditEvent()
            if not all(
                isinstance(x, UUID) and x.int
                for x in [
                    authorized_context.actor_id,
                    authorized_context.organization_id,
                    payload.details.request_id,
                    payload.details.resource_id,
                ]
            ):
                raise InvalidAuditEvent()
        except (ValidationError, TypeError, ValueError):
            raise InvalidAuditEvent() from None

        if not connection.in_transaction():
            raise InvalidAuditEvent()
        scope = connection.execute(
            text(
                "SELECT current_setting('app.actor_id', true), "
                "current_setting('app.organization_id', true)"
            )
        ).one()
        if scope != (
            str(authorized_context.actor_id),
            str(authorized_context.organization_id),
        ):
            raise InvalidAuditEvent()
        if payload.details.resource_type == "organization":
            if payload.details.resource_id != authorized_context.organization_id:
                raise InvalidAuditEvent()
        event_id = uuid4()
        connection.execute(
            audit_log.insert().values(
                id=event_id,
                organization_id=authorized_context.organization_id,
                actor_user_id=authorized_context.actor_id,
                action=payload.action.value,
                details=payload.details.model_dump(mode="json", exclude_none=True),
            )
        )
        return event_id

    def page(self, connection, authorized_context, query: AuditQuery):
        statement = select(audit_log).where(
            audit_log.c.organization_id == authorized_context.organization_id
        )
        if query.action is not None:
            statement = statement.where(audit_log.c.action == query.action.value)
        if query.from_at is not None:
            statement = statement.where(audit_log.c.created_at >= query.from_at)
        if query.until is not None:
            statement = statement.where(audit_log.c.created_at < query.until)
        if query.before_at is not None:
            statement = statement.where(
                tuple_(audit_log.c.created_at, audit_log.c.id)
                < tuple_(query.before_at, query.before_id)
            )
        rows = (
            connection.execute(
                statement.order_by(
                    audit_log.c.created_at.desc(), audit_log.c.id.desc()
                ).limit(query.limit + 1)
            )
            .mappings()
            .all()
        )
        items = [project_event(row) for row in rows[: query.limit]]
        cursor = None
        if len(rows) > query.limit:
            last = items[-1]
            cursor = {"before_at": last["created_at"], "before_id": last["id"]}
        return {"items": items, "next_cursor": cursor}


def project_event(row):
    try:
        action = Action(row["action"])
    except ValueError:
        action = "legacy.unknown"
    safe = {}
    raw = row["details"]
    if action in SPECS and isinstance(raw, dict):
        resource, allowed_attrs = SPECS[action]
        # Validate each field separately: corrupt legacy fields cannot echo text.
        for name in ProjectedDetails.model_fields:
            value = raw.get(name)
            if value is None:
                continue
            if name == "resource_type" and value != resource:
                continue
            if name == "attributes":
                if not isinstance(value, dict):
                    continue
                value = {k: v for k, v in value.items() if k in allowed_attrs}
            try:
                projected = ProjectedDetails.model_validate({name: value})
                safe.update(projected.model_dump(mode="json", exclude_none=True))
            except ValidationError:
                continue
    return {
        "id": row["id"],
        "organization_id": row["organization_id"],
        "created_at": row["created_at"],
        "actor_user_id": row["actor_user_id"],
        "action": action,
        "details": safe,
    }
