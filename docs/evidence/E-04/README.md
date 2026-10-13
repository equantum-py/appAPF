# E-04 — Auditoría: evidencia y reproducción

Contrato aceptado por Derlis sobre 0ee2b25: ../../approvals/E-04-contract.json.
La aceptación del contrato habilita implementación; el cierre E-04 requiere otra aprobación humana del commit probado.

## Flujo implementado

GET /v1/organizations/{id}/memberships conserva permisos/payload de E-03.
El backend valida JWT y membresía, consulta bajo runtime/RLS y registra organization.memberships.read en la misma transacción antes de devolver datos.

GET /v1/organizations/{id}/audit-events permite solo ADMIN institucional activo o dueño del espacio PERSONAL con membresía activa. Los roles institucionales no permiten leer espacios personales ajenos. Consulta por fecha/acción y cursor estable (created_at,id), registra audit.events.read y confirma antes de responder; el evento recién creado no se incluye en esa página.

Validación cerrada de campos y atributos por acción; máximo 4096 bytes UTF-8. La consulta proyecta datos legacy a campos y tipos permitidos, sin devolver JSON arbitrario. Un error de escritura devuelve 503 sin payload privado. No hay endpoint de escritura/libre ni mutación de eventos, migración o cambio de grants.

## Pruebas y comandos

GitHub Actions crea PostgreSQL 17.11, runtime sin privilegios elevados, migrador separado y servicio oficial Auth v2.196.0 efímero.

- npm ci, npm run lint, npm run typecheck, npm run build.
- services/api: uv sync --locked; uv run ruff check .
- CI: bootstrap_postgres y start_auth existentes; uv run pytest -q --junitxml=../../ci-evidence/postgres-tests.xml; snapshot --check; uv run alembic check.
- Regresión Chromium E-03: ingreso, recarga, tenant ajeno y salida local.
- python docs/evidence/E-04/summarize.py ci-evidence/postgres-tests.xml --commit COMMIT_EXACTO --output ci-evidence/audit-cases.json.
- Validadores de planificación/GATE-01 y git diff --check.

El resumen exige AUD-01..17 con tests identificables y ningún failure/error/skipped. El artefacto foundation-evidence conserva commit.txt, JUnit backend, JUnit/captura Chromium, versión PostgreSQL y audit-cases.json. Después de CI se preservan reportes/manifest con hash, commit, fecha, entorno, comandos y resultados. test-plan.json sigue como plan original NOT_RUN del contrato; no se sobrescribe para fingir evidencia anterior.

## Límites

Las acciones futuras se verifican como formatos y transacciones con datos sintéticos; no son integración de publicación, evaluación ni entrenamiento de negocio. Los recursos futuros son responsabilidad del llamador para existencia/tenant/permiso. No se ha desplegado cloud persistente, realizado operaciones con datos reales ni agregado UI. Los superusuarios/propietarios de la DB pueden administrar la base; la protección append-only se garantiza frente al runtime, con trigger adicional contra UPDATE/DELETE. No hay promesa de deduplicación distribuida, retención/purga ni snapshot global entre páginas. Se mantienen límites de Auth/JWKS y logout local de E-03.
