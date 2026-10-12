# Modelo conceptual etapa 1 — E-02
Decisiones propuestas, no esquema ejecutado.
## Propiedad
users tiene UUID interno y supabase_subject único, sin FK a auth.users de proveedor externo. No replica contraseñas. organizations.kind PERSONAL/INSTITUTIONAL; PERSONAL tiene owner_user_id obligatorio y un propietario, sin capacidades de federación por defecto. memberships une usuario/organización con rol/capacidades y active; UNIQUE organization_id,user_id. Cambiar contexto no cambia propiedad histórica.
Cada usuario individual recibe espacio personal por operación autorizada del servidor; unirse a institución agrega membresía. Datos personales no son visibles a instructores institucionales por esa membresía. Etapa 2 compartirá solo cumplimiento/resultados de asignaciones institucionales; cualquier compartición personal adicional exige contrato y autorización explícitos.
Contenido es de una organización. Etapa 1 no permite joins entre instituciones ni biblioteca global implícita. Provisión de contenido autorizado para espacio personal se registra como copia/versionada con origen y derechos; no referencia cruzada que exponga tablas del propietario. Sin provisión válida, biblioteca vacía; no inventar demo real.
## Entidades originales conservadas
organizations, users, memberships, rulebook_editions, situations, situation_versions, situation_options, video_assets, rubrics, rubric_versions, rubric_criteria, attempts, evaluations, evaluation_reviews, approvals, audit_log.
Corrección de inventario: el prompt enumera 16 entidades (no asumir un conteo diferente).
## Entidades nuevas etapa 1
physical_exercises, physical_exercise_versions; training_sessions, training_session_versions, training_session_items; training_runs; physical_results.
Sesión tipo COGNITIVE_DECISION o PHYSICAL en etapa 1. COMBINED solo cuando N-09 tenga contrato y validación. Un item referencia exactamente una situation_version o physical_exercise_version, consistente con modalidad, y tiene posición única dentro de sesión.
training_runs fija usuario/organización/session_version y estado. attempts conserva el intento cognitivo y puede vincularse a run/item; evaluations mantiene edición/regla/rúbrica/algoritmo. physical_results pertenece a run/item físico; contiene completion y mediciones autodeclaradas tipadas/unidad/protocolo, sin reutilizar score arbitral.
Contenido con DRAFT, IN_REVIEW, APPROVED, PUBLISHED, ARCHIVED. approvals referencia versión concreta de situación o ejercicio mediante FKs y restricción de objetivo único; sin target_id sin integridad. Revisor competente diferente del autor. Cambio de versión exige nueva aprobación.
## Restricciones
UUID PK, timestamps UTC; FKs compuestas organization_id + identificador para impedir referencias cruzadas; unique organization/version_number, posición e idempotency scope; CHECK pesos/valores/duración no negativos y modalidad válida. Restricciones exactas se documentan por tabla antes de migrar, sin imponer mínimos físicos oficiales.
Índices para FKs y filtros actor/organización/estado/fecha con consulta objetivo documentada; no añadir indiscriminadamente. audit_log sin secretos, rol runtime no modifica/elimina registros; no declarar inmutabilidad absoluta. Roles runtime/migrator separados.
Deferir groups, assignments, tests compuestos, feedback avanzado, subscriptions, appointments y honorarios a su entrega. No crear tablas vacías por cada idea futura. E-02 cubre relaciones/constraints originales y nuevas de etapa 1; implementación funcional de cada módulo sigue en sus entregas.
## Evidencia exigida
PostgreSQL real aislado; upgrade/downgrade/upgrade; constraint negativa cross-tenant, versionado y asociaciones; introspección/metadata; prueba con rol runtime sin privilegios; cero acceso a producción. No sustituir PostgreSQL por SQLite como evidencia equivalente.
