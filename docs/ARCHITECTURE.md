# Arquitectura aprobada en GATE-00 — commit b6117d1
Monolito modular FastAPI; frontend Next.js App Router, TypeScript, Tailwind, shadcn/ui y PWA. PostgreSQL; Supabase Auth para identidad. SQLAlchemy y Alembic. No microservicios.
Estructura: apps/web; services/api/app/{identity,organizations,rules,catalog,media,training,evaluation,analytics,assistant,audit,shared}; services/api/migrations y tests; packages/contracts y config; docs/{architecture,deliveries,evidence,business,security}; infra; .github.

## Límites
identity valida identidad; organizations resuelve membresía y organización; rules mantiene ediciones; catalog versiona situaciones; media autoriza videos; training registra intentos; evaluation calcula resultados; analytics agrega datos autorizados; audit registra acciones. Cada módulo publica servicios; otros módulos no escriben sus tablas internas. assistant queda sin implementar en MVP.
Supabase Auth no decide permisos de negocio. FastAPI verifica firma, issuer, audience, expiración y membresía activa. La organización enviada por cliente se valida; nunca es una autorización. RLS se diseña en E-02/E-03 según rutas reales de acceso, sin prometer protección automática con conexiones privilegiadas.

## Contratos previstos
/v1 con OpenAPI como fuente de contratos. Errores: code, message y request_id; sin secretos. Paginación explícita y fechas UTC. La biblioteca previa al intento no expone respuestas, rúbricas de corrección ni criterios reveladores. Envío transaccional con clave de idempotencia acotada por actor y organización: mismo payload devuelve resultado original; distinto payload devuelve 409. Versiones publicadas inalterables por API; revisión crea registro adicional sin sobrescribir evaluación original.
Contenido: DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED, con permisos y aprobación humana. Se impide aprobación propia del autor en el piloto.

## Operación pendiente
Frontend: Vercel como candidato, no recurso creado. Hosting FastAPI: proveedor pendiente de decisión; no asumir que equivale al hosting Next.js. PostgreSQL y Auth: proyecto de prueba separado pendiente. Videos: almacenamiento privado con URLs temporales, proveedor pendiente. Sentry y retención de logs pendientes de presupuesto y privacidad.
Antes de E-00 validar versiones soportadas en documentación oficial, fijar lockfiles y registrar matriz de compatibilidad. La base de versiones fue verificada en E-00; consultar architecture/VERSIONS.md y evidence/E-00/ci.json. Las nuevas integraciones requieren verificación en su propia entrega.
Antes del piloto: despliegues separados, secretos fuera del repo, límites de solicitudes, monitoreo, respaldo y prueba de restauración.
