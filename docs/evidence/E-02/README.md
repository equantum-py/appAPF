# E-02 — evidencia y reproducción
Estado: IN_REVIEW. Local sin PostgreSQL/Docker; pruebas SQL se ejecutan en GitHub Actions con postgres:17.11, DB efímera apf_e02_test. Contraseñas en CI/compose son exclusivamente fixtures sin uso productivo; no hay secretos reales ni cuenta Supabase conectada.

## Reproducción con PostgreSQL efímero
En entorno con Docker: `docker compose -f infra/test-postgres.yml up -d`; desde services/api, usar E02_TEST_MODE=isolated, PYTHONPATH=. y URLs explícitas a localhost/apf_e02_test: admin postgres, migrator apf_migrator, runtime apf_runtime. Credenciales de fixtures y comandos exactos están en .github/workflows/ci.yml.
`uv run python -m tests.bootstrap_postgres`; `uv run python migrations/build_initial_snapshot.py --check`; `uv run pytest -q`; `uv run alembic check`.
No sustituir DB con SQLite. Si no hay conexión, pytest -m postgres falla; local usa -m 'not postgres' y registra las pruebas SQL NOT_RUN, no PASS.

## Casos
T01 inventario23 tablas (+alembic_version); T02 FK/unique/policies; T03 downgrade/upgrade; T04 FK cruzada; T05 modalidad; T06 membresía duplicada; T07 posición duplicada; T08 físico sobre cognitivo; T09 runtime sin privilegios/DDL/update/delete/truncate de audit; T10 drift; T11 concurrencia misma clave produce una fila. Adicionales: RLS contexto y propietario personal, unidades físicas, versiones/children publicadas protegidas y aprobador distinto/autor exacto.
T11 prueba unicidad transaccional en DB; evaluación idempotente y respuesta 409 de API pertenecen E-11 y no están implementadas.

## Límites de seguridad
RLS opera sobre contexto transaccional proporcionado por FastAPI: app.organization_id y app.actor_id. No valida JWT ni permisos/membresía activa por sí sola. El cliente no debe recibir credenciales runtime. E-03 valida identidad, membresía y operación antes de devolver datos; E-08 controla publicación y competencia de revisor. Las pruebas E-02 no equivalen a autorización de endpoints.
Runtime es LOGIN sin superusuario, BYPASSRLS, CREATE ROLE/DB ni propiedad del schema. Migrator posee schema y puede administrar DDL/roles no; propietarios/superusuarios pueden cambiar controles, por eso no se afirma inmutabilidad absoluta. Tablas app no se exponen por Data API.
Audit/historia no modificables por runtime; no se registra todavía automáticamente cada acción de negocio (E-04). SQL de derechos no valida permisos de video (E-07).

## Índices y versiones
Índices PK/unique soportan identidades, tenant+id, versiones y claves de idempotencia; índices adicionales solo para FKs sin prefijo cubierto. Planes/rendimiento con carga real se medirán después. PostgreSQL17 soportado según https://www.postgresql.org/support/versioning/ ; driver psycopg[binary]3.3.6 fijado en pyproject/uv.lock. Fuentes de constraints/RLS: https://www.postgresql.org/docs/17/ddl-constraints.html y https://www.postgresql.org/docs/17/ddl-rowsecurity.html.
