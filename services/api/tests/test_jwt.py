from uuid import uuid4

import jwt
import pytest

from app.identity.jwt import AuthUnavailable, InvalidCredentials, JWKSCache
from app.shared.auth_config import AuthConfigurationError, AuthSettings
from tests.auth_helpers import Signer


@pytest.mark.parametrize("algorithm", ["ES256", "RS256"])
def test_valid_asymmetric_token(signers, algorithm):
    signer = signers[algorithm]
    subject = uuid4()
    assert (
        signer.verifier().verify(signer.token({"sub": str(subject)})).subject == subject
    )


@pytest.mark.parametrize(
    "claims",
    [
        {"exp": 1},
        {"iat": 9999999999},
        {"nbf": 9999999999},
        {"iss": "https://other.example/auth/v1"},
        {"aud": "other"},
        {"sub": "bad"},
        {"session_id": "bad"},
        {"sub": str(uuid4().int * 0)},
        {"role": "service_role"},
        {"is_anonymous": True},
        {"iat": True},
        {"exp": "9999999999"},
    ],
)
def test_invalid_claims(signers, claims):
    signer = signers["ES256"]
    with pytest.raises(InvalidCredentials):
        signer.verifier().verify(signer.token(claims))


@pytest.mark.parametrize(
    "field", ["exp", "iat", "iss", "aud", "sub", "session_id", "role"]
)
def test_required_claims(signers, field):
    with pytest.raises(InvalidCredentials):
        signers["ES256"].verifier().verify(signers["ES256"].token(omit=[field]))


def test_forged_signature_and_algorithm_confusion(signers):
    signer = signers["ES256"]
    forged = Signer("ES256")
    for token in [
        forged.token(headers={"kid": signer.kid}),
        jwt.encode(
            {},
            "fixture-secret-at-least-32-chars",
            algorithm="HS256",
            headers={"kid": signer.kid},
        ),
        jwt.encode({}, None, algorithm="none"),
        "bad",
        "x" * 16385,
    ]:
        with pytest.raises(InvalidCredentials):
            signer.verifier().verify(token)


def test_user_metadata_never_defines_business_role(signers):
    signer = signers["ES256"]
    subject = uuid4()
    identity = signer.verifier().verify(
        signer.token(
            {
                "sub": str(subject),
                "user_metadata": {"role": "ADMIN"},
                "app_metadata": {"role": "ADMIN"},
            },
            headers={"jku": "https://attacker.example/keys"},
        )
    )
    assert identity.subject == subject
    assert not hasattr(identity, "role")


def test_cache_refresh_rotation_cooldown_and_expiry(signers):
    signer = signers["ES256"]
    clock = [0.0]
    calls = []
    keys = [signer.public]

    def fetch():
        calls.append(True)
        return {"keys": list(keys)}

    cache = JWKSCache("https://fixed.example", fetch=fetch, clock=lambda: clock[0])
    cache.key(signer.kid, "ES256")
    cache.key(signer.kid, "ES256")
    assert len(calls) == 1
    with pytest.raises(InvalidCredentials):
        cache.key("unknown", "ES256")
    assert len(calls) == 1
    rotated = Signer("ES256")
    rotated.public["kid"] = "rotated"
    keys.append(rotated.public)
    clock[0] = 31
    cache.key("rotated", "ES256")
    assert len(calls) == 2
    keys[:] = [rotated.public]
    clock[0] = 92
    with pytest.raises(InvalidCredentials):
        cache.key(signer.kid, "ES256")
    assert len(calls) == 3
    cache.purge()
    cache.key("rotated", "ES256")
    assert len(calls) == 4


def test_jwks_failure_and_private_key_rejected(signers):
    def fail():
        raise RuntimeError("do-not-return-sensitive-message")

    cache = JWKSCache("https://fixed.example", fetch=fail)
    with pytest.raises(AuthUnavailable) as error:
        cache.key("key", "ES256")
    assert str(error.value) == ""
    bad = {**signers["ES256"].public, "d": "private-key"}
    cache = JWKSCache("https://fixed.example", fetch=lambda: {"keys": [bad]})
    with pytest.raises(AuthUnavailable):
        cache.key(signers["ES256"].kid, "ES256")


@pytest.mark.parametrize(
    "env,mode",
    [
        ({}, "production"),
        ({"SUPABASE_URL": "https://example.com"}, "test"),
        (
            {
                "SUPABASE_URL": "http://example.com",
                "API_DATABASE_URL": "postgresql+psycopg://apf_runtime@localhost/apf_e02_test",
            },
            "test",
        ),
        (
            {
                "SUPABASE_URL": "https://user:secret@example.com",
                "API_DATABASE_URL": "postgresql+psycopg://apf_runtime@localhost/apf_e02_test",
            },
            "test",
        ),
        (
            {
                "SUPABASE_URL": "https://example.com",
                "API_DATABASE_URL": "postgresql+psycopg://postgres@localhost/apf_e02_test",
            },
            "test",
        ),
        (
            {
                "SUPABASE_URL": "https://example.com",
                "API_DATABASE_URL": "postgresql+psycopg://apf_runtime@db.example/apf",
            },
            "production",
        ),
    ],
)
def test_invalid_auth_configuration_is_sanitized(env, mode):
    with pytest.raises(AuthConfigurationError) as error:
        AuthSettings.from_environment(env, mode)
    assert "secret" not in str(error.value)
