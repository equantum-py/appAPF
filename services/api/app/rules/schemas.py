import unicodedata
from datetime import datetime
from uuid import UUID

from pydantic import Field, field_validator

from app.audit.schemas import ClosedModel, Cursor


class EditionInput(ClosedModel):
    label: str = Field(strict=True, min_length=1, max_length=100)

    @field_validator("label", mode="before")
    @classmethod
    def normalize_label(cls, value):
        if not isinstance(value, str):
            raise ValueError("Invalid edition label.")
        if any(unicodedata.category(char) == "Cc" for char in value):
            raise ValueError("Invalid edition label.")
        return value.strip()


class Edition(ClosedModel):
    id: UUID
    organization_id: UUID
    created_at: datetime
    label: str


class EditionPage(ClosedModel):
    items: list[Edition]
    next_cursor: Cursor | None
