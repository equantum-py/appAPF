"""Fail closed: migration tooling for E-02 is limited to an explicit test target."""

import os

from sqlalchemy.engine import make_url


def isolated_test_url(variable):
    if os.environ.get("E02_TEST_MODE") != "isolated":
        raise RuntimeError("E-02 requires isolated test mode.")
    try:
        url = make_url(os.environ[variable])
    except (KeyError, ValueError):
        raise RuntimeError("E-02 test connection is not configured.") from None
    if (
        url.drivername != "postgresql+psycopg"
        or url.host not in {"localhost", "127.0.0.1"}
        or url.database != "apf_e02_test"
    ):
        raise RuntimeError("E-02 connection is not an authorized local test target.")
    return url


def require_database_identity(connection):
    if (
        connection.exec_driver_sql("SELECT current_database()").scalar()
        != "apf_e02_test"
    ):
        raise RuntimeError("Unexpected database target.")
