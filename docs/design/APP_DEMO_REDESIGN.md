# Demo con entrada de aplicación

Solicitud de Derlis, 2026-10-13: la portada se siente como una página de presentación; necesita una experiencia de app para probar.

Cambio limitado a la demo visual: `/` y `/demo` abren `/demo/arbitro`. Inicio con entrenamiento, progreso ilustrativo y revisión; barra persistente de cuatro destinos; biblioteca con búsqueda, filtros y estado vacío; cambio de perfil a instructor desde el encabezado. Se conserva el aviso de datos ficticios, las ilustraciones rotuladas y la confirmación previa al resultado.

Entorno de validación: Next.js 16.4.0, build de producción local y Chromium headless. Comandos: `npm run lint`, `npm run typecheck`, `npm run build`, smoke de navegador sobre `next start --hostname 127.0.0.1`.

Resultados: PASS en redirección inicial, decisión → confirmación → resultado → siguiente jugada, búsqueda/filtro/estado vacío, cambio a instructor y anotación local. Sin errores de ejecución ni desbordamiento horizontal en 320, 393, 768 y 1440 px. Revisión React: componentes de servidor por defecto, estado solo en búsqueda y filtros, controles nativos etiquetados, selección `aria-pressed`, resultados `aria-live`, navegación `aria-current`.

No acredita integración browser → API → PostgreSQL ni cierra E-06 o entregas posteriores. Backend y evidencia histórica no se modifican. Publicación autorizada: preview visual privada; no promoción de producción. La aprobación visual sigue pendiente de Derlis.
