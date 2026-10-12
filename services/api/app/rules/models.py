from sqlalchemy import String, UniqueConstraint

from app.shared.database import col, tenant_table

rulebook_editions = tenant_table(
    "rulebook_editions",
    col("label", String(100)),
    constraints=(UniqueConstraint("organization_id", "label"),),
)
