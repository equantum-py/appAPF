from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import ValidationError

from app.audit.schemas import Action, AuditPage, AuditQuery
from app.identity.routes import ERRORS, identity, invoke

router = APIRouter()
RFC3339 = r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$"


@router.get(
    "/v1/organizations/{organization_id}/audit-events",
    response_model=AuditPage,
    responses=ERRORS,
    tags=["audit"],
    description=(
        "Active institutional ADMIN or PERSONAL owner only; no-store. "
        "An audit read event commits before data is returned. "
        "Dates need timezones; from is inclusive, until exclusive. "
        "Cursor fields must be paired; order is created_at DESC, id DESC."
    ),
)
def events(
    organization_id: UUID,
    request: Request,
    actor=Depends(identity),
    limit: int = Query(default=50, ge=1, le=100),
    action: Action | None = None,
    from_at: str | None = Query(
        default=None,
        alias="from",
        pattern=RFC3339,
        json_schema_extra={"format": "date-time"},
    ),
    until: str | None = Query(
        default=None,
        pattern=RFC3339,
        json_schema_extra={"format": "date-time"},
    ),
    before_at: str | None = Query(
        default=None,
        pattern=RFC3339,
        json_schema_extra={"format": "date-time"},
    ),
    before_id: UUID | None = None,
):
    try:
        query = AuditQuery(
            limit=limit,
            action=action,
            from_at=from_at,
            until=until,
            before_at=before_at,
            before_id=before_id,
        )
    except ValidationError:
        raise HTTPException(422) from None
    return invoke(
        request,
        "audit_events",
        actor,
        organization_id,
        query,
        request_id=UUID(request.state.request_id),
    )
