from uuid import uuid4

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Index,
    String,
    Table,
    UniqueConstraint,
    Uuid,
    func,
    text,
)

from app.shared.database import col, fk, metadata, tenant_table

organizations = Table(
    "organizations",
    metadata,
    Column("id", Uuid, primary_key=True, default=uuid4),
    col("name", String(200)),
    col("kind", String(20)),
    col("owner_user_id", Uuid, nullable=True),
    col("created_at", DateTime(timezone=True), server_default=func.now()),
    fk(["owner_user_id"], "users", ["id"]),
    CheckConstraint("kind IN ('PERSONAL','INSTITUTIONAL')"),
    CheckConstraint("kind <> 'PERSONAL' OR owner_user_id IS NOT NULL"),
    Index(
        "uq_personal_owner",
        "owner_user_id",
        unique=True,
        postgresql_where=text("kind = 'PERSONAL'"),
    ),
)
memberships = tenant_table(
    "memberships",
    col("user_id", Uuid),
    col("role", String(30)),
    col("active", Boolean, server_default=text("true")),
    col("can_review_technical", Boolean, server_default=text("false")),
    col("can_review_physical", Boolean, server_default=text("false")),
    constraints=(
        fk(["user_id"], "users", ["id"]),
        UniqueConstraint("organization_id", "user_id"),
        CheckConstraint("role IN ('REFEREE','INSTRUCTOR','REVIEWER','ADMIN')"),
    ),
)
