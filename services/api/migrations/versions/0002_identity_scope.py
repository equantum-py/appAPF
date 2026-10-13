"""Allow lookup of own identity/sub and own memberships before choosing a tenant."""

from alembic import op

revision = "0002_identity_scope"
down_revision = "0001_domain_schema"
branch_labels = None
depends_on = None


def upgrade():
    op.get_bind().exec_driver_sql("""
        ALTER POLICY scope_access ON app.users
        USING (id = NULLIF(current_setting('app.actor_id', true), '')::uuid
            OR supabase_subject =
                NULLIF(current_setting('app.subject', true), '')::uuid)
        WITH CHECK (id = NULLIF(current_setting('app.actor_id', true), '')::uuid);
        ALTER POLICY scope_access ON app.memberships
        USING (organization_id =
            NULLIF(current_setting('app.organization_id', true), '')::uuid
            OR user_id = NULLIF(current_setting('app.actor_id', true), '')::uuid)
        WITH CHECK (organization_id =
            NULLIF(current_setting('app.organization_id', true), '')::uuid);
    """)


def downgrade():
    op.get_bind().exec_driver_sql("""
        ALTER POLICY scope_access ON app.users
        USING (id = NULLIF(current_setting('app.actor_id', true), '')::uuid)
        WITH CHECK (id = NULLIF(current_setting('app.actor_id', true), '')::uuid);
        ALTER POLICY scope_access ON app.memberships
        USING (organization_id =
            NULLIF(current_setting('app.organization_id', true), '')::uuid)
        WITH CHECK (organization_id =
            NULLIF(current_setting('app.organization_id', true), '')::uuid);
    """)
