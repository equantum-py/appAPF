# E-05 — Ediciones de reglas: evidencia y reproducción

Contrato aceptado sobre 00a3623, registro ../../approvals/E-05-contract.json. La aceptación del contrato habilita implementación; COMPLETED exige aprobación separada del commit probado.

## Comportamiento

POST/GET /v1/organizations/{id}/rulebook-editions y GET de detalle. Creación por ADMIN institucional o dueño PERSONAL con membresía activa; lectura por miembros activos del espacio autorizado. JWT y organización se resuelven con E-03; metadatos del JWT no conceden rol. No PATCH/PUT/DELETE.

label se valida sin controles, se recorta en los extremos y conserva caso/acento/espacios interiores; UNIQUE por organization_id/label, UUID y fecha del servidor. Duplicado concurrente: una creación201, otra409, una fila y un evento. Resolver de edición exige conexión/contexto autorizados y mismo tenant; IDs inexistentes/ajenos dan404.

Migración0003 reutiliza el trigger de inmutabilidad y revoca UPDATE/DELETE/TRUNCATE del runtime. No altera tablas, UUID, labels, FKs o snapshots. Downgrade efímero restaura solo UPDATE/DELETE: TRUNCATE no existía en0002 y no se concede. Versiones de situación/evaluación existentes conservan referencias.

Crear/leer y evento comparten transacción. Si auditoría falla, creación rollback; lectura503 sin datos. AuditResource/Action se extienden con los tres códigos de reglas sin contenido/label en details; registros previos mantienen formato y comportamiento.

## Reproducción

Usar .github/workflows/ci.yml y sus PostgreSQL17.11/Auth oficial v2.196.0 efímeros. Mismos roles runtime/migrador aislados de E-02.

- npm ci; lint, typecheck y build.
- services/api: uv sync --locked; uv run ruff check .; bootstrap_postgres/start_auth existentes.
- uv run pytest -q --junitxml=../../ci-evidence/postgres-tests.xml.
- Snapshot --check y Alembic check; migración probada con situación y evaluación ya referenciadas.
- Chromium E-03 existente; validadores documentales y git diff --check.
- Resúmenes de AUD-01..17 y RUL-01..16 sobre JUnit, fallan ante faltantes/skips/errores.

El artefacto foundation-evidence conserva commit.txt, PostgreSQL versión, JUnit, audit-cases.json y rule-cases.json. Reportes textuales y hashes se preservan tras PASS; captura de regresión permanece solo en el artefacto original. test-plan.json conserva el NOT_RUN histórico del plan; resultados ejecutados van en manifest.json.

## Alcance de la prueba

Concurrencia usa dos transacciones PostgreSQL activas sincronizadas tras autorización. FKs y migración utilizan fixtures de referencias reales del esquema; no se implementa ni simula como operativo E-06/E-11. Ediciones son metadatos: sin reglamentos oficiales copiados, derechos asumidos, publicación, selector visual o despliegue cloud. Protección de historial es frente al runtime, no al administrador de base. Logout local y límites JWKS de E-03 permanecen.
