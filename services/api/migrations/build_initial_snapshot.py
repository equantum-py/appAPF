"""Build frozen initial DDL once; --check compares current metadata to snapshot."""

import json
import sys
from pathlib import Path

from sqlalchemy.dialects import postgresql
from sqlalchemy.schema import CreateIndex, CreateTable

from app.shared.database import register_models

metadata = register_models()
statements = []
for table in metadata.sorted_tables:
    statements.append(
        str(CreateTable(table).compile(dialect=postgresql.dialect())) + ";"
    )
    for index in sorted(table.indexes, key=lambda x: x.name):
        statements.append(
            str(CreateIndex(index).compile(dialect=postgresql.dialect())) + ";"
        )
ddl = (
    "\n".join(line.rstrip() for line in "\n".join(statements).splitlines()).strip()
    + "\n"
)
folder = Path(__file__).parent / "versions"
folder.mkdir(exist_ok=True)
path = folder / "0001_tables.sql"
if "--check" in sys.argv:
    assert path.read_text() == ddl, "metadata changed without a migration"
    print("PASS: initial metadata matches frozen table/index snapshot")
else:
    path.write_text(ddl)
    (folder / "0001_tables.json").write_text(
        json.dumps([t.name for t in metadata.sorted_tables], indent=2) + "\n"
    )
