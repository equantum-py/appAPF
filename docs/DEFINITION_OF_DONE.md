# Definición de terminado
Todas las entregas: alcance del contrato satisfecho, versión identificada por commit, diff revisado, documentación coherente, evidencia disponible, sin defecto bloqueante y aprobación humana de esa versión.
Para planificación: revisión de alcance, flujo, contratos, grafo sin ciclos, riesgos y trazabilidad. Build, lint de aplicación, migraciones y despliegue son N/A con justificación: no hay código de aplicación. Las verificaciones documentales sí son obligatorias.
Para implementación: lint, tipos, unitarias, integración, autorización, migraciones, contratos, interfaz, build/regresión y despliegue cuando aplican. El contrato determina aplicabilidad antes de ejecutar; NOT_RUN indica prueba pendiente o bloqueo, nunca PASS. N/A necesita motivo verificable.
Cada evidencia: entrega, commit o SHA256 de archivos más referencia al commit que los contiene, comando/caso, resultado, fecha, entorno y ubicación. No incluir tokens o datos personales. Una captura sola no prueba autorización ni persistencia.
COMPLETED requiere aprobación registrada; aprobar GATE-00 no aprueba futuras implementaciones.
