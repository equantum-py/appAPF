from pathlib import Path

from app.shared.database import register_models


def test_domain_inventory_and_frozen_snapshot():
    metadata = register_models()
    assert len(metadata.tables) == 23
    assert all(table.schema == "app" for table in metadata.tables.values())
    assert all(
        column.name != "password"
        for table in metadata.tables.values()
        for column in table.columns
    )
    assert (Path(__file__).parents[1] / "migrations/versions/0001_tables.sql").exists()
