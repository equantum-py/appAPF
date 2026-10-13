import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
d = json.loads((root / "docs/DEPENDENCIES.yaml").read_text())["deliveries"]
s = json.loads((root / "docs/PROJECT_STATUS.yaml").read_text())
assert set(s["deliveries"]) == set(d)
visiting, done = set(), set()


def visit(i):
    assert i in d and i not in visiting
    if i in done:
        return
    visiting.add(i)
    for parent in d[i]["HARD"]:
        visit(parent)
    visiting.remove(i)
    done.add(i)


for i in d:
    visit(i)
    assert (root / f"docs/deliveries/{i}.md").exists()
    item = s["deliveries"][i]
    if item["status"] == "COMPLETED":
        name = "GATE-00" if i.startswith("P-") else i
        approval = json.loads((root / f"docs/approvals/{name}.json").read_text())
        assert item["approval"] == approval and approval["approver"] == "Derlis Aguilera"
        assert all(s["deliveries"][j]["status"] == "COMPLETED" for j in d[i]["HARD"])
assert s["baseline"]["version"] == 2
assert s["gates"]["GATE-01"]["approval"]
print("PASS: active v2 graph, contracts, recorded approvals and completed dependencies")
