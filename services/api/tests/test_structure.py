from importlib import import_module

import pytest


@pytest.mark.parametrize(
    "name",
    [
        "identity",
        "organizations",
        "rules",
        "catalog",
        "media",
        "training",
        "evaluation",
        "analytics",
        "assistant",
        "audit",
        "shared",
    ],
)
def test_module_boundary_imports(name):
    assert import_module(f"app.{name}").__name__ == f"app.{name}"
