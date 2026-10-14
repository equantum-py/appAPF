# Fotografías de la app del árbitro

Fecha: 2026-10-14. Uso: decorativo y de referencia en la demo (Inicio, Entrenar, jugada, resultado, Progreso).
Ninguna foto muestra las jugadas de los ejercicios: la app lo indica con «Foto de referencia» y, en la jugada,
«Ejercicio de demostración · sin video real».

## Origen y licencia

Todas provienen del conjunto público **Open Images** de Google (metadatos `2018_04/image_ids_and_rotation.csv`),
que reúne fotos publicadas en Flickr por sus autores bajo **Creative Commons Attribution 2.0**
(https://creativecommons.org/licenses/by/2.0/). Se descargaron del espejo oficial del conjunto
(`s3.amazonaws.com/open-images-dataset`, versión reducida a 1024 px), se recomprimieron sin metadatos EXIF
y se recortan en pantalla con `object-fit`/`object-position` (cambio: recorte y compresión).

La licencia se tomó de los metadatos de Open Images. Flickr no era accesible desde el entorno de trabajo,
así que no se volvió a confirmar en cada página de origen; conviene revisarlo antes de un uso fuera de la demo.

| Archivo | Uso | Título original | Autor | Fuente |
| --- | --- | --- | --- | --- |
| `arbitro-tarjeta.jpg` | Archivo de referencia de la bienvenida anterior | England - Paraguay | Keng Susumpow | https://www.flickr.com/photos/kengz/164207512 |
| `arbitros-sorteo.jpg` | Entrenar · entrenamiento arbitral | IMG_0663 | Chicago Fire Rec Soccer | https://www.flickr.com/photos/wcwfc/14851288063 |
| `calentamiento.jpg` | Entrenar · preparación física (próximamente) | Arsenal Warm Up | wonker | https://www.flickr.com/photos/wonker/6318101914 |
| `disputa-entrada.jpg` | Referencia de «Entrada desde atrás en mediocampo» | UNB soccer vs Dal | Sandy Chase | https://www.flickr.com/photos/chasephotography/3947055733 |
| `disputa-hombro.jpg` | Referencia de «Disputa hombro con hombro en el área» | DSC_0092 Bournemouth Electric 3 - 2 Richmond Park Con Club | Andrew Thorne | https://www.flickr.com/photos/thornesportsphotography/6792980848 |
| `cabezazo-area.jpg` | Referencia de «Balón en el brazo del defensor» | SFU Men's Soccer vs Northwest Nazarene | Simon Fraser University - University Communications | https://www.flickr.com/photos/sfupamr/7990909012 |
| `asistente-bandera.jpg` | Referencia de «Pase en profundidad al delantero» | Lewes v Met Police 25 Oct 2014 850 | James Boyes | https://www.flickr.com/photos/jamesboyes/15441483287 |

Desde CHG-009, la bienvenida no tiene fotografía; Inicio ofrece acceso directo a los créditos.
Atribución visible: autor en cada jugada y lista completa en **Yo › Créditos de fotografías**.
Archivos en `apps/web/app/demo/arbitro/_fotos/`; Next.js genera versiones AVIF/WebP por tamaño.

## Criterios

- Árbitros, cancha y situaciones de fútbol; sin imágenes generadas con IA, capturas de transmisiones ni redes sociales.
- Sin logos oficiales de la APF ni afirmaciones de respaldo.
- Una foto no reemplaza un video: si no hay clip autorizado, la jugada se presenta como ejercicio escrito.
