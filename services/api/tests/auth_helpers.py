import time
from uuid import uuid4

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from sqlalchemy.engine import make_url

from app.identity.jwt import JWKSCache, JWTVerifier
from app.shared.auth_config import AuthSettings

ISSUER = "https://apf-fixture.example/auth/v1"


class Signer:
    def __init__(self, algorithm):
        self.algorithm = algorithm
        self.key = (
            ec.generate_private_key(ec.SECP256R1())
            if algorithm == "ES256"
            else (rsa.generate_private_key(public_exponent=65537, key_size=2048))
        )
        self.kid = f"ephemeral-{algorithm}"
        algorithm_object = (
            jwt.algorithms.ECAlgorithm
            if algorithm == "ES256"
            else (jwt.algorithms.RSAAlgorithm)
        )
        self.public = algorithm_object.to_jwk(self.key.public_key(), as_dict=True)
        self.public.update(kid=self.kid, alg=algorithm, use="sig", key_ops=["verify"])

    def token(self, claims=None, omit=(), headers=None):
        now = int(time.time())
        payload = {
            "sub": str(uuid4()),
            "session_id": str(uuid4()),
            "iat": now,
            "exp": now + 120,
            "iss": ISSUER,
            "aud": "authenticated",
            "role": "authenticated",
            "is_anonymous": False,
        }
        payload.update(claims or {})
        for field in omit:
            payload.pop(field)
        return jwt.encode(
            payload,
            self.key,
            algorithm=self.algorithm,
            headers={"kid": self.kid, **(headers or {})},
        )

    def verifier(self):
        settings = AuthSettings(
            ISSUER,
            make_url("postgresql+psycopg://apf_runtime:fixture@localhost/apf_e02_test"),
        )
        return JWTVerifier(
            settings,
            JWKSCache(settings.jwks_url, fetch=lambda: {"keys": [self.public]}),
        )


@pytest.fixture(scope="session")
def signers():
    return {algorithm: Signer(algorithm) for algorithm in ["ES256", "RS256"]}
