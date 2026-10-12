"""Only provisions roles/schema in the explicitly named ephemeral E-02 test DB."""

from sqlalchemy import create_engine

from app.shared.test_database import isolated_test_url, require_database_identity

engine = create_engine(isolated_test_url("E02_TEST_ADMIN_URL"))
with engine.begin() as connection:
    require_database_identity(connection)
    for role, password in [
        ("apf_migrator", "test_migrator_only"),
        ("apf_runtime", "test_runtime_only"),
    ]:
        exists = connection.exec_driver_sql(
            "SELECT 1 FROM pg_roles WHERE rolname = %s", (role,)
        ).scalar()
        if not exists:
            # Fixed test-only literals; never accepts role/password from user input.
            connection.exec_driver_sql(
                f"CREATE ROLE {role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE "
                f"NOINHERIT NOBYPASSRLS PASSWORD '{password}'"
            )
    connection.exec_driver_sql("GRANT CREATE ON DATABASE apf_e02_test TO apf_migrator")
    connection.exec_driver_sql(
        "CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION apf_migrator"
    )
    connection.exec_driver_sql("REVOKE ALL ON SCHEMA app FROM PUBLIC")
print("PASS: isolated test roles/schema provisioned; no credentials printed")
