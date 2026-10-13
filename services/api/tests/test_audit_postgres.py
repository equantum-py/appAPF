"""AUD requirements tested through HTTP and real PostgreSQL runtime/RLS."""

import logging
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, text
from sqlalchemy.exc import DBAPIError, SQLAlchemyError

from app.audit.schemas import Action
from app.audit.service import AuditService, AuthorizedContext, InvalidAuditEvent
from tests.test_auth_postgres import setup_app
from tests.test_migrations import scope, table

pytestmark = pytest.mark.postgres


@pytest.fixture
def audit_env(database, signers):
    app, token, ids, subject = setup_app(database, signers["ES256"], role="ADMIN")
    tokens = {"user_a": token}
    with database[0].begin() as connection:
        connection.execute(
            table("memberships")
            .update()
            .where(table("memberships").c.id == ids["member_b_user_b"])
            .values(role="ADMIN")
        )
        for key in ["user_b", "reviewer"]:
            sub = connection.execute(
                select(table("users").c.supabase_subject).where(
                    table("users").c.id == ids[key]
                )
            ).scalar_one()
            tokens[key] = signers["ES256"].token({"sub": str(sub)})
    return app, ids, tokens


def headers(token):
    return {"Authorization": f"Bearer {token}"}


def events(admin, action=None):
    with admin.connect() as connection:
        statement = select(table("audit_log"))
        if action is not None:
            statement = statement.where(table("audit_log").c.action == action)
        return connection.execute(statement).mappings().all()


def test_aud01_membership_read_generates_exact_event(database, audit_env):
    app, ids, tokens = audit_env
    with TestClient(app) as client:
        response = client.get(
            f"/v1/organizations/{ids['a']}/memberships",
            headers=headers(tokens["user_a"]),
        )
    assert response.status_code == 200
    rows = events(database[0], Action.MEMBERSHIPS_READ)
    assert len(rows) == 1
    row = rows[0]
    assert row["organization_id"] == ids["a"]
    assert row["actor_user_id"] == ids["user_a"]
    assert row["details"] == {
        "schema_version": 1,
        "request_id": response.headers["X-Request-ID"],
        "outcome": "SUCCESS",
        "resource_type": "organization",
        "resource_id": str(ids["a"]),
        "attributes": {"returned_count": 2},
    }
    assert row["created_at"].tzinfo is not None
    assert response.headers["Cache-Control"] == "no-store"


def test_aud02_audit_read_no_recursion_event_after_page(database, audit_env):
    app, ids, tokens = audit_env
    with TestClient(app) as client:
        response = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
        )
    assert response.status_code == 200 and response.json()["next_cursor"] is None
    assert {row["organization_id"] for row in response.json()["items"]} == {
        str(ids["a"])
    }
    assert len(events(database[0], Action.EVENTS_READ)) == 1
    event = events(database[0], Action.EVENTS_READ)[0]
    assert str(event["id"]) not in {x["id"] for x in response.json()["items"]}
    assert event["details"]["request_id"] == response.headers["X-Request-ID"]
    assert event["details"]["attributes"] == {"returned_count": 1}


def test_aud03_roles_cross_tenant_and_disabled(database, audit_env):
    app, ids, tokens = audit_env
    before = len(events(database[0]))
    with TestClient(app) as client:
        assert (
            client.get(
                f"/v1/organizations/{ids['b']}/audit-events",
                headers=headers(tokens["user_a"]),
            ).status_code
            == 403
        )
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/audit-events",
                headers=headers(tokens["user_b"]),
            ).status_code
            == 403
        )
        for role in ["REFEREE", "INSTRUCTOR", "REVIEWER"]:
            with database[0].begin() as connection:
                connection.execute(
                    table("memberships")
                    .update()
                    .where(table("memberships").c.id == ids["member_a_user_a"])
                    .values(role=role)
                )
            assert (
                client.get(
                    f"/v1/organizations/{ids['a']}/audit-events",
                    headers=headers(tokens["user_a"]),
                ).status_code
                == 403
            )
        with database[0].begin() as connection:
            connection.execute(
                table("memberships")
                .update()
                .where(table("memberships").c.id == ids["member_a_user_a"])
                .values(role="ADMIN", active=False)
            )
        assert (
            client.get(
                f"/v1/organizations/{ids['a']}/audit-events",
                headers=headers(tokens["user_a"]),
            ).status_code
            == 403
        )
    assert len(events(database[0])) == before


def test_aud04_personal_owner_and_institutional_roles(database, audit_env):
    app, ids, tokens = audit_env
    with database[0].begin() as connection:
        connection.execute(
            table("memberships")
            .update()
            .where(table("memberships").c.id == ids["member_a_reviewer"])
            .values(role="INSTRUCTOR")
        )
    with TestClient(app) as client:
        own = client.get(
            f"/v1/organizations/{ids['personal']}/audit-events",
            headers=headers(tokens["user_a"]),
        )
        assert own.status_code == 200
        for key in ["reviewer", "user_b"]:
            assert (
                client.get(
                    f"/v1/organizations/{ids['personal']}/audit-events",
                    headers=headers(tokens[key]),
                ).status_code
                == 403
            )
        with database[0].begin() as connection:
            connection.execute(
                table("memberships")
                .update()
                .where(table("memberships").c.id == ids["member_personal_user_a"])
                .values(active=False)
            )
        assert (
            client.get(
                f"/v1/organizations/{ids['personal']}/audit-events",
                headers=headers(tokens["user_a"]),
            ).status_code
            == 403
        )


def test_aud05_invalid_expired_forged_unknown_identity(database, audit_env, signers):
    app, ids, tokens = audit_env
    from tests.auth_helpers import Signer

    forged = Signer("ES256").token()
    candidates = [
        None,
        "bad",
        signers["ES256"].token({"exp": 1}),
        forged,
        signers["ES256"].token(),
    ]
    before = len(events(database[0]))
    with TestClient(app) as client:
        for token, status in zip(candidates, [401, 401, 401, 401, 403], strict=True):
            response = client.get(
                f"/v1/organizations/{ids['a']}/audit-events",
                headers={} if token is None else headers(token),
            )
            assert response.status_code == status
    assert len(events(database[0])) == before


@pytest.mark.parametrize(
    "action,fixture,resource,attrs",
    [
        (
            Action.SITUATION_PUBLISHED,
            "version_a",
            "situation_version",
            {"version_number": 1},
        ),
        (
            Action.PHYSICAL_PUBLISHED,
            "physical_version",
            "physical_exercise_version",
            {"version_number": 1},
        ),
        (Action.RUN_STARTED, "run_physical", "training_run", {"modality": "PHYSICAL"}),
        (
            Action.RUN_COMPLETED,
            "run_cognitive",
            "training_run",
            {"modality": "COGNITIVE_DECISION"},
        ),
        (Action.PHYSICAL_RESULT, None, "physical_result", {}),
        (Action.EVALUATION_REVIEW, None, "evaluation_review", {}),
    ],
)
def test_aud06_service_future_catalog_fixtures(
    database, action, fixture, resource, attrs
):
    # These are format/transaction fixtures, not future product operations.
    admin, _, runtime, ids, _ = database
    resource_id = ids[fixture] if fixture else uuid4()
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        event_id = AuditService().record(
            connection,
            AuthorizedContext(ids["user_a"], ids["a"]),
            action,
            resource,
            resource_id,
            uuid4(),
            attrs,
        )
    row = next(x for x in events(admin) if x["id"] == event_id)
    assert row["action"] == action and row["details"]["resource_id"] == str(resource_id)
    assert row["details"]["attributes"] == attrs


def test_aud08_context_and_cross_tenant_insert(database, audit_env):
    app, ids, _ = audit_env
    service = AuditService()
    with database[2].begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        for context, resource in [
            (AuthorizedContext(ids["user_a"], ids["b"]), ids["b"]),
            (AuthorizedContext(ids["user_b"], ids["a"]), ids["a"]),
            (AuthorizedContext(ids["user_a"], ids["a"]), ids["b"]),
            (None, ids["a"]),
        ]:
            with pytest.raises(InvalidAuditEvent):
                service.record(
                    connection,
                    context,
                    Action.EVENTS_READ,
                    "organization",
                    resource,
                    uuid4(),
                    {"returned_count": 0},
                )
    with pytest.raises(DBAPIError) as error:
        with database[2].begin() as connection:
            scope(connection, ids["a"], ids["user_a"])
            connection.execute(
                table("audit_log")
                .insert()
                .values(
                    id=uuid4(),
                    organization_id=ids["b"],
                    actor_user_id=ids["user_a"],
                    action="fixture",
                    details={},
                )
            )
    assert error.value.orig.sqlstate == "42501"


def test_aud09_runtime_immutable_and_unprivileged(database):
    _, _, runtime, ids, _ = database
    original = events(database[0])
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        assert (
            connection.exec_driver_sql(
                "SELECT rolsuper OR rolbypassrls OR rolcreaterole OR rolcreatedb "
                "FROM pg_roles WHERE rolname=current_user"
            ).scalar()
            is False
        )
        assert (
            connection.exec_driver_sql(
                "SELECT nspowner=current_user::regrole "
                "FROM pg_namespace WHERE nspname='app'"
            ).scalar()
            is False
        )
    for statement in [
        "UPDATE app.audit_log SET action='changed'",
        "DELETE FROM app.audit_log",
        "TRUNCATE app.audit_log",
    ]:
        with pytest.raises(DBAPIError) as error:
            with runtime.begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "42501"
    assert events(database[0]) == original


def test_aud10_owner_trigger_guards_update_and_delete(database):
    _, migrator, _, ids, _ = database
    original = events(database[0])
    for statement in [
        "UPDATE app.audit_log SET action='changed'",
        "DELETE FROM app.audit_log",
    ]:
        with pytest.raises(DBAPIError) as error:
            with migrator.begin() as connection:
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "23514"
    assert events(database[0]) == original


@pytest.mark.parametrize("path", ["memberships", "audit-events"])
def test_aud11_insert_failure_never_releases_data(database, audit_env, caplog, path):
    app, ids, tokens = audit_env
    original = events(database[0])

    class FailAfterInsert(AuditService):
        def record(self, *args, **kwargs):
            super().record(*args, **kwargs)
            raise SQLAlchemyError("secret-sentinel-database-password")

    app.state.access_service.audit_service = FailAfterInsert()
    with caplog.at_level(logging.INFO, logger="arbitral.access"):
        with TestClient(app) as client:
            response = client.get(
                f"/v1/organizations/{ids['a']}/{path}",
                headers=headers(tokens["user_a"]),
            )
    assert response.status_code == 503 and "items" not in response.text
    assert "secret-sentinel" not in response.text + caplog.text
    assert events(database[0]) == original


def test_aud12_mutation_event_transaction_atomicity(database):
    admin, _, runtime, ids, _ = database
    original = events(admin)
    context = AuthorizedContext(ids["user_a"], ids["a"])
    for success in [False, True]:
        try:
            with runtime.begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.execute(
                    table("situations")
                    .update()
                    .where(table("situations").c.id == ids["situation_a"])
                    .values(title="synthetic mutation")
                )
                AuditService().record(
                    connection,
                    context,
                    Action.SITUATION_PUBLISHED,
                    "situation_version",
                    ids["version_a"],
                    uuid4(),
                    {"version_number": 1},
                )
                if not success:
                    raise RuntimeError("synthetic rollback")
        except RuntimeError:
            pass
        with admin.connect() as connection:
            title = connection.execute(
                select(table("situations").c.title).where(
                    table("situations").c.id == ids["situation_a"]
                )
            ).scalar_one()
        assert title == ("synthetic mutation" if success else "fixture")
        assert len(events(admin)) == len(original) + int(success)


def test_aud12_audit_validation_failure_reverts_mutation(database):
    admin, _, runtime, ids, _ = database
    original = events(admin)
    with pytest.raises(InvalidAuditEvent):
        with runtime.begin() as connection:
            scope(connection, ids["a"], ids["user_a"])
            connection.execute(
                table("situations")
                .update()
                .where(table("situations").c.id == ids["situation_a"])
                .values(title="synthetic must rollback")
            )
            AuditService().record(
                connection,
                AuthorizedContext(ids["user_a"], ids["a"]),
                Action.SITUATION_PUBLISHED,
                "situation_version",
                ids["version_a"],
                uuid4(),
                {"version_number": -1},
            )
    with admin.connect() as connection:
        assert (
            connection.execute(
                select(table("situations").c.title).where(
                    table("situations").c.id == ids["situation_a"]
                )
            ).scalar_one()
            == "fixture"
        )
    assert events(admin) == original


def test_aud13_pool_context_clear_after_success_and_failure(database, audit_env):
    app, ids, tokens = audit_env
    with TestClient(app) as client:
        for org, key, status in [
            ("a", "user_a", 200),
            ("a", "user_b", 403),
            ("b", "user_b", 200),
            ("personal", "user_a", 200),
        ]:
            response = client.get(
                f"/v1/organizations/{ids[org]}/audit-events",
                headers=headers(tokens[key]),
            )
            assert response.status_code == status
            if status == 200:
                assert all(
                    x["organization_id"] == str(ids[org])
                    for x in response.json()["items"]
                )
    with database[2].connect() as connection:
        for name in ["app.subject", "app.actor_id", "app.organization_id"]:
            assert connection.execute(
                text("SELECT current_setting(:v,true)"), {"v": name}
            ).scalar() in {None, ""}


def test_aud14_stable_cursor_filters_limits(database, audit_env):
    app, ids, tokens = audit_env
    at = datetime(2026, 1, 1, tzinfo=UTC)
    seeded = [uuid4() for _ in range(123)]
    with database[0].begin() as connection:
        for event_id in seeded:
            connection.execute(
                table("audit_log")
                .insert()
                .values(
                    id=event_id,
                    organization_id=ids["a"],
                    actor_user_id=ids["user_a"],
                    action=Action.MEMBERSHIPS_READ,
                    created_at=at,
                    details={"resource_id": str(ids["a"]), "outcome": "SUCCESS"},
                )
            )
        connection.execute(
            table("audit_log")
            .insert()
            .values(
                id=uuid4(),
                organization_id=ids["b"],
                actor_user_id=ids["user_b"],
                action=Action.MEMBERSHIPS_READ,
                created_at=at,
                details={},
            )
        )
    params = {
        "limit": 100,
        "action": Action.MEMBERSHIPS_READ,
        "from": at.isoformat(),
        "until": (at + timedelta(seconds=1)).isoformat(),
    }
    with TestClient(app) as client:
        first = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
            params=params,
        ).json()
        assert len(first["items"]) == 100
        assert first["next_cursor"] is not None
        second = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
            params={**params, **first["next_cursor"]},
        ).json()
        assert len(second["items"]) == 23 and second["next_cursor"] is None
        combined = [UUID(x["id"]) for x in first["items"] + second["items"]]
        assert combined == sorted(seeded, reverse=True)
        exclusive = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
            params={"until": at.isoformat()},
        ).json()
        assert not exclusive["items"]
        inclusive = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
            params={**params, "limit": 1},
        ).json()
        assert len(inclusive["items"]) == 1


def test_aud16_legacy_details_never_leak_or_mutate(database, audit_env):
    app, ids, tokens = audit_env
    bad_id = uuid4()
    raw = {
        "request_id": "secret-sentinel",
        "resource_type": "password",
        "resource_id": "secret-sentinel",
        "outcome": "secret-sentinel",
        "schema_version": "secret-sentinel",
        "attributes": {"returned_count": "secret-sentinel", "secret": "hidden"},
        "token": "secret-sentinel",
    }
    with database[0].begin() as connection:
        connection.execute(
            table("audit_log")
            .insert()
            .values(
                id=bad_id,
                organization_id=ids["a"],
                actor_user_id=ids["user_a"],
                action=Action.MEMBERSHIPS_READ,
                details=raw,
            )
        )
        connection.execute(
            table("audit_log")
            .insert()
            .values(
                id=uuid4(),
                organization_id=ids["a"],
                actor_user_id=ids["user_a"],
                action="secret-sentinel",
                details=raw,
            )
        )
    with TestClient(app) as client:
        response = client.get(
            f"/v1/organizations/{ids['a']}/audit-events",
            headers=headers(tokens["user_a"]),
        )
    assert response.status_code == 200
    assert "secret-sentinel" not in response.text and "hidden" not in response.text
    projected = next(x for x in response.json()["items"] if x["id"] == str(bad_id))
    assert projected["details"] == {}
    assert any(x["action"] == "legacy.unknown" for x in response.json()["items"])
    with database[0].connect() as connection:
        assert (
            connection.execute(
                select(table("audit_log").c.details).where(
                    table("audit_log").c.id == bad_id
                )
            ).scalar_one()
            == raw
        )
