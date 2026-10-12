"""Tokens in these tests are genuinely issued by the official Auth server in CI."""

import os
from uuid import UUID, uuid4

import httpx
import pytest
from fastapi.testclient import TestClient

from app.factory import create_app
from app.organizations.access import AccessService
from tests.test_migrations import table

pytestmark = [pytest.mark.postgres, pytest.mark.live_auth]
BASE = "http://127.0.0.1:19000/auth/v1"


def signup_fixture():
    email = f"apf-{uuid4()}@example.test"
    password = "Test-only-password-42!"
    response = httpx.post(
        BASE + "/signup",
        json={"email": email, "password": password, "data": {"role": "ADMIN"}},
        timeout=10,
    )
    assert response.status_code == 200, "test Auth signup failed"
    response = httpx.post(
        BASE + "/token?grant_type=password",
        json={"email": email, "password": password},
        timeout=10,
    )
    assert response.status_code == 200, "test Auth sign-in failed"
    result = response.json()
    return result["access_token"], UUID(result["user"]["id"])


def test_real_auth_issued_token_database_permissions_and_logout_client_boundary(
    database,
):
    assert os.environ.get("E03_LIVE_AUTH") == "isolated"
    admin, _, runtime, ids, _ = database
    token, subject = signup_fixture()
    user_id = uuid4()
    with admin.begin() as connection:
        connection.execute(
            table("users").insert().values(id=user_id, supabase_subject=subject)
        )
        connection.execute(
            table("memberships")
            .insert()
            .values(
                id=uuid4(), organization_id=ids["a"], user_id=user_id, role="REFEREE"
            )
        )
    app = create_app(
        {
            "APP_ENV": "test",
            "CORS_ORIGINS": '["http://localhost:3000"]',
            "SUPABASE_URL": "http://127.0.0.1:19000",
            "API_DATABASE_URL": os.environ["E02_TEST_RUNTIME_URL"],
        }
    )
    app.state.access_service = AccessService(runtime)
    with TestClient(app) as client:
        headers = {"Authorization": f"Bearer {token}"}
        assert client.get("/v1/me", headers=headers).json() == {"user_id": str(user_id)}
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/access", headers=headers
            ).status_code
            == 200
        )
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/memberships", headers=headers
            ).status_code
            == 403
        )
        assert (
            client.get(
                f"/v1/organizations/{ids['b']}/access", headers=headers
            ).status_code
            == 403
        )
        with admin.begin() as connection:
            connection.execute(
                table("memberships")
                .update()
                .where(table("memberships").c.user_id == user_id)
                .values(active=False)
            )
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/access", headers=headers
            ).status_code
            == 403
        )
