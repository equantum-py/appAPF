from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.factory import create_app

ENV = {"APP_ENV": "test", "CORS_ORIGINS": '["http://localhost:3000"]'}


@pytest.mark.parametrize(
    "params",
    [
        {"limit": 0},
        {"limit": 101},
        {"before_id": str(uuid4())},
        {"before_at": "2026-10-13T00:00:00Z"},
        {"before_at": "2026-10-13"},
        {"before_at": "1791849600"},
        {"before_at": "2026-10-13T00:00:00"},
        {"before_id": "secret-sentinel"},
    ],
)
def test_rul14_invalid_query_never_reaches_database(signers, params):
    app = create_app(ENV)
    app.state.jwt_verifier = signers["ES256"].verifier()
    # No bound DB; 422 instead of 503 proves invalid query stops before service.
    with TestClient(app) as client:
        response = client.get(
            f"/v1/organizations/{uuid4()}/rulebook-editions",
            params=params,
            headers={"Authorization": "Bearer " + signers["ES256"].token()},
        )
    assert response.status_code == 422
    assert "secret-sentinel" not in response.text
    assert response.headers["Cache-Control"] == "no-store"


def test_rul16_cors_post_openapi_and_no_mutation_methods():
    app = create_app(ENV)
    path = f"/v1/organizations/{uuid4()}/rulebook-editions"
    with TestClient(app) as client:
        for origin, expected in [
            ("http://localhost:3000", 200),
            ("https://other.example", 400),
        ]:
            response = client.options(
                path,
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "Authorization,Content-Type",
                },
            )
            assert response.status_code == expected
        for target in [path, path + f"/{uuid4()}"]:
            for method in ["put", "patch", "delete"]:
                assert getattr(client, method)(target).status_code == 405
    spec = app.openapi()
    post = spec["paths"]["/v1/organizations/{organization_id}/rulebook-editions"][
        "post"
    ]
    assert set(post["responses"]) >= {"201", "401", "403", "409", "422", "503"}
