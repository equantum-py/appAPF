# Control de cambios
MINOR: corrección interna sin alterar contratos, datos, seguridad o alcance. Puede prepararse y verificarse con autorización vigente.
MAJOR: API, esquema, permisos, comportamiento o dependencias. Preparar impacto y propuesta antes de implementación; aprobación de la línea base afectada requerida.
CRITICAL: producción, datos sensibles, seguridad, costos o arquitectura fundamental. Requiere autorización específica; el automatismo general no la sustituye.
Registro obligatorio: ID, solicitante, motivo, tipo, archivos y entregas afectados, riesgos, decisión, aprobador, fecha y evidencia.
CHG-000: propuesta de clarificaciones iniciales, solicitante Derlis, fecha local 2026-10-11. Afecta documentos iniciales P-00..P-04; pendiente GATE-00. Aclara evidencia documental, separación de aprobación y ejecución, decisiones de hosting pendientes y autoridad de main. No cambia stack, dependencias HARD ni alcance del prompt.
Reversión mediante commit de reversión, nunca force-push o borrado de historial. No eliminar datos reales, desactivar seguridad o publicar contenido arbitral sin aprobación específica.

CHG-001: corrección documental MINOR, 2026-10-11; actualización de estado de aprobación y verificación de versiones en ARCHITECTURE.md. Alcance/stack/contratos arquitectónicos sin cambios. Derlis aprobó GATE-00 y E-00; autorización vigente de mantenimiento documental. Evidencia: approvals/GATE-00.json, approvals/E-00.json, evidence/E-00/ci.json.
