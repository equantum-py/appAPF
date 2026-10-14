# Entrada e Inicio — propuesta aprobada e implementación

Dirección aprobada por Derlis: «Apruebo esta propuesta», 2026-10-14.
Base `4288b65`; control de cambio `CHG-009`. La aprobación del boceto autoriza la
implementación y su publicación en main/Vercel. No implica cerrar la entrega E-06.

## Correspondencia con el boceto

Entrada: azul oscuro, silbato propio, título y frase; Comenzar abre la demo y Ya tengo
cuenta abre ingreso real. Inicio: cuatro bandas fotográficas, títulos normales y livianos,
Decisiones de juego / Preparación física / Reglas del juego / Tus resultados.
Se usan fotografías reales locales preexistentes con créditos; las imágenes del boceto
son ilustrativas y no forman parte de la app. La capa celeste se oscurece en la parte
del texto para mantener lectura de letras blancas. Desde 1024 px hay menú lateral y
dos columnas en Inicio. Las fotos no representan los ejercicios escritos.

## Evidencia local

Entorno: Node 24.19.0, Next 16.4.0, Playwright del lockfile, Chromium 134 (build 1161).
El navegador actual no se pudo descargar en este entorno; se usó el ejecutable local
compatible, sin modificar dependencias del repositorio. No se instala nada en el equipo
personal del usuario. Se probó un build de producción con variables ficticias de CI,
sin credenciales reales ni conexión de la demo al backend.

| Verificación | Resultado |
| --- | --- |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| Playwright `apps/web/tests/demo.spec.ts` | PASS — 9 pruebas, 0 fallos |
| Navegación en 320, 390, 768, 1440 px | PASS |
| Comparación decisión/sanción/regla, foco y salida con descarte | PASS |
| Práctica del mismo tema y ausencia de relacionada | PASS |
| Inicio: rutas de decisiones, reglas, resultados y créditos | PASS |
| Fotos cargadas y Preparación física sin botón activo | PASS |
| 28 revisiones de rutas/tamaños, consola y ancho horizontal | PASS — sin errores de página ni desbordamiento |
| `python docs/evidence/validate_planning.py` | PASS |

Se revisaron capturas de bienvenida e Inicio en móvil y escritorio y del resultado en móvil.
Las nueve pruebas incluyen cuatro recorridos Entrada/Inicio y cinco regresiones de práctica.
Reporte JUnit: [demo-browser.xml](entrada-inicio/demo-browser.xml).
Capturas de revisión archivadas: [Entrada móvil](entrada-inicio/390-entrada.jpg),
[Inicio móvil](entrada-inicio/390-inicio.jpg), [Entrada escritorio](entrada-inicio/1440-entrada.jpg),
[Inicio escritorio](entrada-inicio/1440-inicio.jpg). Las capturas corresponden al build local,
no se presentan como capturas del despliegue remoto.

## Límites de la verificación

Las pruebas locales son de la demostración. No se ejecutó aquí el flujo completo
Auth/API/PostgreSQL; lo cubre el CI existente. Producción debe comprobarse por SHA,
proyecto app-apf y asociación a app-apf.vercel.app después del push. No se declara
verificación visual remota si la protección impide abrir el despliegue.
Preparación física sigue pendiente; datos de progreso siguen ficticios y sin guardado.
Licencias y limitación de comprobación original: FOTOGRAFIAS.md. No hay cierre de E-06.
