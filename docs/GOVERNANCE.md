# Gobierno
Estado: propuesta para GATE-00. Fuente inicial: prompt V3 adjunto.
Product Owner y responsable de aprobación: Derlis Aguilera. Arquitectura, implementación y preparación de QA: agente asistente; sus revisiones no equivalen a revisión independiente. Especialista arbitral: pendiente de designar; bloquea publicación de contenido técnico real.

Estados: PENDING, BLOCKED, READY, IN_PROGRESS, IN_REVIEW, FAILED, COMPLETED. COMPLETED exige evidencia y aprobación humana explícita registrada con fecha y versión. READY exige dependencias COMPLETED y contratos aprobados. No hay aprobaciones retroactivas ni implícitas por un resultado de prueba.
La autorización de automatismo permite preparar documentos, código, pruebas y commits en main dentro del alcance; no equivale a aprobar entregas, gastos, producción o contenidos oficiales.

Orden: decisiones aprobadas registradas, gobierno, arquitectura, dependencias, DoD, contratos y control de cambios. Una contradicción bloquea solo la operación afectada y se registra. No modificar silenciosamente la línea base.
Antes de implementar: leer estado, contrato, dependencias, riesgos y evidencia de la versión aprobada. Después: verificar, registrar evidencia, dejar IN_REVIEW y presentar resultado. No iniciar dependientes de una entrega IN_REVIEW.
