from sqlalchemy import String, Uuid
from sqlalchemy.dialects.postgresql import JSONB

from app.shared.database import col, fk, tenant_table

audit_log = tenant_table(
    "audit_log",
    col("actor_user_id", Uuid, nullable=True),
    col("action", String(100)),
    col("details", JSONB),
    constraints=(fk(["actor_user_id"], "users", ["id"]),),
)
