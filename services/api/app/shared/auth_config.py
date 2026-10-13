import os
from dataclasses import dataclass
from urllib.parse import urlsplit

from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import ArgumentError


class AuthConfigurationError(RuntimeError):
    pass


@dataclass(frozen=True)
class AuthSettings:
    issuer: str
    database_url: URL
    audience: str = "authenticated"

    @property
    def jwks_url(self):
        return self.issuer + "/.well-known/jwks.json"

    @classmethod
    def from_environment(cls, env, environment):
        provider = env.get("SUPABASE_URL")
        database = env.get("API_DATABASE_URL")
        if not provider and not database and environment != "production":
            return None
        try:
            if not provider or not database:
                raise ValueError()
            url = urlsplit(provider)
            local_test = environment == "test" and url.hostname in {
                "localhost",
                "127.0.0.1",
            }
            if (
                not url.hostname
                or url.username
                or url.password
                or url.path not in {"", "/"}
                or url.query
                or url.fragment
                or any(x.isspace() for x in provider)
                or (url.scheme != "https" and not (local_test and url.scheme == "http"))
            ):
                raise ValueError()
            db = make_url(database)
            if db.drivername != "postgresql+psycopg" or not db.host or not db.database:
                raise ValueError()
            if db.username in {None, "postgres", "supabase_admin", "apf_migrator"}:
                raise ValueError()
            if environment == "production" and db.query.get("sslmode") != "verify-full":
                raise ValueError()
            return cls(provider.rstrip("/") + "/auth/v1", db)
        except (ValueError, ArgumentError):
            raise AuthConfigurationError(
                "Invalid authentication configuration: "
                "check provider and runtime database."
            ) from None


def process_auth_settings(environment):
    return AuthSettings.from_environment(os.environ, environment)
