"""Edition acceptance: real PostgreSQL, references, transactions and HTTP."""

import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime
from threading import Barrier
from uuid import UUID, uuid4

import pytest
from alembic import command
from fastapi.testclient import TestClient
from sqlalchemy import select, text
from sqlalchemy.exc import DBAPIError, SQLAlchemyError

from app.audit.schemas import Action
from app.audit.service import AuditService, AuthorizedContext
from app.organizations.access import AccessService, ForbiddenAccess
from app.rules.service import EditionNotFound, RulesService
from tests.test_audit_postgres import audit_env as rules_env
from tests.test_audit_postgres import events, headers
from tests.test_migrations import scope, table

pytestmark = pytest.mark.postgres
_ = rules_env  # Fixture import deliberately shares the E-04 synthetic identities.


def path(ids, org="a", edition=None):
    result = f"/v1/organizations/{ids[org]}/rulebook-editions"
    return result if edition is None else result + f"/{edition}"


def editions(admin):
    with admin.connect() as connection:
        return (
            connection.execute(
                select(table("rulebook_editions")).order_by(
                    table("rulebook_editions").c.id
                )
            )
            .mappings()
            .all()
        )


def test_rul01_create_trim_server_identity_audit(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        response = client.post(
            path(ids),
            headers=headers(tokens["user_a"]),
            json={"label": "  Edición sintética 2026-A  "},
        )
    assert response.status_code == 201
    row = response.json()
    UUID(row["id"])
    assert row["organization_id"] == str(ids["a"])
    assert row["label"] == "Edición sintética 2026-A"
    assert datetime.fromisoformat(row["created_at"]).tzinfo is not None
    assert response.headers["Location"] == path(ids, edition=row["id"])
    assert response.headers["Cache-Control"] == "no-store"
    created = events(database[0], Action.EDITION_CREATED)
    assert len(created) == 1 and created[0]["actor_user_id"] == ids["user_a"]
    assert created[0]["details"]["request_id"] == response.headers["X-Request-ID"]


def test_rul02_roles_read_own_editions(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        for role in ["ADMIN", "REFEREE", "INSTRUCTOR", "REVIEWER"]:
            with database[0].begin() as connection:
                connection.execute(
                    table("memberships")
                    .update()
                    .where(table("memberships").c.id == ids["member_a_user_a"])
                    .values(role=role)
                )
            page = client.get(path(ids), headers=headers(tokens["user_a"]))
            assert page.status_code == 200
            assert {r["organization_id"] for r in page.json()["items"]} == {
                str(ids["a"])
            }
            detail = client.get(
                path(ids, edition=ids["edition_a"]), headers=headers(tokens["user_a"])
            )
            assert detail.status_code == 200
    assert len(events(database[0], Action.EDITIONS_READ)) == 4
    assert len(events(database[0], Action.EDITION_READ)) == 4


def test_rul03_write_roles_foreign_and_disabled(database, rules_env):
    app, ids, tokens = rules_env
    original = editions(database[0])
    original_events = len(events(database[0]))
    with TestClient(app) as client:
        for role in ["REFEREE", "INSTRUCTOR", "REVIEWER"]:
            with database[0].begin() as connection:
                connection.execute(
                    table("memberships")
                    .update()
                    .where(table("memberships").c.id == ids["member_a_user_a"])
                    .values(role=role)
                )
            assert (
                client.post(
                    path(ids),
                    headers=headers(tokens["user_a"]),
                    json={"label": "forbidden"},
                ).status_code
                == 403
            )
        assert (
            client.get(path(ids, "b"), headers=headers(tokens["user_a"])).status_code
            == 403
        )
        assert (
            client.post(
                path(ids, "b"),
                headers=headers(tokens["user_a"]),
                json={"label": "forbidden"},
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
            client.get(path(ids), headers=headers(tokens["user_a"])).status_code == 403
        )
        assert (
            client.post(
                path(ids),
                headers=headers(tokens["user_a"]),
                json={"label": "forbidden"},
            ).status_code
            == 403
        )
    assert editions(database[0]) == original
    assert len(events(database[0])) == original_events


def test_rul04_personal_owner_and_others(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        own = client.post(
            path(ids, "personal"),
            headers=headers(tokens["user_a"]),
            json={"label": "Personal sintética"},
        )
        assert own.status_code == 201
        assert (
            client.get(
                own.headers["Location"], headers=headers(tokens["user_a"])
            ).status_code
            == 200
        )
        for key in ["user_b", "reviewer"]:
            assert (
                client.get(
                    path(ids, "personal"), headers=headers(tokens[key])
                ).status_code
                == 403
            )
            assert (
                client.post(
                    path(ids, "personal"),
                    headers=headers(tokens[key]),
                    json={"label": "forbidden"},
                ).status_code
                == 403
            )


def test_rul05_auth_missing_expired_forged_unknown(database, rules_env, signers):
    app, ids, _ = rules_env
    from tests.auth_helpers import Signer

    candidates = [
        None,
        "bad",
        signers["ES256"].token({"exp": 1}),
        Signer("ES256").token(),
        signers["ES256"].token(),
    ]
    original = editions(database[0])
    with TestClient(app) as client:
        for token, status in zip(candidates, [401, 401, 401, 401, 403], strict=True):
            h = {} if token is None else headers(token)
            assert (
                client.post(path(ids), headers=h, json={"label": "no-auth"}).status_code
                == status
            )
            assert client.get(path(ids), headers=h).status_code == status
    assert editions(database[0]) == original


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"label": 1},
        {"label": " "},
        {"label": "x" * 101},
        {"label": "x\ny"},
        {"label": "valid", "role": "ADMIN"},
        {"label": "valid", "id": str(uuid4())},
        {"label": "valid", "organization_id": str(uuid4())},
        {"label": "valid", "created_at": "2026-10-13T00:00:00Z"},
    ],
)
def test_rul06_invalid_http_body_no_persistence(database, rules_env, body):
    app, ids, tokens = rules_env
    before = editions(database[0])
    with TestClient(app) as client:
        response = client.post(path(ids), headers=headers(tokens["user_a"]), json=body)
    assert response.status_code == 422
    assert set(response.json()) == {"code", "message", "request_id"}
    assert editions(database[0]) == before


def test_rul07_duplicates_case_and_tenant(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        for org, token, label, expected in [
            ("a", "user_a", "Edition A", 201),
            ("a", "user_a", " Edition A ", 409),
            ("a", "user_a", "edition a", 201),
            ("b", "user_b", "Edition A", 201),
        ]:
            assert (
                client.post(
                    path(ids, org),
                    headers=headers(tokens[token]),
                    json={"label": label},
                ).status_code
                == expected
            )
    assert len(events(database[0], Action.EDITION_CREATED)) == 3


def test_rul08_concurrent_creation_real_transactions(database, rules_env):
    app, ids, tokens = rules_env
    barrier = Barrier(2)

    class RacingAccess(AccessService):
        def authorized_organization(self, *args):
            result = super().authorized_organization(*args)
            barrier.wait(
                timeout=10
            )  # Both live PostgreSQL transactions have authorized.
            return result

    app.state.access_service = RacingAccess(database[2])

    def submit(_):
        with TestClient(app) as client:
            return client.post(
                path(ids),
                headers=headers(tokens["user_a"]),
                json={"label": "Concurrent synthetic"},
            ).status_code

    with ThreadPoolExecutor(max_workers=2) as pool:
        responses = list(pool.map(submit, [0, 1]))
    assert sorted(responses) == [201, 409]
    assert (
        len([r for r in editions(database[0]) if r["label"] == "Concurrent synthetic"])
        == 1
    )
    assert len(events(database[0], Action.EDITION_CREATED)) == 1


def test_rul09_unknown_foreign_detail_and_internal_resolver(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        for identifier in [uuid4(), ids["edition_b"]]:
            assert (
                client.get(
                    path(ids, edition=identifier), headers=headers(tokens["user_a"])
                ).status_code
                == 404
            )
    service = RulesService(app.state.access_service)
    with database[2].begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        context = AuthorizedContext(ids["user_a"], ids["a"])
        assert (
            service.require_edition(connection, context, ids["edition_a"])["id"]
            == ids["edition_a"]
        )
        for identifier in [uuid4(), ids["edition_b"]]:
            with pytest.raises(EditionNotFound):
                service.require_edition(connection, context, identifier)
        with pytest.raises(ForbiddenAccess):
            service.require_edition(
                connection, AuthorizedContext(ids["user_b"], ids["b"]), ids["edition_b"]
            )
    assert not events(database[0], Action.EDITION_READ)


def test_rul10_real_foreign_keys_for_situation_and_evaluation(database):
    admin, _, runtime, ids, _ = database
    with admin.connect() as connection:
        version = dict(
            connection.execute(
                select(table("situation_versions")).where(
                    table("situation_versions").c.id == ids["version_a"]
                )
            )
            .mappings()
            .one()
        )
        attempt = dict(
            connection.execute(
                select(table("attempts")).where(
                    table("attempts").c.id == ids["attempt"]
                )
            )
            .mappings()
            .one()
        )
        evaluation = dict(
            connection.execute(
                select(table("evaluations")).where(
                    table("evaluations").c.id == ids["evaluation"]
                )
            )
            .mappings()
            .one()
        )
    for edition in [uuid4(), ids["edition_b"]]:
        with pytest.raises(DBAPIError) as error:
            with runtime.begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.execute(
                    table("situation_versions")
                    .insert()
                    .values(
                        **{
                            **version,
                            "id": uuid4(),
                            "version_number": 2,
                            "rulebook_edition_id": edition,
                        }
                    )
                )
        assert error.value.orig.sqlstate == "23503"
    new_attempt = uuid4()
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        connection.execute(
            table("attempts")
            .insert()
            .values(**{**attempt, "id": new_attempt, "idempotency_key": str(uuid4())})
        )
    with pytest.raises(DBAPIError) as error:
        with runtime.begin() as connection:
            scope(connection, ids["a"], ids["user_a"])
            connection.execute(
                table("evaluations")
                .insert()
                .values(
                    **{
                        **evaluation,
                        "id": uuid4(),
                        "attempt_id": new_attempt,
                        "rulebook_edition_id": ids["edition_b"],
                    }
                )
            )
    assert error.value.orig.sqlstate == "23503"
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        connection.execute(
            table("evaluations")
            .insert()
            .values(**{**evaluation, "id": uuid4(), "attempt_id": new_attempt})
        )


def reference_snapshot(connection):
    return {
        name: connection.execute(select(table(name))).mappings().all()
        for name in ["rulebook_editions", "situation_versions", "evaluations"]
    }


def test_rul11_immutable_referenced_editions(database, rules_env):
    app, ids, tokens = rules_env
    with database[0].connect() as connection:
        original = reference_snapshot(connection)
    with TestClient(app) as client:
        assert (
            client.post(
                path(ids),
                headers=headers(tokens["user_a"]),
                json={"label": "New synthetic edition"},
            ).status_code
            == 201
        )
    for statement in [
        "UPDATE app.rulebook_editions SET label='changed'",
        "DELETE FROM app.rulebook_editions",
        "TRUNCATE app.rulebook_editions",
    ]:
        with pytest.raises(DBAPIError) as error:
            with database[2].begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "42501"
    for statement in [
        "UPDATE app.rulebook_editions SET label='changed'",
        "DELETE FROM app.rulebook_editions",
    ]:
        with pytest.raises(DBAPIError) as error:
            with database[1].begin() as connection:
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "23514"
    with database[0].connect() as connection:
        after = reference_snapshot(connection)
    assert after["situation_versions"] == original["situation_versions"]
    assert after["evaluations"] == original["evaluations"]
    assert all(r in after["rulebook_editions"] for r in original["rulebook_editions"])


@pytest.mark.parametrize("operation", ["create", "page", "detail"])
def test_rul12_audit_failure_atomic_and_private(database, rules_env, caplog, operation):
    app, ids, tokens = rules_env
    original = editions(database[0])
    before_events = events(database[0])

    class FailingAudit(AuditService):
        def record(self, *args, **kwargs):
            super().record(*args, **kwargs)
            raise SQLAlchemyError("secret-sentinel-private-db")

    app.state.access_service.audit_service = FailingAudit()
    with caplog.at_level(logging.INFO, logger="arbitral.access"):
        with TestClient(app) as client:
            if operation == "create":
                response = client.post(
                    path(ids),
                    headers=headers(tokens["user_a"]),
                    json={"label": "must rollback"},
                )
            else:
                response = client.get(
                    path(
                        ids, edition=ids["edition_a"] if operation == "detail" else None
                    ),
                    headers=headers(tokens["user_a"]),
                )
    assert response.status_code == 503
    assert set(response.json()) == {"code", "message", "request_id"}
    assert "secret-sentinel" not in response.text + caplog.text
    assert editions(database[0]) == original and events(database[0]) == before_events


def test_rul13_migration_with_existing_references(database):
    admin, _, _, ids, config = database
    with admin.connect() as connection:
        original = reference_snapshot(connection)
    for target, guarded in [
        ("0002_identity_scope", False),
        ("head", True),
        ("0002_identity_scope", False),
        ("head", True),
    ]:
        if guarded:
            command.upgrade(config, target)
        else:
            command.downgrade(config, target)
        with admin.connect() as connection:
            assert reference_snapshot(connection) == original
            assert connection.exec_driver_sql(
                "SELECT has_table_privilege('apf_runtime',"
                "'app.rulebook_editions','UPDATE')"
            ).scalar() is (not guarded)
            assert connection.exec_driver_sql(
                "SELECT has_table_privilege('apf_runtime',"
                "'app.rulebook_editions','DELETE')"
            ).scalar() is (not guarded)
            assert (
                connection.exec_driver_sql(
                    "SELECT has_table_privilege('apf_runtime',"
                    "'app.rulebook_editions','TRUNCATE')"
                ).scalar()
                is False
            )
            assert (
                connection.exec_driver_sql(
                    "SELECT EXISTS (SELECT 1 FROM pg_trigger "
                    "WHERE tgname='immutable_edition' "
                    "AND tgrelid='app.rulebook_editions'::regclass)"
                ).scalar()
                is guarded
            )
    command.check(config)


def test_rul14_stable_pagination_equal_timestamps(database, rules_env):
    app, ids, tokens = rules_env
    at = datetime(2026, 1, 1, tzinfo=UTC)
    seeded = [uuid4() for _ in range(122)]
    with database[0].begin() as connection:
        for identifier in seeded:
            connection.execute(
                table("rulebook_editions")
                .insert()
                .values(
                    id=identifier,
                    organization_id=ids["a"],
                    label=str(identifier),
                    created_at=at,
                )
            )
    with TestClient(app) as client:
        seen = []
        params = {"limit": 100}
        while True:
            response = client.get(
                path(ids), params=params, headers=headers(tokens["user_a"])
            )
            assert response.status_code == 200
            page = response.json()
            seen += [UUID(x["id"]) for x in page["items"]]
            if page["next_cursor"] is None:
                break
            params = {"limit": 100, **page["next_cursor"]}
    assert seen == [ids["edition_a"], *sorted(seeded, reverse=True)]


def test_rul15_events_ids_without_labels_or_secrets(database, rules_env, caplog):
    app, ids, tokens = rules_env
    with caplog.at_level(logging.INFO, logger="arbitral.access"):
        with TestClient(app) as client:
            created = client.post(
                path(ids),
                headers=headers(tokens["user_a"]),
                json={"label": "secret-sentinel-label"},
            )
            client.get(path(ids), headers=headers(tokens["user_a"]))
            client.get(created.headers["Location"], headers=headers(tokens["user_a"]))
            audits = client.get(
                f"/v1/organizations/{ids['a']}/audit-events",
                headers=headers(tokens["user_a"]),
            )
    new_events = [r for r in events(database[0]) if r["action"].startswith("rulebook.")]
    assert {r["action"] for r in new_events} == {
        Action.EDITION_CREATED,
        Action.EDITION_READ,
        Action.EDITIONS_READ,
    }
    for row in new_events:
        assert row["actor_user_id"] == ids["user_a"]
        assert row["organization_id"] == ids["a"]
        UUID(row["details"]["request_id"])
        assert "secret-sentinel" not in str(row["details"])
    assert "secret-sentinel" not in caplog.text + audits.text


def test_rul16_scope_pool_clear_after_reads_writes_and_errors(database, rules_env):
    app, ids, tokens = rules_env
    with TestClient(app) as client:
        for org, key, expected in [
            ("a", "user_a", 200),
            ("a", "user_b", 403),
            ("b", "user_b", 200),
            ("personal", "user_a", 200),
        ]:
            response = client.get(path(ids, org), headers=headers(tokens[key]))
            assert response.status_code == expected
            if expected == 200:
                assert all(
                    x["organization_id"] == str(ids[org])
                    for x in response.json()["items"]
                )
    with database[2].connect() as connection:
        for name in ["app.subject", "app.actor_id", "app.organization_id"]:
            assert connection.execute(
                text("SELECT current_setting(:v,true)"), {"v": name}
            ).scalar() in {None, ""}
