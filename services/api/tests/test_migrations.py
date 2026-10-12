"""Real PostgreSQL tests; fail rather than silently skip if the target is missing."""

from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

import pytest
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from sqlalchemy import create_engine, inspect, select, text
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import DBAPIError, IntegrityError

from app.shared.database import register_models
from app.shared.test_database import isolated_test_url, require_database_identity

pytestmark = pytest.mark.postgres
metadata = register_models()


def scope(connection, organization, actor):
    connection.execute(
        text("SELECT set_config('app.organization_id', :v, true)"),
        {"v": str(organization)},
    )
    connection.execute(
        text("SELECT set_config('app.actor_id', :v, true)"), {"v": str(actor)}
    )


def table(name):
    return metadata.tables[f"app.{name}"]


@pytest.fixture
def database():
    admin = create_engine(isolated_test_url("E02_TEST_ADMIN_URL"))
    runtime = create_engine(isolated_test_url("E02_TEST_RUNTIME_URL"))
    migrator = create_engine(isolated_test_url("E02_TEST_MIGRATOR_URL"))
    config = Config("alembic.ini")
    with admin.connect() as connection:
        require_database_identity(connection)
        version = int(connection.exec_driver_sql("SHOW server_version_num").scalar())
        assert 170000 <= version < 180000
    command.downgrade(config, "base")
    command.upgrade(config, "head")
    ids = {}
    with admin.begin() as connection:

        def add(name, key, **values):
            identifier = uuid4()
            connection.execute(table(name).insert().values(id=identifier, **values))
            ids[key] = identifier
            return identifier

        for user in ["user_a", "reviewer", "user_b"]:
            add("users", user, supabase_subject=uuid4())
        for org in ["a", "b"]:
            add("organizations", org, name=org, kind="INSTITUTIONAL")
        add(
            "organizations",
            "personal",
            name="private",
            kind="PERSONAL",
            owner_user_id=ids["user_a"],
        )
        for org, user, role in [
            ("a", "user_a", "REFEREE"),
            ("a", "reviewer", "REVIEWER"),
            ("b", "user_b", "REFEREE"),
            ("personal", "user_a", "REFEREE"),
        ]:
            add(
                "memberships",
                f"member_{org}_{user}",
                organization_id=ids[org],
                user_id=ids[user],
                role=role,
            )
        for org, user in [("a", "user_a"), ("b", "user_b")]:
            common = {"organization_id": ids[org]}
            add("rulebook_editions", f"edition_{org}", **common, label="fixture")
            add(
                "video_assets",
                f"video_{org}",
                **common,
                object_key=f"{org}/fixture",
                mime_type="video/mp4",
                size_bytes=10,
                rights_reference="synthetic",
            )
            add("situations", f"situation_{org}", **common, title="fixture")
            add(
                "situation_versions",
                f"version_{org}",
                **common,
                situation_id=ids[f"situation_{org}"],
                version_number=1,
                status="DRAFT",
                rulebook_edition_id=ids[f"edition_{org}"],
                video_asset_id=ids[f"video_{org}"],
                author_user_id=ids[user],
                prompt="synthetic test",
                technical_criterion={"fixture": True},
            )
        common = {"organization_id": ids["a"]}
        add(
            "situation_options",
            "option",
            **common,
            situation_version_id=ids["version_a"],
            key="A",
            text="synthetic",
        )
        add("physical_exercises", "exercise", **common, title="synthetic")
        add(
            "physical_exercise_versions",
            "physical_version",
            **common,
            physical_exercise_id=ids["exercise"],
            version_number=1,
            status="DRAFT",
            author_user_id=ids["user_a"],
            instructions="fixture only",
            rights_reference="synthetic",
        )
        for kind, key in [
            ("PHYSICAL", "physical"),
            ("COGNITIVE_DECISION", "cognitive"),
        ]:
            add("training_sessions", f"session_{key}", **common, title="fixture")
            add(
                "training_session_versions",
                f"session_version_{key}",
                **common,
                training_session_id=ids[f"session_{key}"],
                version_number=1,
                status="DRAFT",
                kind=kind,
            )
            refs = (
                {"physical_exercise_version_id": ids["physical_version"]}
                if (key == "physical")
                else {"situation_version_id": ids["version_a"]}
            )
            add(
                "training_session_items",
                f"item_{key}",
                **common,
                session_version_id=ids[f"session_version_{key}"],
                position=1,
                kind=kind,
                **refs,
            )
            add(
                "training_runs",
                f"run_{key}",
                **common,
                user_id=ids["user_a"],
                session_version_id=ids[f"session_version_{key}"],
                state="STARTED",
                idempotency_key=f"fixture_{key}",
                payload_hash="a" * 64,
            )
        add("rubrics", "rubric", **common, situation_id=ids["situation_a"])
        add(
            "rubric_versions",
            "rubric_version",
            **common,
            rubric_id=ids["rubric"],
            situation_id=ids["situation_a"],
            situation_version_id=ids["version_a"],
            version_number=1,
            status="DRAFT",
        )
        add(
            "rubric_criteria",
            "criterion",
            **common,
            rubric_version_id=ids["rubric_version"],
            key="fixture",
            weight=1,
        )
        add(
            "attempts",
            "attempt",
            **common,
            user_id=ids["user_a"],
            situation_version_id=ids["version_a"],
            response={"choice": "A"},
            idempotency_key="fixture_attempt",
            payload_hash="a" * 64,
        )
        add(
            "evaluations",
            "evaluation",
            **common,
            attempt_id=ids["attempt"],
            situation_version_id=ids["version_a"],
            rubric_version_id=ids["rubric_version"],
            rulebook_edition_id=ids["edition_a"],
            algorithm_version="fixture",
            score=50,
            breakdown={"fixture": True},
        )
        add(
            "audit_log",
            "audit",
            **common,
            actor_user_id=ids["user_a"],
            action="fixture",
            details={},
        )
        add(
            "audit_log",
            "private_audit",
            organization_id=ids["personal"],
            actor_user_id=ids["user_a"],
            action="private fixture",
            details={},
        )
    yield admin, migrator, runtime, ids, config
    for engine in [admin, runtime, migrator]:
        engine.dispose()


def expect_integrity(engine, name, values, code):
    with pytest.raises(IntegrityError) as error:
        with engine.begin() as connection:
            connection.execute(table(name).insert().values(id=uuid4(), **values))
    assert error.value.orig.sqlstate == code


def test_t01_inventory(database):
    admin, _, _, _, _ = database
    assert set(inspect(admin).get_table_names(schema="app")) == {
        *[t.name for t in metadata.tables.values()],
        "alembic_version",
    }


def test_t02_constraints_and_indexes(database):
    admin, _, _, _, _ = database
    inspector = inspect(admin)
    for name in [t.name for t in metadata.tables.values()]:
        assert inspector.get_pk_constraint(name, schema="app")[
            "constrained_columns"
        ] == ["id"]
        for constraint in inspector.get_foreign_keys(name, schema="app"):
            if constraint["referred_table"] not in {"users", "organizations"}:
                assert "organization_id" in constraint["constrained_columns"]
    assert any(
        x["constrained_columns"] == ["organization_id", "user_id"]
        for x in inspector.get_unique_constraints("memberships", schema="app")
    )
    with admin.connect() as connection:
        assert (
            connection.exec_driver_sql(
                "SELECT count(*) FROM pg_policies WHERE schemaname='app'"
            ).scalar()
            == 23
        )


def test_t03_downgrade_and_upgrade(database):
    admin, _, _, _, config = database
    command.downgrade(config, "base")
    assert inspect(admin).get_table_names(schema="app") == ["alembic_version"]
    command.upgrade(config, "head")
    assert len(inspect(admin).get_table_names(schema="app")) == 24


def test_t04_cross_tenant_foreign_key(database):
    admin, _, _, ids, _ = database
    expect_integrity(
        admin,
        "situation_versions",
        {
            "organization_id": ids["a"],
            "situation_id": ids["situation_a"],
            "version_number": 2,
            "status": "DRAFT",
            "rulebook_edition_id": ids["edition_b"],
            "video_asset_id": ids["video_a"],
            "author_user_id": ids["user_a"],
            "prompt": "fixture",
            "technical_criterion": {},
        },
        "23503",
    )


def test_t05_wrong_item_modality(database):
    admin, _, _, ids, _ = database
    expect_integrity(
        admin,
        "training_session_items",
        {
            "organization_id": ids["a"],
            "session_version_id": ids["session_version_physical"],
            "position": 2,
            "kind": "PHYSICAL",
            "situation_version_id": ids["version_a"],
        },
        "23514",
    )


def test_t06_duplicate_membership(database):
    admin, _, _, ids, _ = database
    expect_integrity(
        admin,
        "memberships",
        {
            "organization_id": ids["a"],
            "user_id": ids["user_a"],
            "role": "REFEREE",
        },
        "23505",
    )


def test_t07_duplicate_session_position(database):
    admin, _, _, ids, _ = database
    expect_integrity(
        admin,
        "training_session_items",
        {
            "organization_id": ids["a"],
            "session_version_id": ids["session_version_physical"],
            "position": 1,
            "kind": "PHYSICAL",
            "physical_exercise_version_id": ids["physical_version"],
        },
        "23505",
    )


def test_t08_physical_result_rejects_cognitive_item(database):
    admin, _, _, ids, _ = database
    expect_integrity(
        admin,
        "physical_results",
        {
            "organization_id": ids["a"],
            "training_run_id": ids["run_cognitive"],
            "session_version_id": ids["session_version_cognitive"],
            "session_item_id": ids["item_cognitive"],
            "protocol_version": "fixture",
        },
        "23503",
    )


def test_t09_runtime_privileges(database):
    _, _, runtime, ids, _ = database
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        assert (
            connection.exec_driver_sql("SELECT current_user").scalar() == "apf_runtime"
        )
        assert (
            connection.exec_driver_sql(
                "SELECT rolsuper OR rolbypassrls OR rolcreaterole OR rolcreatedb "
                "FROM pg_roles WHERE rolname=current_user"
            ).scalar()
            is False
        )
        assert connection.execute(select(table("audit_log"))).all()
    for statement in [
        "UPDATE app.audit_log SET action='changed'",
        "DELETE FROM app.audit_log",
        "TRUNCATE app.audit_log",
        "CREATE TABLE app.forbidden(id integer)",
    ]:
        with pytest.raises(DBAPIError) as error:
            with runtime.begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "42501"


def test_t10_no_metadata_drift(database):
    _, migrator, _, _, _ = database
    with migrator.connect() as connection:
        context = MigrationContext.configure(
            connection,
            opts={
                "include_schemas": True,
                "compare_type": True,
                "include_object": lambda obj, name, kind, reflected, compare_to: (
                    name != "alembic_version"
                ),
            },
        )
        assert compare_metadata(context, metadata) == []


def test_t11_concurrent_idempotency_key(database):
    _, _, runtime, ids, _ = database

    def submit(_):
        with runtime.begin() as connection:
            scope(connection, ids["a"], ids["user_a"])
            return connection.execute(
                insert(table("attempts"))
                .values(
                    id=uuid4(),
                    organization_id=ids["a"],
                    user_id=ids["user_a"],
                    situation_version_id=ids["version_a"],
                    response={"fixture": True},
                    idempotency_key="concurrent",
                    payload_hash="b" * 64,
                )
                .on_conflict_do_nothing(
                    index_elements=[
                        "organization_id",
                        "user_id",
                        "idempotency_key",
                    ]
                )
                .returning(table("attempts").c.id)
            ).scalar()

    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(submit, range(2)))
    assert sum(x is not None for x in results) == 1
    with runtime.begin() as connection:
        scope(connection, ids["a"], ids["user_a"])
        assert (
            len(
                connection.execute(
                    select(table("attempts")).where(
                        table("attempts").c.idempotency_key == "concurrent"
                    )
                ).all()
            )
            == 1
        )


def test_rls_scope_and_private_owner(database):
    _, _, runtime, ids, _ = database
    with runtime.begin() as connection:
        assert connection.execute(select(table("situations"))).all() == []
        scope(connection, ids["a"], ids["user_a"])
        rows = (
            connection.execute(select(table("situations").c.organization_id))
            .scalars()
            .all()
        )
        assert rows == [ids["a"]]
        scope(connection, ids["personal"], ids["reviewer"])
        assert connection.execute(select(table("audit_log"))).all() == []
        scope(connection, ids["personal"], ids["user_a"])
        assert len(connection.execute(select(table("audit_log"))).all()) == 1
    with pytest.raises(DBAPIError) as error:
        with runtime.begin() as connection:
            scope(connection, ids["a"], ids["user_a"])
            connection.execute(
                table("situations")
                .insert()
                .values(
                    id=uuid4(),
                    organization_id=ids["b"],
                    title="forbidden",
                )
            )
    assert error.value.orig.sqlstate == "42501"


def test_physical_units_are_separate(database):
    admin, _, _, ids, _ = database
    common = {
        "organization_id": ids["a"],
        "training_run_id": ids["run_physical"],
        "session_version_id": ids["session_version_physical"],
        "session_item_id": ids["item_physical"],
        "protocol_version": "fixture",
    }
    expect_integrity(
        admin,
        "physical_results",
        {
            **common,
            "metric": "duration",
            "value": 60,
            "unit": "meters",
        },
        "23514",
    )
    with admin.begin() as connection:
        connection.execute(
            table("physical_results")
            .insert()
            .values(
                id=uuid4(),
                **common,
                completed=True,
                metric="duration",
                value=60,
                unit="seconds",
            )
        )
    assert "score" not in table("physical_results").c


def test_published_version_and_children_are_protected(database):
    admin, _, runtime, ids, _ = database
    with admin.begin() as connection:
        connection.execute(
            table("situation_versions")
            .update()
            .where(table("situation_versions").c.id == ids["version_a"])
            .values(status="PUBLISHED")
        )
    for statement in [
        "UPDATE app.situation_versions SET prompt='changed'",
        "UPDATE app.situation_versions SET status='DRAFT'",
        "DELETE FROM app.situation_options",
    ]:
        with pytest.raises(DBAPIError) as error:
            with runtime.begin() as connection:
                scope(connection, ids["a"], ids["user_a"])
                connection.exec_driver_sql(statement)
        assert error.value.orig.sqlstate == "23514"


def test_approval_is_exact_and_separate_from_author(database):
    admin, _, _, ids, _ = database
    common = {
        "organization_id": ids["a"],
        "situation_version_id": ids["version_a"],
        "author_user_id": ids["user_a"],
        "reason": "synthetic fixture",
    }
    expect_integrity(
        admin,
        "approvals",
        {
            **common,
            "reviewer_user_id": ids["user_a"],
        },
        "23514",
    )
    expect_integrity(
        admin,
        "approvals",
        {
            **common,
            "author_user_id": ids["reviewer"],
            "reviewer_user_id": ids["user_a"],
        },
        "23503",
    )
    with admin.begin() as connection:
        connection.execute(
            table("approvals")
            .insert()
            .values(
                id=uuid4(),
                **common,
                reviewer_user_id=ids["reviewer"],
            )
        )
