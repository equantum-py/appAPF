from sqlalchemy import Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.dialects.postgresql import JSONB

from app.shared.database import col, fk, tenant_table, version_checks

situations = tenant_table("situations", col("title", String(200)))
situation_versions = tenant_table(
    "situation_versions",
    col("situation_id", Uuid),
    col("version_number", Integer),
    col("status", String(20)),
    col("rulebook_edition_id", Uuid),
    col("video_asset_id", Uuid),
    col("author_user_id", Uuid),
    col("prompt", Text),
    col("technical_criterion", JSONB),
    constraints=(
        fk(
            ["organization_id", "situation_id"], "situations", ["organization_id", "id"]
        ),
        fk(
            ["organization_id", "rulebook_edition_id"],
            "rulebook_editions",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "video_asset_id"],
            "video_assets",
            ["organization_id", "id"],
        ),
        fk(
            ["organization_id", "author_user_id"],
            "memberships",
            ["organization_id", "user_id"],
        ),
        UniqueConstraint("organization_id", "situation_id", "version_number"),
        UniqueConstraint("organization_id", "id", "situation_id"),
        UniqueConstraint("organization_id", "id", "rulebook_edition_id"),
        UniqueConstraint("organization_id", "id", "author_user_id"),
        *version_checks(),
    ),
)
situation_options = tenant_table(
    "situation_options",
    col("situation_version_id", Uuid),
    col("key", String(40)),
    col("text", Text),
    constraints=(
        fk(
            ["organization_id", "situation_version_id"],
            "situation_versions",
            ["organization_id", "id"],
        ),
        UniqueConstraint("organization_id", "situation_version_id", "key"),
    ),
)
