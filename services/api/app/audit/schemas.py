"""Closed, typed audit payloads; no free-form strings or copied request data."""

import json
from datetime import datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_serializer, model_validator


class Action(StrEnum):
    EDITION_CREATED = "rulebook.edition.created"
    EDITIONS_READ = "rulebook.editions.read"
    EDITION_READ = "rulebook.edition.read"
    MEMBERSHIPS_READ = "organization.memberships.read"
    EVENTS_READ = "audit.events.read"
    SITUATION_PUBLISHED = "situation.version.published"
    PHYSICAL_PUBLISHED = "physical.exercise.version.published"
    RUN_STARTED = "training.run.started"
    RUN_COMPLETED = "training.run.completed"
    PHYSICAL_RESULT = "physical.result.recorded"
    EVALUATION_REVIEW = "evaluation.review.recorded"


ResourceType = Literal[
    "rulebook_edition",
    "organization",
    "situation_version",
    "physical_exercise_version",
    "training_run",
    "physical_result",
    "evaluation_review",
]
SPECS = {
    Action.EDITION_CREATED: ("rulebook_edition", set()),
    Action.EDITIONS_READ: ("organization", {"returned_count"}),
    Action.EDITION_READ: ("rulebook_edition", set()),
    Action.MEMBERSHIPS_READ: ("organization", {"returned_count"}),
    Action.EVENTS_READ: ("organization", {"returned_count"}),
    Action.SITUATION_PUBLISHED: ("situation_version", {"version_number"}),
    Action.PHYSICAL_PUBLISHED: ("physical_exercise_version", {"version_number"}),
    Action.RUN_STARTED: ("training_run", {"modality"}),
    Action.RUN_COMPLETED: ("training_run", {"modality"}),
    Action.PHYSICAL_RESULT: ("physical_result", set()),
    Action.EVALUATION_REVIEW: ("evaluation_review", set()),
}


class ClosedModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Attributes(ClosedModel):
    returned_count: int | None = Field(default=None, ge=0, strict=True)
    version_number: int | None = Field(default=None, gt=0, strict=True)
    modality: Literal["PHYSICAL", "COGNITIVE_DECISION"] | None = None

    @model_serializer
    def safe_dump(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}


class EventDetails(ClosedModel):
    schema_version: Literal[1] = 1
    request_id: UUID
    outcome: Literal["SUCCESS"] = "SUCCESS"
    resource_type: ResourceType
    resource_id: UUID
    attributes: Attributes


class EventInput(ClosedModel):
    action: Action
    details: EventDetails

    @model_validator(mode="after")
    def validate_action_payload(self):
        resource, fields = SPECS[self.action]
        attrs = self.details.attributes.model_dump(exclude_none=True)
        if self.details.resource_type != resource or set(attrs) != fields:
            raise ValueError("Invalid audit payload.")
        if len(json.dumps(self.details.model_dump(mode="json")).encode()) > 4096:
            raise ValueError("Invalid audit payload.")
        return self


class ProjectedDetails(ClosedModel):
    schema_version: Literal[1] | None = None
    request_id: UUID | None = None
    outcome: Literal["SUCCESS"] | None = None
    resource_type: ResourceType | None = None
    resource_id: UUID | None = None
    attributes: Attributes | None = None

    @model_serializer
    def safe_dump(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}


class AuditEvent(ClosedModel):
    id: UUID
    organization_id: UUID
    created_at: datetime
    actor_user_id: UUID | None
    action: Action | Literal["legacy.unknown"]
    details: ProjectedDetails


class Cursor(ClosedModel):
    before_at: datetime
    before_id: UUID


class AuditPage(ClosedModel):
    items: list[AuditEvent]
    next_cursor: Cursor | None


class AuditQuery(ClosedModel):
    limit: int = Field(default=50, ge=1, le=100)
    action: Action | None = None
    from_at: datetime | None = None
    until: datetime | None = None
    before_at: datetime | None = None
    before_id: UUID | None = None

    @model_validator(mode="after")
    def validate_range(self):
        for date in [self.from_at, self.until, self.before_at]:
            if date is not None and (date.tzinfo is None or date.utcoffset() is None):
                raise ValueError("A timezone is required.")
        if self.from_at is not None and self.until is not None:
            if self.from_at >= self.until:
                raise ValueError("Invalid date interval.")
        if (self.before_at is None) != (self.before_id is None):
            raise ValueError("Incomplete cursor.")
        return self
