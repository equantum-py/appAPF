# Demo con entrada de aplicación

Solicitud de Derlis, 2026-10-13: la portada se siente como una página de presentación; necesita una experiencia de app para probar.

Cambio limitado a la demo visual: `/` y `/demo` abren `/demo/arbitro`. Inicio con entrenamiento, progreso ilustrativo y revisión; barra persistente de cuatro destinos; biblioteca con búsqueda, filtros y estado vacío; cambio de perfil a instructor desde el encabezado. Se conserva el aviso de datos ficticios, las ilustraciones rotuladas y la confirmación previa al resultado.

Entorno de validación: Next.js 16.4.0, build de producción local y Chromium headless. Comandos: `npm run lint`, `npm run typecheck`, `npm run build`, smoke de navegador sobre `next start --hostname 127.0.0.1`.

Resultados: PASS en redirección inicial, decisión → confirmación → resultado → siguiente jugada, búsqueda/filtro/estado vacío, cambio a instructor y anotación local. Sin errores de ejecución ni desbordamiento horizontal en 320, 393, 768 y 1440 px. Revisión React: componentes de servidor por defecto, estado solo en búsqueda y filtros, controles nativos etiquetados, selección `aria-pressed`, resultados `aria-live`, navegación `aria-current`.

No acredita integración browser → API → PostgreSQL ni cierra E-06 o entregas posteriores. Backend y evidencia histórica no se modifican. Publicación autorizada: preview visual privada; no promoción de producción. La aprobación visual sigue pendiente de Derlis.

## Versión vigente — 2026-10-14

La descripción anterior conserva el primer rediseño de la demo y sus verificaciones históricas. Queda sustituida para el comportamiento vigente por el diseño de Claude del commit f3e7498: blanco y negro, Barlow Condensed para títulos e Inter para texto, navegación Inicio/Entrenar/Progreso/Yo y jugada a pantalla completa. `/` conserva la portada de main; la demo solo redirige desde `/demo`.

Derlis solicitó: «arregla lo que falta y aplica el diseño que hizo claude». Se conserva el diseño y se corrigen selección explícita de regla y comparación del fundamento, práctica del mismo tema (o repetición explícita cuando falta otra), confirmación al descartar selecciones y foco en el resultado. No hay cronómetro ni puntaje en este recorrido. No se afirma que una respuesta ficticia sea persistente o inmutable.

Regresión: `apps/web/tests/demo.spec.ts`, cinco pruebas Chromium a 320/390/768/1440 px, incluyendo elección obligatoria, respuesta correcta y regla incorrecta, preservación al cancelar salida, descarte, tema sin alternativa, entradas inválidas y raíz sin redirección. Resultado local: 5 PASS, 0 FAIL. Lint, tipos y build PASS. API/DB: N/A para la demo; la regresión de autenticación y backend existente continúa en CI.

E-06 y las entregas posteriores conservan su estado; esta mejora visual no las completa ni acepta una rúbrica real. Capturas antiguas de esta carpeta son históricas. Las actuales están en `actual-mobile-result.png` y `actual-desktop-home.png`.
