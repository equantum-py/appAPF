# Plataforma de formación arbitral
Proyecto independiente de eQuantum; sin vínculo institucional APF.
Línea base activa: [GATE-01 v2](docs/BASELINE_INDEX.md). E-00, E-01, E-02, E-03 y E-04 aprobadas. Identidad y aislamiento verificados con Supabase Auth y PostgreSQL efímeros; despliegue cloud persistente pendiente. E-04 auditoría cerrada sobre 47ec9a2: [evidencia verificable](docs/evidence/E-04/manifest.json) y [aprobación](docs/approvals/E-04.json). E-05 ediciones de reglas implementada y en revisión sobre 224626c: [evidencia verificable](docs/evidence/E-05/manifest.json); cierre humano pendiente. Entrenamiento, video privado y evaluación funcional aún pendientes.

## Comprobaciones
Node 24, Python 3.12 y uv 0.12.23; lockfiles comprometidos.
```bash
npm ci
npm run lint
npm run typecheck
npm run build
cd services/api
uv sync --locked
uv run ruff check .
uv run pytest -m 'not postgres' -q
PYTHONPATH=. uv run python migrations/build_initial_snapshot.py --check
```
Pruebas PostgreSQL: seguir [procedimiento E-02](docs/evidence/E-02/README.md). CI ejecuta también PostgreSQL real efímero; no requiere cuentas cloud de negocio.
API: definir APP_ENV y CORS_ORIGINS según .env.example; desde services/api ejecutar `uv run uvicorn app.main:app --no-access-log`. GET /v1/health indica proceso/configuración, no conexión DB. .env no se carga automáticamente.
Documentación canónica en docs/, estado operativo en PROJECT_STATUS.yaml. Paquetes aprobados y evidencias históricas conservados.
