"""ASGI entrypoint. Invalid environment configuration prevents startup."""

from app.factory import create_app
from app.shared.logging import configure_access_logging

app = create_app()
configure_access_logging()
