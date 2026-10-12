# Alembic E-02
Inicial 0001_domain_schema y snapshots SQL congelados. No importa metadata futura para ejecutar upgrade; metadata vigente solo se usa en detección de drift.
Solo destino explícito apf_e02_test en localhost y E02_TEST_MODE=isolated. Bootstrap roles/schema requiere admin efímero; Alembic conecta como apf_migrator, API no ejecuta migraciones.
No ejecutar downgrade sobre datos reales. No hay esquema desplegado en producción.
