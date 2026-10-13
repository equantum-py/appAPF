# Decisiones
ADR-001: stack y monolito modular del prompt conservados; pendiente GATE-00.
ADR-002: main autorizada para documentación; commits pequeños y reversibles; no implica producción aprobada.
ADR-003: autorización de automatismo para ejecución, aprobación humana para cierres. Pendiente confirmación de GATE-00; no se modifica esta restricción por inferencia.
ADR-004: versiones, hosting API, proveedor videos, Supabase, privacidad/retención y costos pendientes. No crear recursos pagos ni declarar compatibilidad sin verificación.
ADR-005: contratos futuros son borradores hasta expansión. Conservar todos los HARD originales; aprobación conjunta de planificación en GATE-00 permite cierres P-00..P-04 ordenados sin inventar aprobación previa.

ADR-006 (E-03): probar identidad con Supabase Auth oficial efímero y DB Auth separada en CI; conserva proveedor y monolito aprobados. No provisionar proyectos cloud ajenos ni incurrir en gastos. Claves ES256 temporales, gateway de test explícito; binding cloud persistente corresponde al despliegue. Roles de negocio exclusivamente en PostgreSQL.
