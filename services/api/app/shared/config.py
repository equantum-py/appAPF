"""Explicit environment configuration; errors deliberately omit submitted values."""

import json
from collections.abc import Mapping
from typing import Literal
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, field_validator


class ConfigurationError(RuntimeError):
    pass


class Settings(BaseModel):
    model_config = ConfigDict(frozen=True)
    environment: Literal["development", "test", "production"]
    cors_origins: tuple[str, ...]

    @field_validator("cors_origins")
    @classmethod
    def validate_origins(cls, origins: tuple[str, ...]) -> tuple[str, ...]:
        if not origins:
            raise ValueError("explicit origins required")
        for origin in origins:
            url = urlsplit(origin)
            if (
                url.scheme not in {"http", "https"}
                or not url.hostname
                or url.username is not None
                or url.password is not None
                or url.path
                or url.query
                or url.fragment
                or "*" in origin
                or any(char.isspace() for char in origin)
                or url.netloc.endswith(":")
            ):
                raise ValueError("invalid origin")
            _ = url.port
        return origins

    @classmethod
    def from_environment(cls, env: Mapping[str, str]) -> "Settings":
        try:
            origins = json.loads(env["CORS_ORIGINS"])
            if not isinstance(origins, list) or any(
                not isinstance(origin, str) for origin in origins
            ):
                raise ValueError("origins must be an array of strings")
            settings = cls(environment=env["APP_ENV"], cors_origins=tuple(origins))
            if settings.environment == "production" and any(
                not origin.startswith("https://") for origin in settings.cors_origins
            ):
                raise ValueError("HTTPS required")
            return settings
        except (KeyError, ValueError, TypeError):
            raise ConfigurationError(
                "Invalid configuration: check APP_ENV and CORS_ORIGINS."
            ) from None
