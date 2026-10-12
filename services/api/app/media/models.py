from sqlalchemy import BigInteger, CheckConstraint, String, UniqueConstraint

from app.shared.database import col, tenant_table

video_assets = tenant_table(
    "video_assets",
    col("object_key", String(500)),
    col("mime_type", String(100)),
    col("size_bytes", BigInteger),
    col("rights_reference", String(500)),
    constraints=(
        CheckConstraint("size_bytes > 0"),
        UniqueConstraint("organization_id", "object_key"),
    ),
)
