"""Initial v2 domain schema. Frozen SQL is independent of future model changes."""

import json
from pathlib import Path

from alembic import op

revision = "0001_domain_schema"
down_revision = None
branch_labels = None
depends_on = None
folder = Path(__file__).parent


def upgrade():
    connection = op.get_bind()
    with connection.connection.driver_connection.cursor() as cursor:
        cursor.execute((folder / "0001_tables.sql").read_text(), prepare=False)
        cursor.execute((folder / "0001_security.sql").read_text(), prepare=False)


def downgrade():
    # Tooling guards the isolated target; application never runs this operation.
    connection = op.get_bind()
    for name in reversed(json.loads((folder / "0001_tables.json").read_text())):
        connection.exec_driver_sql(f'DROP TABLE app."{name}"')
    for name in [
        "immutable_record",
        "immutable_published_version",
        "guard_published_children",
        "immutable_run_identity",
    ]:
        connection.exec_driver_sql(f"DROP FUNCTION app.{name}()")
