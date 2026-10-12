from uuid import uuid4

from sqlalchemy import Column, DateTime, Table, Uuid, func

from app.shared.database import col, metadata

users = Table(
    "users",
    metadata,
    Column("id", Uuid, primary_key=True, default=uuid4),
    col("supabase_subject", Uuid, unique=True),
    col("created_at", DateTime(timezone=True), server_default=func.now()),
)
