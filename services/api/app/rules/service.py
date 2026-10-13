from uuid import UUID

from sqlalchemy import select, text, tuple_
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.audit.schemas import Action
from app.audit.service import AuthorizedContext, InvalidAuditEvent
from app.identity.jwt import AuthUnavailable
from app.organizations.access import ForbiddenAccess
from app.rules.models import rulebook_editions


class EditionNotFound(Exception):
    pass


class EditionConflict(Exception):
    pass


class RulesService:
    def __init__(self, access):
        self.access = access

    def _context(self, connection, identity, organization_id, write=False):
        actor, member, organization = self.access.authorized_organization(
            connection, identity, organization_id
        )
        if write:
            allowed = (
                organization["kind"] == "INSTITUTIONAL" and member["role"] == "ADMIN"
            ) or (
                organization["kind"] == "PERSONAL"
                and organization["owner_user_id"] == actor.user_id
            )
            if not allowed:
                raise ForbiddenAccess()
        return AuthorizedContext(actor.user_id, organization_id)

    def require_edition(self, connection, authorized_context, edition_id):
        # Only accepts an already authorized transaction, never an HTTP-supplied scope.
        if not isinstance(authorized_context, AuthorizedContext):
            raise ForbiddenAccess()
        if not connection.in_transaction():
            raise ForbiddenAccess()
        scope = connection.execute(
            text(
                "SELECT current_setting('app.actor_id',true), "
                "current_setting('app.organization_id',true)"
            )
        ).one()
        if scope != (
            str(authorized_context.actor_id),
            str(authorized_context.organization_id),
        ):
            raise ForbiddenAccess()
        row = (
            connection.execute(
                select(rulebook_editions).where(
                    rulebook_editions.c.organization_id
                    == authorized_context.organization_id,
                    rulebook_editions.c.id == edition_id,
                )
            )
            .mappings()
            .one_or_none()
        )
        if row is None:
            raise EditionNotFound()
        return dict(row)

    def create(self, identity, organization_id, payload, request_id: UUID):
        try:
            with self.access.engine.begin() as connection:
                context = self._context(
                    connection, identity, organization_id, write=True
                )
                row = dict(
                    connection.execute(
                        rulebook_editions.insert()
                        .values(
                            organization_id=organization_id,
                            label=payload.label,
                        )
                        .returning(rulebook_editions)
                    )
                    .mappings()
                    .one()
                )
                self.access.audit_service.record(
                    connection,
                    context,
                    Action.EDITION_CREATED,
                    "rulebook_edition",
                    row["id"],
                    request_id,
                    {},
                )
                return row
        except IntegrityError as error:
            if (
                getattr(error.orig, "sqlstate", None) == "23505"
                and getattr(getattr(error.orig, "diag", None), "constraint_name", None)
                == "rulebook_editions_organization_id_label_key"
            ):
                raise EditionConflict() from None
            raise AuthUnavailable() from None
        except (SQLAlchemyError, InvalidAuditEvent):
            raise AuthUnavailable() from None

    def detail(self, identity, organization_id, edition_id, request_id):
        try:
            with self.access.engine.begin() as connection:
                context = self._context(connection, identity, organization_id)
                row = self.require_edition(connection, context, edition_id)
                self.access.audit_service.record(
                    connection,
                    context,
                    Action.EDITION_READ,
                    "rulebook_edition",
                    edition_id,
                    request_id,
                    {},
                )
                return row
        except (SQLAlchemyError, InvalidAuditEvent):
            raise AuthUnavailable() from None

    def page(self, identity, organization_id, query, request_id):
        try:
            with self.access.engine.begin() as connection:
                context = self._context(connection, identity, organization_id)
                statement = select(rulebook_editions).where(
                    rulebook_editions.c.organization_id == organization_id
                )
                if query.before_at is not None:
                    statement = statement.where(
                        tuple_(rulebook_editions.c.created_at, rulebook_editions.c.id)
                        < tuple_(query.before_at, query.before_id)
                    )
                rows = (
                    connection.execute(
                        statement.order_by(
                            rulebook_editions.c.created_at.desc(),
                            rulebook_editions.c.id.desc(),
                        ).limit(query.limit + 1)
                    )
                    .mappings()
                    .all()
                )
                items = [dict(row) for row in rows[: query.limit]]
                cursor = None
                if len(rows) > query.limit:
                    cursor = {
                        "before_at": items[-1]["created_at"],
                        "before_id": items[-1]["id"],
                    }
                self.access.audit_service.record(
                    connection,
                    context,
                    Action.EDITIONS_READ,
                    "organization",
                    organization_id,
                    request_id,
                    {"returned_count": len(items)},
                )
                return {"items": items, "next_cursor": cursor}
        except (SQLAlchemyError, InvalidAuditEvent):
            raise AuthUnavailable() from None
