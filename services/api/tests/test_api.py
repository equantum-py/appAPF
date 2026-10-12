import json
import logging
from pathlib import Path
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.factory import create_app
from app.shared.config import ConfigurationError

ENV = {"APP_ENV": "test", "CORS_ORIGINS": '["http://localhost:3000"]'}


@pytest.mark.parametrize(
    "env",
    [
        {},
        {"APP_ENV": "test"},
        {"CORS_ORIGINS": "[]"},
        {**ENV, "APP_ENV": "secret-invalid-value"},
        {**ENV, "CORS_ORIGINS": "not-json"},
        {**ENV, "CORS_ORIGINS": '"https://example.com"'},
        {**ENV, "CORS_ORIGINS": "[]"},
        {**ENV, "CORS_ORIGINS": '["*"]'},
        {**ENV, "CORS_ORIGINS": '["https://user:secret@example.com"]'},
        {**ENV, "CORS_ORIGINS": '["https://example.com/path"]'},
        {**ENV, "CORS_ORIGINS": '["https://example.com?secret=1"]'},
        {**ENV, "CORS_ORIGINS": '["https://example.com#fragment"]'},
        {**ENV, "CORS_ORIGINS": "[1]"},
        {**ENV, "CORS_ORIGINS": '["https://bad host"]'},
        {**ENV, "CORS_ORIGINS": '["https://example.com:"]'},
        {**ENV, "CORS_ORIGINS": '["http://example.com:bad"]'},
        {**ENV, "APP_ENV": "production"},
    ],
)
def test_invalid_configuration_blocks_startup_without_values(env):
    with pytest.raises(ConfigurationError) as error:
        create_app(env)
    assert str(error.value) == "Invalid configuration: check APP_ENV and CORS_ORIGINS."
    assert error.value.__cause__ is None


def test_health_and_server_request_id():
    with TestClient(create_app(ENV)) as client:
        first = client.get("/v1/health", headers={"X-Request-ID": "untrusted"})
        second = client.get("/v1/health")
    assert first.status_code == 200
    assert first.json() == {"status": "ok"}
    UUID(first.headers["X-Request-ID"])
    assert first.headers["X-Request-ID"] != second.headers["X-Request-ID"]


@pytest.mark.parametrize(
    "method,path,status",
    [
        ("get", "/missing", 404),
        ("post", "/v1/health", 405),
    ],
)
def test_http_errors(method, path, status):
    with TestClient(create_app(ENV)) as client:
        response = getattr(client, method)(path)
    assert response.status_code == status
    assert response.json() == {
        "code": f"HTTP_{status}",
        "message": "Request could not be processed.",
        "request_id": response.headers["X-Request-ID"],
    }


def test_cors_permitted_and_denied():
    with TestClient(create_app(ENV)) as client:
        for origin, status in [
            ("http://localhost:3000", 200),
            ("https://other.example", 400),
        ]:
            response = client.options(
                "/v1/health",
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "GET",
                },
            )
            assert response.status_code == status
            assert (response.headers.get("access-control-allow-origin") == origin) == (
                status == 200
            )


def test_internal_error_and_access_log_omit_sensitive_values(caplog):
    app = create_app(ENV)

    @app.get("/broken")
    async def broken():
        raise RuntimeError("private-database-password")

    with caplog.at_level(logging.INFO, logger="arbitral.access"):
        with TestClient(app) as client:
            response = client.get(
                "/broken?token=private-token",
                headers={
                    "Authorization": "Bearer private-token",
                },
            )
    assert response.status_code == 500
    assert response.json()["code"] == "INTERNAL_ERROR"
    assert "private-" not in response.text
    records = [
        json.loads(x.message) for x in caplog.records if x.name == "arbitral.access"
    ]
    assert records == [
        {
            "event": "http_request",
            "method": "GET",
            "status": 500,
            "request_id": response.headers["X-Request-ID"],
        }
    ]


def test_production_disables_http_documentation():
    env = {"APP_ENV": "production", "CORS_ORIGINS": '["https://example.com"]'}
    with TestClient(create_app(env)) as client:
        for path in ["/docs", "/openapi.json", "/redoc"]:
            assert client.get(path).status_code == 404
        assert client.get("/v1/health").status_code == 200


def test_openapi_contract_matches_export():
    path = Path(__file__).resolve().parents[3] / "packages/contracts/openapi.json"
    assert json.loads(path.read_text()) == create_app(ENV).openapi()
