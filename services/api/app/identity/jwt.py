"""Supabase-compatible asymmetric JWT verifier. No tokens or claims are logged."""

import threading
import time
from dataclasses import dataclass
from uuid import UUID

import httpx
import jwt


class InvalidCredentials(Exception):
    pass


class AuthUnavailable(Exception):
    pass


@dataclass(frozen=True)
class Identity:
    subject: UUID
    session_id: UUID


class JWKSCache:
    def __init__(self, url, fetch=None, clock=time.monotonic):
        self.url = url
        self.fetch = fetch or self._fetch
        self.clock = clock
        self.keys = {}
        self.refreshed_at = None
        self.lock = threading.Lock()

    def _fetch(self):
        with httpx.Client(timeout=5, follow_redirects=False) as client:
            response = client.get(self.url)
            response.raise_for_status()
            if len(response.content) > 65536:
                raise ValueError("JWKS too large")
            return response.json()

    def _refresh(self):
        try:
            data = self.fetch()
            values = data["keys"]
            if not isinstance(values, list) or len(values) > 20:
                raise ValueError()
            keys = {}
            for value in values:
                algorithm = value.get("alg")
                kid = value.get("kid")
                if algorithm not in {"ES256", "RS256"} or not isinstance(kid, str):
                    continue
                if not kid or len(kid) > 200 or kid in keys:
                    raise ValueError()
                if value.get("use", "sig") != "sig" or value.get(
                    "key_ops", ["verify"]
                ) != ["verify"]:
                    raise ValueError()
                if "d" in value or "k" in value:
                    raise ValueError()
                key = jwt.PyJWK.from_dict(value, algorithm=algorithm)
                if algorithm == "ES256" and (
                    value.get("kty") != "EC" or value.get("crv") != "P-256"
                ):
                    raise ValueError()
                if algorithm == "RS256" and (
                    value.get("kty") != "RSA" or key.key.key_size < 2048
                ):
                    raise ValueError()
                keys[kid] = key
            self.keys = keys
            self.refreshed_at = self.clock()
        except (Exception,):
            raise AuthUnavailable() from None

    def key(self, kid, algorithm):
        with self.lock:
            now = self.clock()
            if self.refreshed_at is None or now - self.refreshed_at >= 60:
                self._refresh()
            elif kid not in self.keys and now - self.refreshed_at >= 30:
                self._refresh()
            key = self.keys.get(kid)
            if key is None or key.algorithm_name != algorithm:
                raise InvalidCredentials()
            return key.key

    def purge(self):
        with self.lock:
            self.keys = {}
            self.refreshed_at = None


class JWTVerifier:
    def __init__(self, settings, cache=None):
        self.settings = settings
        self.cache = cache or JWKSCache(settings.jwks_url)

    def verify(self, token):
        try:
            if not isinstance(token, str) or len(token) > 16384:
                raise InvalidCredentials()
            header = jwt.get_unverified_header(token)
            algorithm = header.get("alg")
            kid = header.get("kid")
            if (
                algorithm not in {"ES256", "RS256"}
                or not isinstance(kid, str)
                or not kid
            ):
                raise InvalidCredentials()
            if len(kid) > 200:
                raise InvalidCredentials()
            key = self.cache.key(kid, algorithm)
            claims = jwt.decode(
                token,
                key,
                algorithms=[algorithm],
                audience=self.settings.audience,
                issuer=self.settings.issuer,
                options={
                    "require": ["exp", "iat", "iss", "aud", "sub", "session_id", "role"]
                },
                leeway=0,
            )
            if any(type(claims[field]) is not int for field in ["exp", "iat"]):
                raise InvalidCredentials()
            if (
                claims["role"] != "authenticated"
                or claims.get("is_anonymous", False) is not False
            ):
                raise InvalidCredentials()
            subject, session = UUID(claims["sub"]), UUID(claims["session_id"])
            if subject.int == 0 or session.int == 0:
                raise InvalidCredentials()
            return Identity(subject, session)
        except (jwt.InvalidTokenError, ValueError, TypeError, KeyError):
            raise InvalidCredentials() from None
