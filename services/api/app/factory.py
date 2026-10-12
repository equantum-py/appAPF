import os
from collections.abc import Mapping
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine
from starlette.exceptions import HTTPException

from app.audit.routes import router as audit_router
from app.identity.jwt import JWTVerifier
from app.identity.routes import router as identity_router
from app.organizations.access import AccessService
from app.shared.auth_config import AuthSettings
from app.shared.config import Settings
from app.shared.logging import record_request


class HealthResponse(BaseModel):
    status: str = "ok"


def create_app(env: Mapping[str, str] | None = None) -> FastAPI:
    settings = Settings.from_environment(os.environ if env is None else env)
    docs_enabled = settings.environment in {"development", "test"}
    app = FastAPI(
        title="Arbitral Platform API",
        version="0.1.0",
        docs_url="/docs" if docs_enabled else None,
        redoc_url=None,
        openapi_url="/openapi.json" if docs_enabled else None,
    )
    app.state.settings = settings
    auth = AuthSettings.from_environment(
        os.environ if env is None else env, settings.environment
    )
    app.state.jwt_verifier = JWTVerifier(auth) if auth else None
    app.state.access_service = (
        AccessService(
            create_engine(
                auth.database_url,
                pool_size=5,
                max_overflow=5,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 5},
            )
        )
        if auth
        else None
    )
    app.include_router(identity_router)
    app.include_router(audit_router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.cors_origins),
        allow_methods=["GET"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["X-Request-ID"],
        allow_credentials=False,
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request.state.request_id = str(uuid4())
        try:
            response = await call_next(request)
        except Exception:
            response = JSONResponse(
                status_code=500,
                content={
                    "code": "INTERNAL_ERROR",
                    "message": "Internal server error.",
                    "request_id": request.state.request_id,
                },
            )
        response.headers["X-Request-ID"] = request.state.request_id
        if request.url.path.startswith(("/v1/me", "/v1/organizations")):
            response.headers["Cache-Control"] = "no-store"
        record_request(request.state.request_id, request.method, response.status_code)
        return response

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": f"HTTP_{exc.status_code}",
                "message": "Request could not be processed.",
                "request_id": request.state.request_id,
            },
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "code": "HTTP_422",
                "message": "Request could not be processed.",
                "request_id": request.state.request_id,
            },
        )

    @app.get("/v1/health", response_model=HealthResponse, tags=["system"])
    async def health() -> HealthResponse:
        return HealthResponse()

    return app
