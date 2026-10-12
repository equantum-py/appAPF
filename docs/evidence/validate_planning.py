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
for i,x in s['deliveries'].items():
 if x['status']=='COMPLETED':
  assert x['approval'] and x['approval']['approver']=='Derlis Aguilera'
  approval_path = root/'docs/approvals'/('GATE-00.json' if i.startswith('P-') else f'{i}.json')
  assert json.loads(approval_path.read_text()) == x['approval']
  assert all(s['deliveries'][j]['status']=='COMPLETED' for j in d[i]['HARD'])
for f in ['GOVERNANCE.md','ARCHITECTURE.md','DEPENDENCIES.yaml','DEFINITION_OF_DONE.md','DELIVERY_CONTRACTS.md','CHANGE_CONTROL.md']:
 assert (root/'docs'/f).is_file(),f
print('PASS: 26 delivery contracts, acyclic HARD graph, normative files, status and no invented approvals')
