# Portada premium — entrega de revisión

Base: `f161228`. Rama `codex/inicio-premium-referencia`. Control `CHG-011`.
Referencia: imagen y documento suministrados por Derlis, 2026-10-14.
Producción permanece en main: el documento pide aprobación final antes de publicar.

## Implementación

Inicio tiene hero fotográfico con logo y perfil integrados, título en dos colores,
subtítulo y Comenzar entrenamiento. Dos tarjetas en una fila, Jugadas y Reglas del
juego, módulo físico deshabilitado con candado y Próximamente, cuatro pestañas,
activo azul e indicador. Se conservan textos y rutas del proyecto existente.
No se incorpora el marco del teléfono ni se usa una captura completa como fondo.

Archivos de UI: `_ui/inicio.tsx`, `_ui/tab-header.tsx`, `_ui/bottom-nav.tsx`,
`_ui/icons.tsx`, `app/globals.css`. Imágenes: `arbitro/_premium/`.
Los cambios de estilo y de icono de Entrenar se aplican sólo mientras Inicio está
visible; otras pantallas, bienvenida, login, API y datos se conservan.

Los cuatro recursos adjuntos coinciden byte por byte con el ZIP. SHA-256 y procedencia
en [recursos.json](premium-review/recursos.json). No se descargaron recursos externos
ni se atribuyó una licencia CC BY a estos archivos. Son los recursos entregados por
Dirección para reproducir su diseño; no se presentan como videos o evidencia de jugadas.
El PNG original se conserva; CSS adapta su tinta oscura a blanca sobre el hero,
manteniendo azul, transparencia y forma de la marca.

## Evidencia y verificación

Capturas reales de build local: [375 px](premium-review/375-inicio.jpg),
[390 px](premium-review/390-inicio.jpg), [393 px](premium-review/393-inicio.jpg),
[430 px](premium-review/430-inicio.jpg).
Comparación a misma escala: [Referencia / implementación](premium-review/comparacion-390.jpg).
Se recorta sólo el marco externo de la referencia para comparar la interfaz.
Reporte de navegador: [JUnit](premium-review/browser.xml).

| Comprobación | Resultado |
| --- | --- |
| Lint | PASS |
| Build y TypeScript | PASS |
| Pruebas de navegador | PASS: 13 pruebas, 0 fallos en ejecución final |
| Hero, recursos cargados y tarjetas en dos columnas | Verificados en 375/390/393/430 px |
| Preparación física | Sin interacción, etiqueta y candado visibles |
| Navegación y CTA | Rutas existentes, sin entrenamiento nuevo |
| Vertical y barra fija | El contenido puede desplazarse y alcanzarse sin quedar bajo la barra al llegar al final |
| Datos ficticios | Aviso de demo conservado |
| Validación documental | PASS |

Entorno local: Node 24.19.0, Next 16.4.0, Playwright del lockfile y Chromium 134,
con variables ficticias de CI; no hay secretos ni cuentas reales en la evidencia.
Una repetición previa tuvo fallo de foco en resultado a 1440 px; se conservó la
aserción y el componente sin cambios. La siguiente ejecución la superó. El JUnit
final y el CI de la PR permiten comprobar las regresiones sobre esta versión.

## Diferencias y límites declarados

- Referencia: barra de sistema iOS y home indicator dentro del teléfono. Implementación:
  interfaz web, sin dibujar controles falsos del sistema y con aviso de demo requerido.
- Inter y SVG reutilizados reproducen el aspecto visual; no se afirma conocer la fuente
  original ni igualdad exacta de píxeles de sus iconos desde una imagen raster.
- Imágenes adjuntas usadas sin alterar sus píxeles; CSS ajusta recorte, oscurecimiento y
  encuadre por tamaño. La composición y el uso de los recursos están visibles en comparación.
- La referencia no muestra el aviso de demo. Se conserva porque el documento exige no quitarlo.
- El repositorio no dispone de manifest ni service worker. Esta entrega visual respeta áreas
  seguras y diseño responsive, pero no añade una PWA instalable ni declara instalación/offline
  verificados. Esa condición requiere una entrega funcional aparte.

Preview del proyecto app-apf existente. No se integra a main ni se publica producción
hasta la aprobación correspondiente. No cierra E-06 ni cambia contratos E-*.
