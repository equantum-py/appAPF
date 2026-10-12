from fastapi.testclient import TestClient

from app.factory import create_app
from tests.test_api import ENV


def test_no_credentials_denied_and_missing_binding_never_opens_access():
    with TestClient(create_app(ENV)) as client:
        for path in ["/v1/me", "/v1/me/memberships"]:
            assert client.get(path).status_code == 401
            response = client.get(path, headers={"Authorization": "Bearer fixture"})
            assert response.status_code == 503
            assert response.headers["Cache-Control"] == "no-store"


def test_cors_allows_authorization_from_explicit_origin():
    with TestClient(create_app(ENV)) as client:
        response = client.options(
            "/v1/me",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Authorization",
            },
        )
        assert response.status_code == 200
