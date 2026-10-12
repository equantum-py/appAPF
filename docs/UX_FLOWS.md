# Flujos propuestos P-02 y P-03
## Árbitro
Acceso -> organización activa -> biblioteca publicada -> jugada/video -> decisión, regla y nivel de seguridad -> confirmación -> envío -> resultado y explicación -> progreso.
Sin conexión: mostrar indisponibilidad de envío; no confirmar éxito ficticio. Error de video: reintentar sin perder selección. Doble envío: idempotencia. Sesión vencida: reautenticar. Antes de envío no revelar criterio en interfaz ni respuestas API. Offline PWA inicial: portada y mensaje, sin cachear videos privados o respuestas sensibles.
## Instructor
Acceso -> organización -> biblioteca administrativa -> crear situación con edición y video autorizado -> opciones/rúbrica -> enviar a revisión -> corregir rechazo o recibir aprobación -> publicar -> consultar intentos autorizados -> revisar evaluación con motivo.
Revisor técnico humano valida versión exacta; cambios invalidan aprobación anterior. No alterar intentos ni evaluaciones históricas. Administrador gestiona membresías propias; no datos ajenos.
Son flujos documentales, no pantallas implementadas ni QA visual ejecutada.
