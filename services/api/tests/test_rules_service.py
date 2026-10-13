import pytest
from pydantic import ValidationError

from app.rules.schemas import EditionInput


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"label": 1},
        {"label": ""},
        {"label": "   "},
        {"label": "x" * 101},
        {"label": "x\ny"},
        {"label": "\tx"},
        {"label": "x\x7f"},
        {"label": "valid", "id": "forged"},
        {"label": "valid", "organization_id": "forged"},
        {"label": "valid", "created_at": "forged"},
        {"label": "valid", "role": "ADMIN"},
    ],
)
def test_rul06_closed_invalid_input(body):
    with pytest.raises(ValidationError):
        EditionInput.model_validate(body)


@pytest.mark.parametrize("label", ["a", "é" * 100, "  Edición  A  "])
def test_rul06_normalization_boundaries(label):
    assert EditionInput(label=label).label == label.strip()
