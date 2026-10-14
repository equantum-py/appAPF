/**
 * Fotografías reales con licencia CC BY 2.0, tomadas del conjunto Open Images
 * (Google) y publicadas originalmente en Flickr por sus autores. Se recortan
 * en pantalla con object-fit. Son decorativas: ninguna muestra las jugadas
 * del ejercicio. Detalle y verificación en docs/design/FOTOGRAFIAS.md.
 */
import type { StaticImageData } from "next/image";
import arbitroTarjeta from "../_fotos/arbitro-tarjeta.jpg";
import arbitrosSorteo from "../_fotos/arbitros-sorteo.jpg";
import asistenteBandera from "../_fotos/asistente-bandera.jpg";
import cabezazoArea from "../_fotos/cabezazo-area.jpg";
import calentamiento from "../_fotos/calentamiento.jpg";
import disputaEntrada from "../_fotos/disputa-entrada.jpg";
import disputaHombro from "../_fotos/disputa-hombro.jpg";

export type Foto = {
  src: StaticImageData;
  alt: string;
  /** Punto de interés para recortar sin cortar la acción. */
  focus: string;
  author: string;
  title: string;
  source: string;
};

export const LICENSE = {
  name: "CC BY 2.0",
  url: "https://creativecommons.org/licenses/by/2.0/",
};

export const fotos = {
  arbitroTarjeta: {
    src: arbitroTarjeta,
    alt: "Árbitro con el brazo en alto mostrando una tarjeta amarilla durante un partido",
    focus: "60% 30%",
    author: "Keng Susumpow",
    title: "England - Paraguay",
    source: "https://www.flickr.com/photos/kengz/164207512",
  },
  arbitrosSorteo: {
    src: arbitrosSorteo,
    alt: "Tres árbitros con los capitanes en el saludo previo a un partido amateur",
    focus: "50% 40%",
    author: "Chicago Fire Rec Soccer",
    title: "IMG_0663",
    source: "https://www.flickr.com/photos/wcwfc/14851288063",
  },
  calentamiento: {
    src: calentamiento,
    alt: "Futbolistas en ronda durante el calentamiento sobre el césped",
    focus: "45% 70%",
    author: "wonker",
    title: "Arsenal Warm Up",
    source: "https://www.flickr.com/photos/wonker/6318101914",
  },
  disputaEntrada: {
    src: disputaEntrada,
    alt: "Dos jugadores universitarios chocan en una disputa por el balón",
    focus: "45% 55%",
    author: "Sandy Chase",
    title: "UNB soccer vs Dal",
    source: "https://www.flickr.com/photos/chasephotography/3947055733",
  },
  disputaHombro: {
    src: disputaHombro,
    alt: "Dos jugadores corren hombro con hombro detrás del balón",
    focus: "55% 55%",
    author: "Andrew Thorne",
    title: "DSC_0092 Bournemouth Electric 3 - 2 Richmond Park Con Club",
    source: "https://www.flickr.com/photos/thornesportsphotography/6792980848",
  },
  cabezazoArea: {
    src: cabezazoArea,
    alt: "Jugador cabecea un centro dentro del área, rodeado de rivales",
    focus: "70% 35%",
    author: "Simon Fraser University - University Communications",
    title: "SFU Men's Soccer vs Northwest Nazarene",
    source: "https://www.flickr.com/photos/sfupamr/7990909012",
  },
  asistenteBandera: {
    src: asistenteBandera,
    alt: "Árbitro detrás de una disputa, con la bandera del asistente en primer plano",
    focus: "45% 45%",
    author: "James Boyes",
    title: "Lewes v Met Police 25 Oct 2014 850",
    source: "https://www.flickr.com/photos/jamesboyes/15441483287",
  },
} satisfies Record<string, Foto>;
