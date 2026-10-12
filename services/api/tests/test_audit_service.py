"""Audit payload and privacy requirements independent of a database."""

import logging
from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.audit.schemas import Action, AuditQuery, EventInput
from app.audit.service import AuditService, AuthorizedContext, InvalidAuditEvent


@pytest.mark.parametrize(
    "action,resource,attrs",
    [
        (Action.SITUATION_PUBLISHED, "situation_version", {"version_number": 1}),
        (Action.PHYSICAL_PUBLISHED, "physical_exercise_version", {"version_number": 1}),
        (Action.RUN_STARTED, "training_run", {"modality": "PHYSICAL"}),
        (Action.RUN_COMPLETED, "training_run", {"modality": "COGNITIVE_DECISION"}),
        (Action.PHYSICAL_RESULT, "physical_result", {}),
        (Action.EVALUATION_REVIEW, "evaluation_review", {}),
    ],
)
def test_aud06_future_format_without_future_module(action, resource, attrs):
    payload = {
        "action": action,
        "details": {
            "request_id": uuid4(),
            "resource_id": uuid4(),
            "resource_type": resource,
            "attributes": attrs,
        },
    }
    assert EventInput.model_validate(payload).details.resource_type == resource
    payload["details"]["resource_type"] = "organization"
    with pytest.raises(ValidationError):
        EventInput.model_validate(payload)


class NoSQL:
    def execute(self, *args, **kwargs):
        raise AssertionError("Invalid payload must be rejected before SQL.")


@pytest.mark.parametrize(
    "attrs",
    [
        {"token": "secret-sentinel"},
        {"email": "private@example.test"},
        {"signed_url": "https://example.test/private?token=secret-sentinel"},
        {"response": "secret-sentinel"},
        {"free_text": "secret-sentinel"},
        {"returned_count": 1, "extra": "secret-sentinel"},
        {"returned_count": "secret-sentinel"},
        {"returned_count": True},
        {"returned_count": -1},
        {"returned_count": "é" * 4096},
        {"returned_count": 1, "version_number": 1},
    ],
)
def test_aud07_payload_rejected_before_sql_and_not_logged(attrs, caplog):
    with caplog.at_level(logging.INFO):
        with pytest.raises(InvalidAuditEvent) as error:
            AuditService().record(
                NoSQL(),
                AuthorizedContext(uuid4(), uuid4()),
                Action.MEMBERSHIPS_READ,
                "organization",
                uuid4(),
                uuid4(),
                attrs,
            )
    assert str(error.value) == "" and not caplog.records


@pytest.mark.parametrize(
    "changes",
    [
        {"action": "unknown.action"},
        {"request_id": "secret-sentinel"},
        {"resource_id": "not-uuid"},
        {"resource_type": "password"},
    ],
)
def test_aud07_invalid_event_identity_and_action(changes):
    kwargs = {
        "action": Action.MEMBERSHIPS_READ,
        "resource_type": "organization",
        "request_id": uuid4(),
        "resource_id": uuid4(),
        "attributes": {"returned_count": 0},
        **changes,
    }
    with pytest.raises(InvalidAuditEvent):
        AuditService().record(NoSQL(), AuthorizedContext(uuid4(), uuid4()), **kwargs)


@pytest.mark.parametrize(
    "values",
    [
        {"limit": 0},
        {"limit": 101},
        {"before_id": uuid4()},
        {"before_at": "2026-10-12T00:00:00Z"},
        {"from_at": "2026-10-12T00:00:00"},
        {"from_at": "2026-10-13T00:00:00Z", "until": "2026-10-12T00:00:00Z"},
        {"from_at": "2026-10-12T00:00:00Z", "until": "2026-10-12T00:00:00Z"},
        {"action": "unknown.action"},
    ],
)
def test_aud15_query_contract_invalid(values):
    with pytest.raises(ValidationError):
        AuditQuery(**values)
