# Arquitectura v2 aprobada — GATE-01 c332262
Stack conservado: Next.js App Router/TypeScript/Tailwind/shadcn/PWA; FastAPI/Pydantic/SQLAlchemy/Alembic; PostgreSQL y Supabase Auth; videos privados. Monolito modular; sin microservicios.
apps/web/app/(publico), (app), (panel) agrupan layouts; rutas explícitas /, /app y /panel. services/api/app conserva módulos Python; packages mantiene contratos/configuración. No mover FastAPI a apps/api ni duplicar lógica Python en paquetes JS.
| Módulo backend | Responsabilidad |
|---|---|
| identity | identidad JWT |
| organizations | organizaciones personales/institucionales y membresías; grupos en etapa 2 |
| rules | ediciones reglamentarias |
| catalog | situaciones/opciones versionadas |
| media | archivos privados, emisión de URLs temporales |
| training | sesiones e instrucciones físicas/cognitivas, ejecución |
| evaluation | rúbricas, motor determinista, revisión histórica |
| analytics | métricas separadas y progreso |
| audit | eventos sensibles |
| assignments / reports | nuevos en etapa 2 |
| subscriptions / appointments | futuros |
| assistant | IA futura supervisada |
Feedback pedagógico referencia intento/situación/autor y se gestiona en training/evaluation; media no decide criterios arbitrales.
FastAPI es vía única de datos de negocio, lectura/escritura. Next.js usa Auth y API, no SQL/Data API para saltarse permisos. Auth/Storage administran datos internos; migraciones autorizadas son operaciones separadas. JWT obligatorio en rutas protegidas; rutas públicas tienen política explícita.
Autorización de actor/organización/operación y grupo cuando exista; roles de negocio en DB, no user_metadata. DB runtime sin superusuario/BYPASSRLS; aislamiento probado, schemas/grants y RLS según ruta real; no confiar en RLS si la conexión la evade.
Bucket privado y firma corta tras autorización. URLs transferibles mientras vigentes; firma emitida no prueba reproducción. No cachear URLs, videos privados o soluciones en SW. Vercel candidato frontend; API/DB/video/monitorización y costos siguen pendientes de decisión antes del despliegue.
Reglas, situación, rúbrica, sesión, ejercicio y algoritmo versionados. Published no se edita; nueva versión y aprobación. Resultados originales se conservan; revisión append-only lógica con controles verificables.
