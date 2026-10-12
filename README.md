# Plataforma de formación arbitral
Proyecto independiente de eQuantum; sin vínculo institucional APF.
Línea base activa: [GATE-01 v2](docs/BASELINE_INDEX.md). E-00, E-01, E-02 y E-03 aprobadas. Identidad y aislamiento verificados con Supabase Auth y PostgreSQL efímeros; despliegue cloud persistente pendiente. Siguiente entrega: E-04 auditoría, [contrato detallado en revisión](docs/deliveries/E-04.md), pendiente de aceptación antes de implementar. Entrenamiento, video privado y evaluación funcional aún pendientes.

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
