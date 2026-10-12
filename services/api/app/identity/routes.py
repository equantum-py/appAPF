from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.identity.jwt import AuthUnavailable, InvalidCredentials
from app.organizations.access import ForbiddenAccess

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


class ErrorEnvelope(BaseModel):
    code: str
    message: str
    request_id: str


class MeResponse(BaseModel):
    user_id: UUID


class MembershipResponse(BaseModel):
    organization_id: UUID
    name: str
    kind: str
    role: str


class OrganizationAccessResponse(BaseModel):
    organization_id: UUID
    role: str
    can_review_technical: bool
    can_review_physical: bool


class MemberResponse(BaseModel):
    user_id: UUID
    role: str
    active: bool


ERRORS = {status: {"model": ErrorEnvelope} for status in [401, 403, 422, 503]}


def identity(
    request: Request, credentials: HTTPAuthorizationCredentials | None = Depends(bearer)
):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(401, headers={"WWW-Authenticate": "Bearer"})
    verifier = request.app.state.jwt_verifier
    if verifier is None:
        raise HTTPException(503)
    try:
        return verifier.verify(credentials.credentials)
    except InvalidCredentials:
        raise HTTPException(401, headers={"WWW-Authenticate": "Bearer"}) from None
    except AuthUnavailable:
        raise HTTPException(503) from None


def invoke(request, operation, *args, **kwargs):
    service = request.app.state.access_service
    if service is None:
        raise HTTPException(503)
    try:
        return getattr(service, operation)(*args, **kwargs)
    except ForbiddenAccess:
        raise HTTPException(403) from None
    except AuthUnavailable:
        raise HTTPException(503) from None


@router.get("/v1/me", response_model=MeResponse, responses=ERRORS)
def me(request: Request, actor=Depends(identity)):
    return invoke(request, "me", actor)


@router.get(
    "/v1/me/memberships", response_model=list[MembershipResponse], responses=ERRORS
)
def mine(request: Request, actor=Depends(identity)):
    return invoke(request, "mine", actor)


@router.get(
    "/v1/organizations/{organization_id}/access",
    response_model=OrganizationAccessResponse,
    responses=ERRORS,
)
def organization_access(
    organization_id: UUID, request: Request, actor=Depends(identity)
):
    return invoke(request, "organization", actor, organization_id)


@router.get(
    "/v1/organizations/{organization_id}/memberships",
    response_model=list[MemberResponse],
    responses=ERRORS,
)
def member_list(organization_id: UUID, request: Request, actor=Depends(identity)):
    return invoke(request, "organization", actor, organization_id, admin=True)
