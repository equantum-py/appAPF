# E-03 — Evidencia y reproducción

E-02 aprobado sobre 949b46e: `docs/approvals/E-02.json`. E-03 se mantiene sin aprobación hasta aceptación humana de la versión exacta.

## Recorrido

Next.js `/ingresar` envía credenciales exclusivamente a Supabase Auth. El cliente obtiene una sesión y transmite bearer a FastAPI. FastAPI verifica firma ES256/RS256, issuer, audience y claims obligatorios; resuelve el usuario interno y consulta membresías activas bajo el usuario SQL runtime y RLS. `/app` muestra únicamente espacios devueltos por esa API. La pantalla estática no contiene datos privados; la API constituye el control de autorización.

## Entorno y comandos

`.github/workflows/ci.yml` crea PostgreSQL17.11 efímero. `uv run python -m tests.bootstrap_postgres` provisiona roles de test. `uv run python -m tests.start_auth` inicia la imagen oficial `supabase/gotrue:v2.196.0`, con DB de autenticación separada, clave privada ES256 temporal y usuarios sintéticos. `uv run pytest -q --junitxml=../../ci-evidence/postgres-tests.xml` verifica fixtures criptográficos, DB real y un JWT realmente emitido por Auth. `uv run alembic check` verifica ausencia de drift.

`tests.browser_fixture` provisiona exclusivamente datos sintéticos. Next production build y Uvicorn local son probados mediante Chromium (`npm exec --workspace apps/web -- playwright test`): redirect sin sesión, ingreso, membresía propia, organización ajena403, petición anónima401, recarga con sesión persistida y salida local. JUnit y captura no contienen claves, contraseñas ni bearer. Los secretos temporales se eliminan y los recursos se descartan al terminar CI.

Controles: `npm ci`, lint, tipos, build; `uv sync --locked`, Ruff, snapshot SQL congelado y validadores documentales. Reportes y manifest referencian el commit probado; correcciones conservan los fallos anteriores.

## Límites explícitos

El proxy loopback de CI aporta el prefijo `/auth/v1` y CORS; no prueba el gateway cloud ni su validación de claves publicables. No se ha creado ni desplegado un proyecto Supabase persistente. La provisión de usuarios de negocio es fixture, no una interfaz de administración o registro (E-15). La salida es local: JWT emitidos pueden seguir siendo válidos hasta expirar; retirar una membresía bloquea el acceso organizacional en la siguiente petición. Caché JWKS60s y propagación de claves pueden demorar revocación. Producción, correo real, recuperación de contraseña y offline no se declaran verificados en E-03.
