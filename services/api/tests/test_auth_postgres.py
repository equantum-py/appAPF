import logging
import os
from uuid import uuid4

import pytest
from alembic import command
from fastapi.testclient import TestClient
from sqlalchemy import select, text

from app.factory import create_app
from app.organizations.access import AccessService
from tests.test_migrations import table

pytestmark = pytest.mark.postgres


def setup_app(database, signer, role="REFEREE"):
    admin, _, runtime, ids, _ = database
    with admin.begin() as connection:
        subject = connection.execute(
            select(table("users").c.supabase_subject).where(
                table("users").c.id == ids["user_a"]
            )
        ).scalar_one()
        connection.execute(
            table("memberships")
            .update()
            .where(table("memberships").c.id == ids["member_a_user_a"])
            .values(role=role)
        )
    app = create_app(
        {
            "APP_ENV": "test",
            "CORS_ORIGINS": '["http://localhost:3000"]',
            "SUPABASE_URL": "https://apf-fixture.example",
            "API_DATABASE_URL": os.environ["E02_TEST_RUNTIME_URL"],
        }
    )
    app.state.jwt_verifier = signer.verifier()
    app.state.access_service = AccessService(runtime)
    token = signer.token({"sub": str(subject), "user_metadata": {"role": "ADMIN"}})
    return app, token, ids, subject


def test_valid_identity_scope_and_metadata_admin_rejected(database, signers, caplog):
    app, token, ids, _ = setup_app(database, signers["ES256"])
    headers = {"Authorization": f"Bearer {token}"}
    with caplog.at_level(logging.INFO, logger="arbitral.access"):
        with TestClient(app) as client:
            assert client.get("/v1/me", headers=headers).json() == {
                "user_id": str(ids["user_a"])
            }
            mine = client.get("/v1/me/memberships", headers=headers)
            assert {x["organization_id"] for x in mine.json()} == {
                str(ids["a"]),
                str(ids["personal"]),
            }
            response = client.get(
                f"/v1/organizations/{ids['a']}/access", headers=headers
            )
            assert response.status_code == 200 and response.json()["role"] == "REFEREE"
            assert response.json()["can_review_technical"] is False
            assert (
                client.get(
                    f"/v1/organizations/{ids['b']}/access", headers=headers
                ).status_code
                == 403
            )
            assert (
                client.get(
                    f"/v1/organizations/{ids['a']}/memberships", headers=headers
                ).status_code
                == 403
            )
    assert token not in caplog.text


def test_admin_only_in_own_institution_and_disable_effective_immediately(
    database, signers
):
    app, token, ids, _ = setup_app(database, signers["RS256"], role="ADMIN")
    headers = {"Authorization": f"Bearer {token}"}
    with TestClient(app) as client:
        members = client.get(
            f"/v1/organizations/{ids['a']}/memberships", headers=headers
        )
        assert members.status_code == 200 and len(members.json()) == 2
        assert (
            client.get(
                f"/v1/organizations/{ids['b']}/memberships", headers=headers
            ).status_code
            == 403
        )
        assert (
            client.get(
                f"/v1/organizations/{ids['personal']}/memberships", headers=headers
            ).status_code
            == 403
        )
        with database[0].begin() as connection:
            connection.execute(
                table("memberships")
                .update()
                .where(table("memberships").c.id == ids["member_a_user_a"])
                .values(active=False)
            )
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/access", headers=headers
            ).status_code
            == 403
        )
        assert (
            str(ids["a"]) not in client.get("/v1/me/memberships", headers=headers).text
        )


def test_invalid_tokens_unknown_identity_and_invalid_org(database, signers):
    signer = signers["ES256"]
    app, token, ids, _ = setup_app(database, signer)
    with TestClient(app) as client:
        for candidate in [
            "bad",
            signer.token({"exp": 1}),
            signer.token({"iss": "https://other.example"}),
        ]:
            assert (
                client.get(
                    "/v1/me", headers={"Authorization": f"Bearer {candidate}"}
                ).status_code
                == 401
            )
        unknown = signer.token({"sub": str(uuid4())})
        assert (
            client.get(
                "/v1/me", headers={"Authorization": f"Bearer {unknown}"}
            ).status_code
            == 403
        )
        response = client.get(
            "/v1/organizations/not-uuid/access",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 422 and "input" not in response.text


def test_personal_history_hidden_and_transaction_context_does_not_leak(
    database, signers
):
    app, token, ids, _ = setup_app(database, signers["ES256"])
    with database[0].begin() as connection:
        subject_b = connection.execute(
            select(table("users").c.supabase_subject).where(
                table("users").c.id == ids["user_b"]
            )
        ).scalar_one()
    token_b = signers["ES256"].token({"sub": str(subject_b)})
    with TestClient(app) as client:
        assert (
            client.get(
                f"/v1/organizations/{ids['personal']}/access",
                headers={"Authorization": f"Bearer {token_b}"},
            ).status_code
            == 403
        )
        assert (
            client.get(
                f"/v1/organizations/{ids['personal']}/access",
                headers={"Authorization": f"Bearer {token}"},
            ).status_code
            == 200
        )
        mine_b = client.get(
            "/v1/me/memberships", headers={"Authorization": f"Bearer {token_b}"}
        )
        assert [x["organization_id"] for x in mine_b.json()] == [str(ids["b"])]
    with database[2].connect() as connection:
        for name in ["app.subject", "app.actor_id", "app.organization_id"]:
            assert connection.execute(
                text("SELECT current_setting(:v, true)"), {"v": name}
            ).scalar() in {None, ""}


def test_privileged_connection_fails_closed(database, signers):
    app, token, _, _ = setup_app(database, signers["ES256"])
    app.state.access_service = AccessService(database[0])
    with TestClient(app) as client:
        assert (
            client.get(
                "/v1/me", headers={"Authorization": f"Bearer {token}"}
            ).status_code
            == 503
        )


def test_scope_migration_can_revert_and_restore(database):
    admin, _, _, _, config = database
    command.downgrade(config, "0001_domain_schema")
    with admin.connect() as connection:
        condition = connection.exec_driver_sql(
            "SELECT qual FROM pg_policies WHERE schemaname='app' AND tablename='users'"
        ).scalar_one()
        assert "supabase_subject" not in condition
    command.upgrade(config, "head")
    with admin.connect() as connection:
        condition = connection.exec_driver_sql(
            "SELECT qual FROM pg_policies WHERE schemaname='app' AND tablename='users'"
        ).scalar_one()
        assert "supabase_subject" in condition
