from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    text,
)

from app.shared.database import col, fk, tenant_table, version_checks

physical_exercises = tenant_table("physical_exercises", col("title", String(200)))
physical_exercise_versions = tenant_table(
    "physical_exercise_versions",
    col("physical_exercise_id", Uuid),
    col("version_number", Integer),
    col("status", String(20)),
    col("author_user_id", Uuid),
    col("instructions", Text),
    col("rights_reference", String(500)),
    constraints=(
        fk(
            ["organization_id", "physical_exercise_id"],
            "physical_exercises",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "author_user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        UniqueConstraint("organization_id", "physical_exercise_id", "version_number"),
        UniqueConstraint("organization_id", "id", "author_user_id"),
        *version_checks(),
    ),
)
training_sessions = tenant_table("training_sessions", col("title", String(200)))
training_session_versions = tenant_table(
    "training_session_versions",
    col("training_session_id", Uuid),
    col("version_number", Integer),
    col("status", String(20)),
    col("kind", String(30)),
    constraints=(
        fk(
            ["organization_id", "training_session_id"],
            "training_sessions",
            ["organization_id", "id"],
        ),
        UniqueConstraint("organization_id", "training_session_id", "version_number"),
        UniqueConstraint("organization_id", "id", "kind"),
        CheckConstraint("kind IN ('COGNITIVE_DECISION','PHYSICAL')"),
        *version_checks(),
    ),
)
training_session_items = tenant_table(
    "training_session_items",
    col("session_version_id", Uuid),
    col("position", Integer),
    col("kind", String(30)),
    col("situation_version_id", Uuid, nullable=True),
    col("physical_exercise_version_id", Uuid, nullable=True),
    col("planned_duration_seconds", Integer, nullable=True),
    constraints=(
        fk(
            ["organization_id", "session_version_id", "kind"],
            "training_session_versions",
            ["organization_id", "id", "kind"],
        ),
        fk(
            ["organization_id", "situation_version_id"],
            "situation_versions",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "physical_exercise_version_id"],
            "physical_exercise_versions",
            ["organization_id", "id"],
        ),
        UniqueConstraint("organization_id", "session_version_id", "position"),
        UniqueConstraint("organization_id", "session_version_id", "id", "kind"),
        UniqueConstraint(
            "organization_id",
            "session_version_id",
            "id",
            "kind",
            "situation_version_id",
        ),
        CheckConstraint("position > 0"),
        CheckConstraint(
            "planned_duration_seconds IS NULL OR planned_duration_seconds >= 0"
        ),
        CheckConstraint(
            "(kind = 'PHYSICAL' AND physical_exercise_version_id IS NOT NULL "
            "AND situation_version_id IS NULL) OR (kind = 'COGNITIVE_DECISION' "
            "AND situation_version_id IS NOT NULL AND "
            "physical_exercise_version_id IS NULL)"
        ),
    ),
)
training_runs = tenant_table(
    "training_runs",
    col("user_id", Uuid),
    col("session_version_id", Uuid),
    col("state", String(20)),
    col("idempotency_key", String(128)),
    col("payload_hash", String(64)),
    constraints=(
        fk(
            ["organization_id", "user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        fk(
            ["organization_id", "session_version_id"],
            "training_session_versions",
            ["organization_id", "id"],
        ),
        UniqueConstraint("organization_id", "id", "session_version_id"),
        UniqueConstraint("organization_id", "id", "session_version_id", "user_id"),
        UniqueConstraint("organization_id", "user_id", "idempotency_key"),
        CheckConstraint("state IN ('STARTED','COMPLETED','ABANDONED')"),
        CheckConstraint("payload_hash ~ '^[0-9a-f]{64}$'"),
        CheckConstraint("length(idempotency_key) > 0"),
    ),
)
physical_results = tenant_table(
    "physical_results",
    col("training_run_id", Uuid),
    col("session_version_id", Uuid),
    col("session_item_id", Uuid),
    col("item_kind", String(30), server_default="PHYSICAL"),
    col("completed", Boolean, server_default=text("false")),
    col("metric", String(40), nullable=True),
    col("value", Numeric(12, 3), nullable=True),
    col("unit", String(20), nullable=True),
    col("protocol_version", String(100)),
    col("source", String(30), server_default="SELF_REPORTED"),
    constraints=(
        fk(
            ["organization_id", "training_run_id", "session_version_id"],
            "training_runs",
            ["organization_id", "id", "session_version_id"],
        ),
        fk(
            ["organization_id", "session_version_id", "session_item_id", "item_kind"],
            "training_session_items",
            ["organization_id", "session_version_id", "id", "kind"],
        ),
        UniqueConstraint(
            "organization_id",
            "training_run_id",
            "session_item_id",
            "metric",
            postgresql_nulls_not_distinct=True,
        ),
        CheckConstraint("item_kind = 'PHYSICAL'"),
        CheckConstraint("source = 'SELF_REPORTED'"),
        CheckConstraint("num_nonnulls(metric, value, unit) IN (0,3)"),
        CheckConstraint("value IS NULL OR value >= 0"),
        CheckConstraint(
            "metric IS NULL OR (metric = 'duration' AND unit = 'seconds') OR "
            "(metric = 'distance' AND unit = 'meters') OR (metric = "
            "'repetitions' AND unit = 'count')"
        ),
        CheckConstraint("length(trim(protocol_version)) > 0"),
    ),
)
