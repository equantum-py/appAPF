# Plataforma de formación arbitral
Proyecto independiente de eQuantum. Sin vínculo institucional APF.
GATE-00 aprobado por Derlis sobre b6117d1. E-00: fundación en revisión; no hay entrenamiento, API operativa ni despliegue.

## Comprobaciones reproducibles
Node 24 y Python 3.12. No requiere servicios externos de negocio ni secretos.
```bash
npm ci
npm run lint
npm run typecheck
npm run build
cd services/api
uv sync --locked
uv run ruff check .
uv run pytest -q
```
Desde raíz: `python docs/evidence/validate_planning.py`.
Ejecutar web: `npm run dev --workspace apps/web`. API todavía no tiene servidor; corresponde E-01.
Ver docs/GATE-00.md, docs/PROJECT_STATUS.yaml y docs/deliveries/E-00.md.
GitHub Actions replica verificaciones en checkout limpio y guarda el SHA del commit verificado.
