# Inicio simple — implementación aprobada

Base `42efd34`, CHG-010, aprobación de Derlis: «aprobado», 2026-10-14.

Una fotografía real de árbitros, pregunta breve y tres accesos. Jugadas abre
Entrenar; Reglas del juego abre sus temas; Preparación física permanece
Próximamente y sin interacción. Progreso queda en la barra; perfil y créditos
se abren desde el encabezado y el pie de foto. No se incorpora la foto generada
del boceto: se reutiliza `arbitros-sorteo.jpg`, con créditos existentes.

## Verificación del build local

| Comprobación | Resultado |
| --- | --- |
| `npm run lint` | PASS |
| `npm run build`, incluido TypeScript | PASS |
| Playwright `apps/web/tests/demo.spec.ts` | PASS: 9 pruebas |
| Inicio a 320, 390, 768 y 1440 px | PASS |
| Foto cargada, accesos y perfil/créditos | PASS |
| Tercer acceso sin quedar tapado por la barra en móvil | PASS |
| Comparación decisión/sanción/regla, foco, descarte y relacionada | PASS |
| Errores de página y desbordamiento horizontal | Ninguno en las capturas revisadas |
| `python docs/evidence/validate_planning.py` | PASS |

Entorno Node 24.19.0 / Next 16.4.0 / Chromium 134 (build 1161).
Build con variables ficticias de CI. No hay credenciales reales en la evidencia.
Configuración de navegador local con ejecutable compatible; no cambia el lockfile.
Reporte: [demo-browser.xml](inicio-simple/demo-browser.xml).
Capturas del build local: [320](inicio-simple/320-inicio.jpg),
[390](inicio-simple/390-inicio.jpg), [768](inicio-simple/768-inicio.jpg),
[1440](inicio-simple/1440-inicio.jpg).

Se conserva bienvenida e ingreso y el backend aprobado. El CI existente valida
Auth/API/PostgreSQL. La publicación se verifica por SHA y dominio luego del push;
estas capturas no se presentan como evidencia visual remota. Demo sin guardado,
preparación física pendiente, licencias documentadas en FOTOGRAFIAS.md. No cierra E-06.
