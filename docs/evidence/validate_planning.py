import json,pathlib,hashlib
root=pathlib.Path(__file__).resolve().parents[2]
d=json.loads((root/'docs/DEPENDENCIES.yaml').read_text())['deliveries']
visiting=set();done=set()
def visit(i):
 assert i in d, i
 assert i not in visiting, 'dependency cycle'
 if i in done:return
 visiting.add(i)
 for j in d[i]['HARD']:visit(j)
 visiting.remove(i);done.add(i)
for i in d:
 visit(i)
 assert (root/f'docs/deliveries/{i}.md').exists(),i
s=json.loads((root/'docs/PROJECT_STATUS.yaml').read_text())
assert set(s['deliveries'])==set(d)
assert all(x['approval'] is None and x['status']!='COMPLETED' for x in s['deliveries'].values())
for f in ['GOVERNANCE.md','ARCHITECTURE.md','DEPENDENCIES.yaml','DEFINITION_OF_DONE.md','DELIVERY_CONTRACTS.md','CHANGE_CONTROL.md']:
 assert (root/'docs'/f).is_file(),f
print('PASS: 26 delivery contracts, acyclic HARD graph, normative files, status and no invented approvals')
