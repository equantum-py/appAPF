"""Build requirement evidence from executed JUnit, never from the planning matrix."""

import argparse
import json
import os
import xml.etree.ElementTree as ET
from datetime import UTC, datetime
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("report", type=Path)
parser.add_argument("--commit", required=True)
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args()
tests = list(ET.parse(args.report).getroot().iter("testcase"))
assert tests and not any(
    any(t.find(tag) is not None for tag in ["failure", "error", "skipped"])
    for t in tests
), "Failed, missing or skipped executable evidence"
requirements = {f"RUL-{i:02}": [f"test_rul{i:02}_"] for i in range(1, 17)}
requirements["RUL-16"] += [
    "test_openapi_contract_matches_export",
    "test_t10_no_metadata_drift",
    "test_real_auth_issued_token_database_permissions_and_logout_client_boundary",
]
cases = {}
for identifier, prefixes in requirements.items():
    matching = []
    for prefix in prefixes:
        selected = [t for t in tests if t.attrib["name"].startswith(prefix)]
        assert selected, f"Missing {identifier}: {prefix}"
        matching.extend(
            {"module": t.attrib["classname"], "test": t.attrib["name"]}
            for t in selected
        )
    cases[identifier] = {"result": "PASS", "testcases": matching}
assert any(
    t.attrib["name"] == "test_rul08_concurrent_creation_real_transactions"
    for t in tests
)
assert any(
    t.attrib["name"] == "test_rul13_migration_with_existing_references" for t in tests
)
args.output.write_text(
    json.dumps(
        {
            "commit": args.commit,
            "date": datetime.now(UTC).isoformat(),
            "run_id": os.environ.get("GITHUB_RUN_ID"),
            "report": args.report.name,
            "result": "PASS",
            "total_backend_tests": len(tests),
            "cases": cases,
            "scope": (
                "E-05 metadata/API; references use SQL fixtures, "
                "not future product APIs"
            ),
        },
        indent=2,
    )
    + "\n"
)
print(f"PASS: RUL-01..16 mapped to {len(tests)} passing backend tests")
