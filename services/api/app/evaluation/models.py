from sqlalchemy import (
    CheckConstraint,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.shared.database import col, fk, tenant_table, version_checks

rubrics = tenant_table(
    "rubrics",
    col("situation_id", Uuid),
    constraints=(
        fk(
            ["organization_id", "situation_id"], "situations", ["organization_id", "id"]
        ),
        UniqueConstraint("organization_id", "id", "situation_id"),
    ),
)
rubric_versions = tenant_table(
    "rubric_versions",
    col("rubric_id", Uuid),
    col("situation_id", Uuid),
    col("situation_version_id", Uuid),
    col("version_number", Integer),
    col("status", String(20)),
    constraints=(
        fk(
            ["organization_id", "rubric_id", "situation_id"],
            "rubrics",
            ["organization_id", "id", "situation_id"],
        ),
        fk(
            ["organization_id", "situation_version_id", "situation_id"],
            "situation_versions",
            ["organization_id", "id", "situation_id"],
        ),
        UniqueConstraint("organization_id", "rubric_id", "version_number"),
        UniqueConstraint("organization_id", "id", "situation_version_id"),
        *version_checks(),
    ),
)
rubric_criteria = tenant_table(
    "rubric_criteria",
    col("rubric_version_id", Uuid),
    col("key", String(40)),
    col("weight", Numeric(8, 4)),
    constraints=(
        fk(
            ["organization_id", "rubric_version_id"],
            "rubric_versions",
            ["organization_id", "id"],
        ),
        UniqueConstraint("organization_id", "rubric_version_id", "key"),
        CheckConstraint("weight > 0 AND weight <= 1"),
    ),
)
attempts = tenant_table(
    "attempts",
    col("user_id", Uuid),
    col("situation_version_id", Uuid),
    col("response", JSONB),
    col("idempotency_key", String(128)),
    col("payload_hash", String(64)),
    col("training_run_id", Uuid, nullable=True),
    col("session_version_id", Uuid, nullable=True),
    col("session_item_id", Uuid, nullable=True),
    col("item_kind", String(30), server_default="COGNITIVE_DECISION"),
    constraints=(
        fk(
            ["organization_id", "user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        fk(
            ["organization_id", "situation_version_id"],
            "situation_versions",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "training_run_id", "session_version_id", "user_id"],
            "training_runs",
            ["organization_id", "id", "session_version_id", "user_id"],
        ),
        fk(
            [
                "organization_id",
                "session_version_id",
                "session_item_id",
                "item_kind",
                "situation_version_id",
            ],
            "training_session_items",
            [
                "organization_id",
                "session_version_id",
                "id",
                "kind",
                "situation_version_id",
            ],
        ),
        UniqueConstraint("organization_id", "user_id", "idempotency_key"),
        UniqueConstraint("organization_id", "id", "situation_version_id"),
        CheckConstraint("payload_hash ~ '^[0-9a-f]{64}$'"),
        CheckConstraint("length(idempotency_key) > 0"),
        CheckConstraint("item_kind = 'COGNITIVE_DECISION'"),
        CheckConstraint(
            "num_nonnulls(training_run_id, session_version_id, session_item_id) "
            "IN (0,3)"
        ),
    ),
)
evaluations = tenant_table(
    "evaluations",
    col("attempt_id", Uuid),
    col("situation_version_id", Uuid),
    col("rubric_version_id", Uuid),
    col("rulebook_edition_id", Uuid),
    col("algorithm_version", String(80)),
    col("score", Numeric(7, 3)),
    col("breakdown", JSONB),
    constraints=(
        fk(
            ["organization_id", "attempt_id", "situation_version_id"],
            "attempts",
            ["organization_id", "id", "situation_version_id"],
        ),
        fk(
            ["organization_id", "rubric_version_id", "situation_version_id"],
            "rubric_versions",
            ["organization_id", "id", "situation_version_id"],
        ),
        fk(
            ["organization_id", "situation_version_id", "rulebook_edition_id"],
            "situation_versions",
            ["organization_id", "id", "rulebook_edition_id"],
        ),
        UniqueConstraint("organization_id", "attempt_id"),
        CheckConstraint("score >= 0 AND score <= 100"),
    ),
)
evaluation_reviews = tenant_table(
    "evaluation_reviews",
    col("evaluation_id", Uuid),
    col("reviewer_user_id", Uuid),
    col("reason", Text),
    col("reviewed_score", Numeric(7, 3)),
    constraints=(
        fk(
            ["organization_id", "evaluation_id"],
            "evaluations",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "reviewer_user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        CheckConstraint("length(trim(reason)) > 0"),
        CheckConstraint("reviewed_score >= 0 AND reviewed_score <= 100"),
    ),
)
approvals = tenant_table(
    "approvals",
    col("situation_version_id", Uuid, nullable=True),
    col("physical_exercise_version_id", Uuid, nullable=True),
    col("author_user_id", Uuid),
    col("reviewer_user_id", Uuid),
    col("reason", Text),
    constraints=(
        fk(
            ["organization_id", "situation_version_id", "author_user_id"],
            "situation_versions",
            ["organization_id", "id", "author_user_id"],
        ),
        fk(
            ["organization_id", "physical_exercise_version_id", "author_user_id"],
            "physical_exercise_versions",
            ["organization_id", "id", "author_user_id"],
        ),
        fk(
            ["organization_id", "reviewer_user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        CheckConstraint(
            "num_nonnulls(situation_version_id, physical_exercise_version_id) = 1"
        ),
        CheckConstraint("reviewer_user_id <> author_user_id"),
        CheckConstraint("length(trim(reason)) > 0"),
    ),
)
