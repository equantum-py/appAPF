# Adopción sin pérdida
1. Derlis aprueba GATE-01 contra commit exacto; registrar approvals/GATE-01.json. E-01 requiere aprobación propia del 83658ae.
2. Archivar baseline GATE-00 por referencia al commit aprobado; no borrar documentos/source/evidence/approvals.
3. En un commit documental, actualizar índice raíz para apuntar a esta línea base y activar su DEPENDENCIES/contratos; cambios normativos registrados CHG-002. Registrar revised_by_gate sin reescribir aprobación histórica P-*.
4. Leer estado: E-00 COMPLETED, E-01 según aprobación, E-02 READY únicamente si gate/HARD y recurso de prueba están satisfechos; N-* aún bloqueadas por sus dependencias.
5. Implementar y verificar E-02. No aprobar esquema por aprobar el documento.
Reversión de dirección: solicitud de cambio nueva que vuelve a baseline anterior, sin borrar historia. Esta carpeta propuesta sola no cambia código ni DB.
