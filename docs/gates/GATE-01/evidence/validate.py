import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
d=json.loads((root/'DEPENDENCIES.yaml').read_text())['deliveries']
assert len(d)==42
seen=set();visiting=set()
def visit(i):
 assert i in d,i
 assert i not in visiting, f'cycle: {i}'
 if i in seen:return
 visiting.add(i)
 for j in d[i]['HARD']:visit(j)
 visiting.remove(i);seen.add(i)
for i in d:
 visit(i)
 p=root/'contracts'/f'{i}.md'
 assert p.is_file(),i
 assert len(p.read_text())>300,i
 text=p.read_text().replace('**','')
 for label in ['ID','Nombre','Objetivo','Responsable','Dependencias HARD','Dependencias CONTRACT','Dependencias EXTERNAL','Alcance','Exclusiones','Módulos afectados','Archivos previstos','Migraciones','Endpoints','Permisos','Reglas de negocio','Pruebas','Criterios de aceptación','Evidencias','Riesgos','Plan de reversión','Condición de cierre']:
  assert label+':' in text, (i,label)
assert set(d['E-17']['HARD'])==set(['E-12','E-13','E-14','E-15','N-00','N-01','N-03'])
for p in ['GOVERNANCE.md','ARCHITECTURE.md','PROJECT_SCOPE.md','DATA_MODEL.md','UX_FLOWS.md','DELIVERY_CONTRACTS.md','DEFINITION_OF_DONE.md','CHANGE_CONTROL.md','TRANSITION.md','ACCEPTANCE_CRITERIA.md','RISK_REGISTER.md','ACTION_PLAN.md']:
 assert (root/p).is_file(),p
print('PASS: 42 contracts, all normative/support files, acyclic graph and explicit E-17 expansion')

repo=root.parents[2]
original=json.loads((repo/'docs/DEPENDENCIES.yaml').read_text())['deliveries']
for i,v in original.items():
 assert set(v['HARD']).issubset(d[i]['HARD']),i
status=json.loads((repo/'docs/PROJECT_STATUS.yaml').read_text())
assert status['deliveries']['E-00']['status']=='COMPLETED'
assert status['deliveries']['E-01']['status']=='IN_REVIEW'
assert status['gates']['GATE-01']['approval'] is None
print('PASS: mandatory fields, original HARD preservation, E-00 retained and no fabricated approvals')
