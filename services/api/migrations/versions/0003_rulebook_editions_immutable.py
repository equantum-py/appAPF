"""Protect edition identity/label without altering rows or historical references."""

from alembic import op

revision = "0003_rulebook_editions_immutable"
down_revision = "0002_identity_scope"
branch_labels = None
depends_on = None


def upgrade():
    op.get_bind().exec_driver_sql("""
        REVOKE UPDATE, DELETE, TRUNCATE ON app.rulebook_editions FROM apf_runtime;
        CREATE TRIGGER immutable_edition BEFORE UPDATE OR DELETE
        ON app.rulebook_editions FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
    """)


def downgrade():
    # Existing Alembic environment only permits guarded ephemeral test databases.
    op.get_bind().exec_driver_sql("""
        DROP TRIGGER immutable_edition ON app.rulebook_editions;
        GRANT UPDATE, DELETE ON app.rulebook_editions TO apf_runtime;
    """)
