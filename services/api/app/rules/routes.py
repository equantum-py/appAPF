from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import ValidationError

from app.audit.routes import RFC3339
from app.audit.schemas import AuditQuery
from app.identity.jwt import AuthUnavailable
from app.identity.routes import ERRORS, ErrorEnvelope, identity
from app.organizations.access import ForbiddenAccess
from app.rules.schemas import Edition, EditionInput, EditionPage
from app.rules.service import EditionConflict, EditionNotFound, RulesService

router = APIRouter()
BASE = "/v1/organizations/{organization_id}/rulebook-editions"
RULE_ERRORS = {**ERRORS, **{s: {"model": ErrorEnvelope} for s in [404, 409]}}


def invoke_rules(request, operation, *args):
    access = request.app.state.access_service
    if access is None:
        raise HTTPException(503)
    try:
        return getattr(RulesService(access), operation)(
            *args, request_id=UUID(request.state.request_id)
        )
    except ForbiddenAccess:
        raise HTTPException(403) from None
    except EditionNotFound:
        raise HTTPException(404) from None
    except EditionConflict:
        raise HTTPException(409) from None
    except AuthUnavailable:
        raise HTTPException(503) from None


@router.post(
    BASE,
    status_code=201,
    response_model=Edition,
    responses=RULE_ERRORS,
    tags=["rules"],
    description=(
        "Active institutional ADMIN or PERSONAL owner only. Audited atomically."
    ),
)
def create_edition(
    organization_id: UUID,
    payload: EditionInput,
    request: Request,
    response: Response,
    actor=Depends(identity),
):
    row = invoke_rules(request, "create", actor, organization_id, payload)
    response.headers["Location"] = (
        f"/v1/organizations/{organization_id}/rulebook-editions/{row['id']}"
    )
    return row


@router.get(
    BASE,
    response_model=EditionPage,
    responses=RULE_ERRORS,
    tags=["rules"],
    description=(
        "Active members in their authorized organization only; no-store. "
        "Cursor fields must be paired; order is created_at DESC, id DESC."
    ),
)
def list_editions(
    organization_id: UUID,
    request: Request,
    actor=Depends(identity),
    limit: int = Query(default=50, ge=1, le=100),
    before_at: str | None = Query(
        default=None, pattern=RFC3339, json_schema_extra={"format": "date-time"}
    ),
    before_id: UUID | None = None,
):
    try:
        query = AuditQuery(limit=limit, before_at=before_at, before_id=before_id)
    except ValidationError:
        raise HTTPException(422) from None
    return invoke_rules(request, "page", actor, organization_id, query)


@router.get(
    BASE + "/{edition_id}",
    response_model=Edition,
    responses=RULE_ERRORS,
    tags=["rules"],
    description=(
        "Active members only; missing/foreign edition returns 404 after scope auth."
    ),
)
def edition_detail(
    organization_id: UUID,
    edition_id: UUID,
    request: Request,
    actor=Depends(identity),
):
    return invoke_rules(request, "detail", actor, organization_id, edition_id)
