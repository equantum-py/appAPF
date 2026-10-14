# Preparación física — contrato funcional v1

Fecha: 2026-10-14 (Paraguay). Responsable de producto y aceptación: Derlis Aguilera.
Estado: IN_REVIEW / implementación BLOCKED. Control: CHG-012.
Entregas: N-02 (catálogo físico versionado) y N-03 (sesiones y registros).
Base consultada: main `6f9d6fd`; arquitectura y alcance v2 aprobados.

## 1. Objetivo y límite

Convertir Preparación física en un acceso central del árbitro: elegir una sesión
aprobada, entender cómo realizarla, registrar su realización y consultar su historial.
Primera entrega funcional: catálogo pequeño validado, sesiones predefinidas y
resultados autodeclarados online. La cantidad y las cargas las define el responsable
físico; este contrato no prescribe ejercicios, intensidades ni marcas mínimas.

La prioridad de producto está solicitada. Cambiar el orden técnico exige respetar
las dependencias vigentes: aprobar este contrato no elimina bloqueos ni cierra E-06.
N-02 y N-03 tienen aceptación separada; el módulo completo se acepta tras ambas.

Fuera de v1: planes automáticos según próximo partido, calendario editable,
asignación individual/grupal por preparador, acceso del instructor al historial
personal, rankings, certificados, pruebas oficiales supervisadas, sensores/GPS,
estimación de fatiga, recomendaciones clínicas, IA, sesiones combinadas y registros
offline. Asignaciones corresponden a N-04; combinado a N-09; PWA a N-01.
La propuesta anterior de planes semanales/asignación no constituye alcance aprobado.

## 2. Pantallas y recorrido

Se mantienen cuatro pestañas: Inicio, Entrenar, Progreso y Yo. Física no agrega una
quinta pestaña. El Inicio aprobado sólo cambia su acceso físico cuando exista la
capacidad real; hasta entonces conserva Próximamente. Su protagonismo visual se
presentará en una preview propia antes de cambiar la portada.

| Pantalla / ruta prevista | Contenido y acción verificables |
| --- | --- |
| `/app/fisico` | Organización activa, sesiones publicadas, filtro por categoría y nivel declarado; continuar una ejecución iniciada o elegir sesión. Sin sesión disponible: estado vacío real. |
| `/app/fisico/sesiones/{version_id}` | Objetivo, nivel, material, duración estimada definida por especialista, bloques ordenados, instrucciones, descansos, advertencias, protocolo y versión. Iniciar sesión. |
| `/app/fisico/ejecuciones/{run_id}` | Ejercicio actual y siguientes, instrucciones y video autorizado si existe. Registrar realizado/no realizado y medición cuando el protocolo la requiera. Continuar después de recargar. |
| Misma ruta: cierre | Resumen de bloques registrados; confirmar finalización o abandonar. Un bloque omitido no se marca realizado automáticamente. |
| `/app/fisico/ejecuciones/{run_id}/resumen` | Fecha, versión, ejercicios realizados sobre total y mediciones con unidades; etiqueta Autodeclarado. Ver historial o elegir otra sesión. |
| `/app/fisico/historial` | Ejecuciones propias por fecha/estado y detalle; cero datos si no hay registros. |
| `/app/fisico/progreso` | Sesiones completadas, abandonadas y ejercicios realizados; series sólo para misma métrica, unidad y protocolo. Acceso también desde Progreso con modalidad Física. |
| `/panel/fisico` | Listado de ejercicios y sesiones propios de la organización, estados y versiones; crear borrador según permiso. |
| `/panel/fisico/ejercicios/{id}/versiones/{version_id}` | Autor edita borrador y solicita revisión; revisor físico diferente aprueba/rechaza versión exacta; publicación y archivo auditados. |
| `/panel/fisico/sesiones/{id}/versiones/{version_id}` | Componer bloques con versiones de ejercicios; revisión física del conjunto, publicar y archivar. |

Entrenar incluye modalidad Física y lleva al mismo catálogo, sin duplicar datos.
La demo `/demo/arbitro` conserva su aviso y datos ficticios; nunca escribe como
usuario real. Un prototipo físico eventual estará rotulado y no habilita el módulo.
Sin conexión: informar que el registro no se guardó y permitir reintento al volver;
no mostrar éxito ni contar resultados locales como persistidos.

## 3. Funciones y estados

N-02 cubre creación, versiones, revisión competente, publicación y archivo de
ejercicios y sesiones físicas predefinidas. N-03 cubre ejecución, registro, historial
y agregados propios. Los datos de sesión apuntan a versiones exactas de ejercicios.

Contenido: DRAFT → IN_REVIEW → APPROVED → PUBLISHED → ARCHIVED.
Rechazo: IN_REVIEW → DRAFT con motivo. Editar un contenido aprobado exige nueva
versión y nueva revisión. Publicado no se modifica; tampoco sus referencias.
Autor y revisor son personas diferentes, incluido cuando el actor es administrador.
Una sesión no publica si alguno de sus ejercicios no está publicado o faltan
derechos/instrucciones/protocolo aprobados. Revisor del conjunto no puede ser su
autor. Archivar quita la posibilidad de iniciar, pero conserva ejecuciones previas.
Sesión publicada que referencia un ejercicio archivado no admite nuevas ejecuciones
hasta publicar un reemplazo aprobado. Ejecuciones ya iniciadas conservan su versión.

Ejecución: STARTED → COMPLETED o ABANDONED, ambos terminales. Finalizar exige un
registro explícito por cada bloque (realizado o no realizado); COMPLETED significa
que terminó el registro de la sesión, no que alcanzó una marca ni realizó todo.
La interfaz distingue estado de sesión y ejercicios realizados. Abandonar conserva
registros parciales y no suma una sesión completada. Nueva práctica crea nuevo run.
No se sobrescriben resultados aceptados ni se reabre un run terminal en v1.
Confirmación de cierre muestra datos antes de guardar. Correcciones históricas
requieren un contrato posterior de revisión trazable; no borrado silencioso.

## 4. Datos y validaciones

Reutilizar `physical_exercises`, `physical_exercise_versions`, `training_sessions`,
`training_session_versions`, `training_session_items`, `training_runs` y
`physical_results` de E-02. No crear otro backend físico ni tabla de puntuación global.

Contrato de versión de ejercicio: título, categoría (resistencia, velocidad, fuerza,
movilidad o recuperación), nivel, objetivo, instrucciones, material, advertencias,
referencia de derechos, autor, revisión y protocolo versionado. Media opcional,
privada y emitida vía E-07; ausencia de video se informa sin botón ficticio.
Versión de sesión: autor, objetivo, nivel, estimación de duración y bloques ordenados
con ejercicio_version_id, repeticiones/series/descanso si aplican, definidos por el
especialista. No rellenar cantidades ni tiempos por heurísticas del software.

Un bloque registra como máximo una medición tipada en v1: `metric`, `value`, `unit`,
`protocol_version`; un protocolo que necesita más variables no entra al piloto sin
ampliación contractual y de esquema. Cada versión declara si exige medición y su
pareja métrica/unidad: duración/segundos, distancia/metros o repeticiones/repeticiones.
Valor decimal finito no negativo, precisión máxima 3 decimales; repeticiones enteras.
No hay conversión automática ni límites oficiales inventados. Si completed=false,
metric/value/unit deben ser null. Si completed=true y medición es obligatoria,
los tres campos deben existir. Protocol_version lo obtiene el servidor de la versión
fijada; cualquier valor discrepante del cliente se rechaza. Unidades ajenas al
protocolo, NaN, negativos y texto en campos numéricos se rechazan con 422.

Timestamps UTC del servidor; presentación en zona del usuario. Filtrado por fechas
usa intervalos explícitos [inicio, fin), sin depender de la zona del servidor.
Progreso no mezcla tiempos, distancias o repeticiones ni notas cognitivas. Sesiones
completadas = count de runs COMPLETED propios del intervalo; ejercicios realizados
= count de physical_results.completed=true de esos runs. Un registro parcial de run
STARTED/ABANDONED se ve en detalle, separado del agregado de sesiones completadas.
Sin comparable histórico se muestra Sin datos comparables, no una mejora inventada.

## 5. Permisos y aislamiento

Todos los endpoints requieren JWT E-03, membresía activa y organización autorizada.
Roles/capacidades se leen en DB, nunca de user_metadata ni de controles de la UI.

| Actor | Contenido | Registros personales |
| --- | --- | --- |
| Árbitro | Leer publicado del contexto autorizado | Iniciar, registrar y leer sólo sus runs |
| Autor de contenido autorizado | Crear/editar borrador y solicitar revisión | No accede por ser autor |
| Revisor con can_review_physical=true | Revisar, aprobar, publicar y archivar; nunca versión propia | No accede por ser revisor |
| Revisor técnico sin capacidad física | Sin aprobación/publicación física | Sin acceso ajeno |
| Administrador | Gestionar membresías según E-03; no gana aprobación física por el rol | Sin acceso personal ajeno implícito |
| Ajeno o membresía inactiva | Sin acceso | Sin acceso |

Espacios personales e institucionales siguen separados. La membresía institucional
no comparte resultados personales. No biblioteca global ni referencias cross-tenant;
provisión autorizada a espacio personal requiere copia versionada con origen/derechos.
Una organización PERSONAL sin responsable/revisor competente puede registrar sobre
contenido previamente provisto, pero no autopublicar por defecto.
IDs fuera del alcance responden 404; operación prohibida sobre recurso visible, 403.
JWT ausente/inválido: 401. Sin Auth/API disponible: 503, sin guardado ficticio.

## 6. API propuesta /v1

Organización por `X-Organization-Id`; el servidor valida el contexto. JSON de error
existente `{code, message, request_id}`. UUIDs tipados. Listados con cursor opaco y
limit 1..100 (por defecto 20), orden estable fecha/id y scope aplicado antes del cursor.

| Operación | Entrada y respuesta |
| --- | --- |
| GET /v1/physical-exercises | Filtros categoría/nivel/estado permitido; 200 lista paginada de versiones visibles |
| POST /v1/physical-exercises | Título; 201 identidad y borrador inicial |
| POST /v1/physical-exercises/{id}/versions | Campos de versión; 201 nueva versión |
| PATCH /v1/physical-exercise-versions/{id} | Campos editables + expected_revision; 200 o 409 concurrente/inmutable |
| POST /v1/physical-exercise-versions/{id}/{submit,approve,reject,publish,archive} | expected_revision, motivo si rechaza/archiva; 200 transición y nueva revision |
| GET /v1/training-sessions?kind=PHYSICAL | Filtros nivel/estado permitido; 200 lista paginada |
| GET /v1/training-session-versions/{id} | 200 detalle publicado o visible al panel autorizado |
| POST /v1/training-sessions | title, kind=PHYSICAL; 201 sesión y borrador |
| POST /v1/training-sessions/{id}/versions | Objetivo y bloques con versiones; 201 |
| PATCH /v1/training-session-versions/{id} | Campos/bloques de borrador + expected_revision; 200 o 409 |
| POST /v1/training-session-versions/{id}/{submit,approve,reject,publish,archive} | Mismos controles de revisión; 200 |
| POST /v1/training-runs | session_version_id; 201 run STARTED con versión fijada |
| GET /v1/training-runs | kind=PHYSICAL, fechas/estado; 200 lista propia paginada |
| GET /v1/training-runs/{id} | 200 run propio, bloques y registros persistidos |
| POST /v1/training-runs/{id}/physical-results | session_item_id, completed, medición opcional; 201 registro inmutable |
| POST /v1/training-runs/{id}/{complete,abandon} | Acción terminal explícita; 200 resumen propio |
| GET /v1/physical-progress | Rango de fechas; 200 agregados propios y series compatibles |

Toda mutación usa `Idempotency-Key` no vacía (máximo 128 caracteres); scope por
actor, organización y operación. Mismo payload canónico/key repite respuesta sin
duplicar datos ni auditoría; mismo key y payload distinto: 409. Dos prácticas
legítimas usan keys diferentes. Un resultado por run/item; nueva key sobre item
ya registrado: 409. Body no acepta user_id/organization_id/autor como autoridad.
Revisión optimista evita doble transición; transacción única para negocio y auditoría.
Estas extensiones no modifican contratos cognitivos sin su aceptación propia.

## 7. Auditoría

Eventos propuestos: physical.exercise.version_created/updated, physical.exercise.submitted/
approved/rejected/published/archived; physical.session.version_created/updated,
physical.session.submitted/approved/rejected/published/archived;
physical.run.started/completed/abandoned; physical.result.recorded.
Cada evento: actor, organización, objeto y versión, acción, timestamp, request_id,
estado anterior/nuevo y referencia de aprobación. Auditoría de resultado sólo
referencia run/item/result, sin copiar mediciones personales al log general.
No JWTs, URLs firmadas ni texto sanitario libre. Registro de negocio y evento
se confirman juntos o ambos revierten. Reintento idéntico no emite segundo evento.
Runtime no modifica/elimina auditoría; acceso a eventos respeta E-04.

## 8. Dependencias y preparación

| Entrega | HARD vigentes | Recursos externos / estado |
| --- | --- | --- |
| N-02 | E-02, E-04, E-08 | E-02/E-04 cerradas; E-08 pendiente. Responsable físico, revisor distinto y material/derechos del piloto pendientes |
| N-03 | N-02, E-03, E-13 | E-03 cerrada; N-02/E-13 pendientes. No cuenta externa nueva identificada |

E-08 depende de E-04/E-06/E-07. E-13 depende de E-11 y sus predecesores del grafo.
No iniciar N-02/N-03 ignorando esas dependencias. Si Dirección desea acelerar una
línea física independiente, preparar CHG MAJOR separado con nuevo grafo y validación;
este documento conserva DEPENDENCIES.yaml y aprobaciones históricas.

Antes de READY: aceptar este contrato, cerrar HARD, designar especialista/revisor,
recibir catálogo/protocolos y derechos, revisar OpenAPI exacto y delta SQL con fixtures.
La imagen adjunta no pudo leerse en el workspace: no se afirma haber auditado su
contenido ni se acepta una referencia visual desconocida. Preview propia pendiente.

## 9. Archivos y migración previstos

Backend: `services/api/app/training/{routes,schemas,service,models}.py` y
`services/api/app/analytics/physical.py`; autorización organizations/identity y
audit existente, firma media existente. Registro de rutas en `app/main.py`.
Web: `apps/web/app/app/fisico/` y `apps/web/app/panel/fisico/`, cliente API compartido;
enlaces en Inicio, Entrenar y Progreso. No SQL directo desde Next.js.
Pruebas previstas: `services/api/tests/test_physical_{catalog,runs,postgres}.py`,
`apps/web/tests/physical.spec.ts`, fixtures versionados de training.

E-02 ya creó las tablas. Delta de migración propuesto: campos de descripción/categoría/
nivel/protocolo y dosificación; autor/revision en sesión; aprobación de versión de
sesión con FK tenant y objetivo único; protección published y resultados terminales;
idempotencia para mutaciones que no la tengan. No numerar migración antes de resolver
predecesores E-08/E-13; comparar esquema final para evitar columnas duplicadas.
Constraint run/item único, medición coherente y FK de organización en toda referencia.
No aplicar migración con este documento. Upgrade/downgrade/upgrade en DB efímera;
reversión real exige backup/restore comprobados y conservación de registros, nunca
downgrade destructivo sobre historial de usuarios. Deshabilitar nuevos inicios permite
revertir UI/API mientras se conserva lectura histórica y datos.

## 10. Pruebas verificables de aceptación

Fixture no deportivo: organizaciones A/B, árbitros A1/A2/B1, autor A, revisor físico A
distinto, revisor técnico A, miembro inactivo. Dos sesiones publicadas S1/S2;
S1 con dos bloques: uno de duración/segundos y otro sin medición. Versiones y derechos
ficticios sólo en entorno aislado; nunca publicación como material real del piloto.

| ID | Entrada/acción | Resultado esperado y evidencia |
| --- | --- | --- |
| PF-01 | Autor aprueba su versión | 403, estado igual; API/DB |
| PF-02 | Revisor técnico intenta aprobación física | 403; API/DB |
| PF-03 | Revisor físico distinto aprueba/publica versión exacta | 200, aprobación y eventos correctos; API/DB |
| PF-04 | Publicar sesión con ejercicio borrador o sin derechos | 409, sin publicación; API/DB |
| PF-05 | Editar publicado y luego crear nueva versión | Edición 409; nueva versión conserva anterior; DB |
| PF-06 | Dos transiciones con misma revision | Sólo una prospera, otra 409; prueba concurrente |
| PF-07 | A1 consulta ID de B / A2 consulta run de A1 | 404 y cero filas visibles con runtime; API/DB |
| PF-08 | JWT ausente o miembro inactivo | 401/403 respectivamente; API/browser |
| PF-09 | Institución intenta leer historial personal | 404, sin filtración; API/DB |
| PF-10 | Iniciar S1 con key K dos veces | Mismo run, una creación/un evento; API/DB |
| PF-11 | Reusar K con S2 | 409, no segundo run; API/DB |
| PF-12 | Misma sesión con keys diferentes | Dos prácticas legítimas; API/DB |
| PF-13 | Registrar item de otra sesión/tenant o cognitivo | 404/422 según visibilidad, cero registro; FK/runtime |
| PF-14 | Duración con metros, negativo, NaN, protocolo distinto | 422, cero registro; API/DB |
| PF-15 | Omitido con medición o realizado sin medición requerida | 422; API/DB |
| PF-16 | Duplicar registro mismo key / nuevo key mismo item | Replay idéntico / 409; un resultado/un evento |
| PF-17 | Finalizar S1 sin registrar ambos bloques | 409, run STARTED; API/browser |
| PF-18 | Un bloque realizado y otro no; completar S1 | COMPLETED, 1 de 2 ejercicios; resumen y DB |
| PF-19 | S1 completada, S2 STARTED y un run ABANDONED | Progreso: 1 sesión completada; parciales separados; API/browser |
| PF-20 | Archivar contenido | No nuevos inicios; run histórico conserva versión; API/DB |
| PF-21 | Nueva versión/protocolo/unidad diferente | Series separadas, sin comparación o índice global; API/browser |
| PF-22 | Falla insertar auditoría | Rollback de negocio; DB real |
| PF-23 | Recargar STARTED / cortar red al guardar | Recupera servidor / informa no guardado, reintento sin duplicar; browser |
| PF-24 | Catálogo vacío y cero historial | Estados vacíos, sin ejemplos presentados como reales; browser |
| PF-25 | UI 320/375/390/430/768/1440 px y teclado | Sin overflow ni botones tapados; foco visible, labels, errores anunciados y recorrido completo; capturas/browser |
| PF-26 | Ver demo / espacio real sin datos | Aviso ficticio en demo; no comparte registros ni escribe en API real; browser |
| PF-27 | Usuario modifica user_id/contexto/cursor | Scope del servidor, rechazo o 404 sin acceso ajeno; API/DB |
| PF-28 | Completar/abandonar run terminal y escribir resultado | Reintento de misma operación responde igual; otras mutaciones 409; API/DB |
| PF-29 | Migración upgrade/downgrade/upgrade | Esquema y constraints consistentes en DB efímera; reporte PostgreSQL |
| PF-30 | Catálogo/protocolos piloto y media | Validación humana versionada, derechos documentados y URLs sólo tras autorización |

## 11. Definición de terminado y entrega

Contrato: documentos coherentes, enlaces válidos, grafo intacto y revisión de Dirección.
Estado de PF-01..30 hoy: NOT_RUN, porque todavía no se implementó. La aprobación del
contrato autoriza su alcance; no demuestra funcionalidad ni certifica rutinas.

Implementación: lint, tipos, build, tests unitarios/API, PostgreSQL real con rol runtime,
OpenAPI validado, browser→API→DB→respuesta y PF aplicables PASS. No sustituir DB por
SQLite ni dar por probado persistir con capturas. Evidencia por caso: SHA, fecha,
entorno, fixture, comando, resultado, reporte, revisión del especialista y capturas.
N-02 se cierra por separado antes de N-03; cada cierre requiere aceptación humana del
commit probado. El módulo se activa tras ambos cierres y aprobación de publicación.
Despliegue real de API/DB/media y configuración Auth todavía requiere plan operativo:
el frontend en Vercel por sí solo no prueba este módulo.

Siguiente paso: revisión y aprobación de este contrato; luego resolver HARD y material
con el responsable físico antes de implementar. No cambiar hoy código, datos o Inicio.
