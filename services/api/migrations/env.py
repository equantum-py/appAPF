from alembic import context
from sqlalchemy import create_engine

from app.shared.database import register_models
from app.shared.test_database import isolated_test_url, require_database_identity

metadata = register_models()
if context.is_offline_mode():
    raise RuntimeError("E-02 requires a real isolated PostgreSQL connection.")
engine = create_engine(isolated_test_url("E02_TEST_MIGRATOR_URL"))
with engine.connect() as connection:
    require_database_identity(connection)
    connection.commit()
    context.configure(
        connection=connection,
        target_metadata=metadata,
        version_table_schema="app",
        include_schemas=True,
        include_name=lambda name, kind, parents: kind != "schema" or name == "app",
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()
