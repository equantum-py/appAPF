from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.factory import create_app

ENV = {"APP_ENV": "test", "CORS_ORIGINS": '["http://localhost:3000"]'}


@pytest.mark.parametrize(
    "params",
    [
        {"limit": "0"},
        {"limit": "101"},
        {"action": "unknown.action"},
        {"from": "2026-10-12T00:00:00"},
        {"from": "1791763200"},
        {"from": "2026-10-12"},
        {"before_id": str(uuid4())},
        {"before_at": "2026-10-12T00:00:00Z"},
        {"from": "2026-10-13T00:00:00Z", "until": "2026-10-12T00:00:00Z"},
        {"from": "2026-10-12T00:00:00Z", "until": "2026-10-12T00:00:00Z"},
        {"until": "2026-99-12T00:00:00Z"},
        {"before_id": "private-sentinel"},
    ],
)
def test_aud15_invalid_query_never_calls_data_service(signers, params):
    app = create_app(ENV)
    app.state.jwt_verifier = signers["ES256"].verifier()

    class NoData:
        def audit_events(self, *args, **kwargs):
            raise AssertionError("Invalid query must not reach SQL.")

    app.state.access_service = NoData()
    with TestClient(app) as client:
        response = client.get(
            f"/v1/organizations/{uuid4()}/audit-events",
            params=params,
            headers={
                "Authorization": "Bearer " + signers["ES256"].token(),
            },
        )
    assert response.status_code == 422
    assert set(response.json()) == {"code", "message", "request_id"}
    assert "private-sentinel" not in response.text
    assert response.headers["Cache-Control"] == "no-store"


def test_aud05_missing_invalid_auth_and_binding_fail_closed(signers):
    app = create_app(ENV)
    path = f"/v1/organizations/{uuid4()}/audit-events"
    with TestClient(app) as client:
        assert client.get(path).status_code == 401
        assert (
            client.get(path, headers={"Authorization": "Bearer x"}).status_code == 503
        )
    app.state.jwt_verifier = signers["ES256"].verifier()
    with TestClient(app) as client:
        assert (
            client.get(path, headers={"Authorization": "Bearer x"}).status_code == 401
        )


def test_aud17_no_http_event_write_or_mutation_surface():
    with TestClient(create_app(ENV)) as client:
        path = f"/v1/organizations/{uuid4()}/audit-events"
        for method in ["post", "patch", "put", "delete"]:
            assert getattr(client, method)(path).status_code == 405
