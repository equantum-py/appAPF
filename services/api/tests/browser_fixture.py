"""Synthetic users for browser QA; password/token never written to artifacts."""

import json
import os
from pathlib import Path
from uuid import uuid4

import httpx
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine

from app.shared.test_database import isolated_test_url
from tests.test_migrations import table

assert os.environ.get("E03_LIVE_AUTH") == "isolated"
command.upgrade(Config("alembic.ini"), "head")
email = f"browser-{uuid4()}@example.test"
password = "Test-only-browser-Password42!"
response = httpx.post(
    "http://127.0.0.1:19000/auth/v1/signup",
    json={"email": email, "password": password},
    timeout=10,
)
assert response.status_code == 200, "test Auth browser signup failed"
subject = response.json()["user"]["id"]
user_id, org, other = uuid4(), uuid4(), uuid4()
with create_engine(isolated_test_url("E02_TEST_ADMIN_URL")).begin() as connection:
    connection.execute(
        table("users").insert().values(id=user_id, supabase_subject=subject)
    )
    connection.execute(
        table("organizations")
        .insert()
        .values(id=org, name="Espacio de prueba APF", kind="INSTITUTIONAL")
    )
    connection.execute(
        table("organizations")
        .insert()
        .values(id=other, name="Institución ajena de prueba", kind="INSTITUTIONAL")
    )
    connection.execute(
        table("memberships")
        .insert()
        .values(id=uuid4(), organization_id=org, user_id=user_id, role="REFEREE")
    )
path = Path("/tmp/apf-e03-browser.json")
path.write_text(
    json.dumps(
        {
            "email": email,
            "password": password,
            "organization_name": "Espacio de prueba APF",
            "other_organization": str(other),
        }
    )
)
path.chmod(0o600)
print("PASS: synthetic browser identity and tenant provisioned; no credentials printed")
