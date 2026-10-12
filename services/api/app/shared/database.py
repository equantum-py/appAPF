"""Schema metadata; E-02 does not connect the API to a database."""

from hashlib import sha256
from uuid import uuid4

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKeyConstraint,
    Index,
    MetaData,
    Table,
    UniqueConstraint,
    Uuid,
    func,
)

metadata = MetaData(schema="app")


def col(name, kind, nullable=False, **kw):
    return Column(name, kind, nullable=nullable, **kw)


def fk(columns, target, target_columns=None):
    target_columns = target_columns or columns
    return ForeignKeyConstraint(columns, [f"app.{target}.{c}" for c in target_columns])


def tenant_table(name, *columns, constraints=()):
    return Table(
        name,
        metadata,
        Column("id", Uuid, primary_key=True, default=uuid4),
        col("organization_id", Uuid),
        col("created_at", DateTime(timezone=True), server_default=func.now()),
        *columns,
        UniqueConstraint("organization_id", "id"),
        fk(["organization_id"], "organizations", ["id"]),
        *constraints,
    )


def version_checks():
    return (
        CheckConstraint("version_number > 0"),
        CheckConstraint(
            "status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')"
        ),
    )


def register_models():
    # Explicit module imports register metadata without importing an ASGI app.
    from app.audit import models as audit
    from app.catalog import models as catalog
    from app.evaluation import models as evaluation
    from app.identity import models as identity
    from app.media import models as media
    from app.organizations import models as organizations
    from app.rules import models as rules
    from app.training import models as training

    _ = audit, catalog, evaluation, identity, media, organizations, rules, training
    # Index referencing columns when an existing index/PK/unique is not a prefix.
    for table in metadata.tables.values():
        prefixes = [tuple(c.name for c in table.primary_key.columns)]
        prefixes += [
            tuple(c.name for c in x.columns)
            for x in table.constraints
            if isinstance(x, UniqueConstraint)
        ]
        prefixes += [tuple(c.name for c in x.columns) for x in table.indexes]
        for constraint in table.foreign_key_constraints:
            names = tuple(c.name for c in constraint.columns)
            if not any(prefix[: len(names)] == names for prefix in prefixes):
                name = f"ix_{table.name}_{'_'.join(names)}"
                if len(name) > 63:
                    name = name[:48] + "_" + sha256(name.encode()).hexdigest()[:12]
                Index(name, *[table.c[n] for n in names])
                prefixes.append(names)
    return metadata
