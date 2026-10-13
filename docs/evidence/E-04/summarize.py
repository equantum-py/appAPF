"""Fail CI unless every AUD case has passing executable evidence."""

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
cases = list(ET.parse(args.report).getroot().iter("testcase"))
assert cases, "No executed tests"
assert not any(
    any(case.find(tag) is not None for tag in ["failure", "error", "skipped"])
    for case in cases
), "Failed or skipped requirement evidence"
requirements = {
    f"AUD-{number:02}": [f"test_aud{number:02}_"] for number in range(1, 17)
}
requirements["AUD-17"] = [
    "test_openapi_contract_matches_export",
    "test_domain_inventory_and_frozen_snapshot",
    "test_t10_no_metadata_drift",
    "test_scope_migration_can_revert_and_restore",
    "test_personal_history_hidden_and_transaction_context_does_not_leak",
    "test_real_auth_issued_token_database_permissions_and_logout_client_boundary",
    "test_aud17_no_http_event_write_or_mutation_surface",
]
result = {}
for identifier, prefixes in requirements.items():
    matching = []
    for prefix in prefixes:
        selected = [case for case in cases if case.attrib["name"].startswith(prefix)]
        assert selected, f"Missing evidence for {identifier}: {prefix}"
        matching.extend(
            {"module": case.attrib["classname"], "test": case.attrib["name"]}
            for case in selected
        )
    result[identifier] = {"result": "PASS", "testcases": matching}
# AUD-06 must include real PostgreSQL service writes, not only schema fixtures.
assert any(
    case.attrib["name"].startswith("test_aud06_service_future_catalog_fixtures")
    for case in cases
)
args.output.write_text(
    json.dumps(
        {
            "commit": args.commit,
            "date": datetime.now(UTC).isoformat(),
            "run_id": os.environ.get("GITHUB_RUN_ID"),
            "report": args.report.name,
            "total_backend_tests": len(cases),
            "result": "PASS",
            "cases": result,
            "scope": (
                "E-04 HTTP/real PostgreSQL; future actions are format fixtures only"
            ),
        },
        indent=2,
    )
    + "\n"
)
print(f"PASS: AUD-01..17 mapped to {len(cases)} passing backend testcases")
