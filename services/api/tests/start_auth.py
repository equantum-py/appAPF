"""Starts official Supabase Auth only in CI's guarded ephemeral PostgreSQL setup."""

import json
import secrets
import subprocess
import sys
import time
from pathlib import Path
from uuid import uuid4

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import ec
from sqlalchemy import create_engine

from app.shared.test_database import isolated_test_url, require_database_identity

url = isolated_test_url("E02_TEST_ADMIN_URL")
engine = create_engine(url, isolation_level="AUTOCOMMIT")
with engine.connect() as connection:
    require_database_identity(connection)
    connection.exec_driver_sql(
        "CREATE ROLE apf_auth_ci LOGIN NOSUPERUSER NOCREATEDB "
        "NOCREATEROLE NOBYPASSRLS PASSWORD 'test_auth_only'"
    )
    connection.exec_driver_sql("CREATE DATABASE apf_auth_test OWNER apf_auth_ci")
auth_url = url.set(database="apf_auth_test")
with create_engine(auth_url).begin() as connection:
    connection.exec_driver_sql("CREATE SCHEMA auth AUTHORIZATION apf_auth_ci")
    connection.exec_driver_sql("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    connection.exec_driver_sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    connection.exec_driver_sql("ALTER ROLE apf_auth_ci SET search_path = auth, public")
key = ec.generate_private_key(ec.SECP256R1())
jwk = jwt.algorithms.ECAlgorithm.to_jwk(key, as_dict=True)
jwk.update(kid=str(uuid4()), alg="ES256", use="sig")
jwk.pop("key_ops", None)
env = {
    "GOTRUE_API_HOST": "0.0.0.0",
    "GOTRUE_API_PORT": "19999",
    "API_EXTERNAL_URL": "http://127.0.0.1:19000/auth/v1",
    "GOTRUE_SITE_URL": "http://127.0.0.1:13000",
    "GOTRUE_DB_DRIVER": "postgres",
    "GOTRUE_DB_DATABASE_URL": "postgres://apf_auth_ci:test_auth_only@127.0.0.1:5432/apf_auth_test",
    "GOTRUE_DB_NAMESPACE": "auth",
    "GOTRUE_JWT_AUD": "authenticated",
    "GOTRUE_JWT_DEFAULT_GROUP_NAME": "authenticated",
    "GOTRUE_JWT_ISSUER": "http://127.0.0.1:19000/auth/v1",
    "GOTRUE_JWT_EXP": "300",
    "GOTRUE_JWT_SECRET": secrets.token_urlsafe(48),
    "GOTRUE_JWT_KEYS": json.dumps([jwk], separators=(",", ":")),
    "GOTRUE_EXTERNAL_EMAIL_ENABLED": "true",
    "GOTRUE_MAILER_AUTOCONFIRM": "true",
    "GOTRUE_EXTERNAL_PHONE_ENABLED": "false",
    "GOTRUE_DISABLE_SIGNUP": "false",
    "GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED": "false",
    "GOTRUE_LOG_LEVEL": "error",
}
path = Path("/tmp/apf-e03-auth.env")
path.write_text("\n".join(f"{k}={v}" for k, v in env.items()) + "\n")
path.chmod(0o600)
try:
    subprocess.run(
        [
            "docker",
            "run",
            "-d",
            "--name",
            "apf-auth-e03",
            "--network",
            "host",
            "--env-file",
            str(path),
            "supabase/gotrue:v2.196.0",
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
finally:
    path.unlink(missing_ok=True)
log = open("/tmp/apf-e03-auth-proxy.log", "w")
subprocess.Popen([sys.executable, "-m", "tests.auth_proxy"], stdout=log, stderr=log)
for _ in range(50):
    try:
        response = httpx.get("http://127.0.0.1:19000/auth/v1/health", timeout=2)
        if response.status_code == 200:
            print(
                "PASS: official Supabase Auth v2.196.0 healthy; "
                "isolated test DB; keys ephemeral"
            )
            break
    except httpx.HTTPError:
        pass
    time.sleep(0.5)
else:
    diagnostic = subprocess.run(["docker", "logs", "--tail", "15", "apf-auth-e03"], capture_output=True, text=True)
    output = diagnostic.stdout + diagnostic.stderr
    for value in (env["GOTRUE_JWT_SECRET"], env["GOTRUE_JWT_KEYS"], jwk["d"]):
        output = output.replace(value, "[REDACTED]")
    print(output)
    raise RuntimeError("Isolated Supabase Auth did not become healthy.")
