/**
 * Datos ficticios de la app del árbitro que completan `_data.ts`: regla,
 * qué mejorar y práctica relacionada. No son criterio técnico oficial.
 */
import {
  situations,
  type Decision,
  type Sanction,
  type Situation,
} from "../../_data";
import type { SceneKind } from "./scene";

export const topics = ["Para vos", "Faltas", "Mano", "Fuera de juego"] as const;
export type Topic = (typeof topics)[number];

export const lawChoices = [
  { id: "11", short: "Regla 11", title: "Regla 11 · Fuera de juego" },
  {
    id: "12",
    short: "Regla 12",
    title: "Regla 12 · Faltas y conducta incorrecta",
  },
  { id: "13", short: "Regla 13", title: "Regla 13 · Tiros libres" },
] as const;
export type LawId = (typeof lawChoices)[number]["id"];
export const isLaw = (value: unknown): value is LawId =>
  lawChoices.some((law) => law.id === value);
export const lawById = (id: LawId) => lawChoices.find((law) => law.id === id)!;

const extras: Record<string, { scene: SceneKind; improve: string }> = {
  "entrada-mediocampo": {
    scene: "entrada",
    improve:
      "Fijate en la dirección y el momento del contacto. Si llega por detrás y sin opción real de jugar el balón, pensá primero en una entrada temeraria.",
  },
  "disputa-area": {
    scene: "area",
    improve:
      "Separá contacto de falta. Hombro con hombro, con el balón a distancia de juego y sin fuerza desmedida, es una disputa legal.",
  },
  "brazo-defensor": {
    scene: "mano",
    improve:
      "Mirá la posición del brazo antes del contacto, no después. Si está pegado al cuerpo, no amplía la silueta.",
  },
  "pase-profundidad": {
    scene: "fuera",
    improve:
      "Congelá la imagen en el momento del pase y compará con el penúltimo defensor. Recién después decidí si interviene en el juego.",
  },
};

export const sceneOf = (s: Situation) => extras[s.id].scene;
export const lawOf = (s: Situation) =>
  lawById(s.rule === "Fuera de juego" ? "11" : "12");
export const improveOf = (s: Situation) => extras[s.id].improve;
export const relatedOf = (s: Situation) =>
  situations.find((x) => x.id !== s.id && x.rule === s.rule);
export const byId = (id: string) => situations.find((s) => s.id === id);
export const byTopic = (t: Topic) =>
  t === "Para vos" ? situations : situations.filter((s) => s.rule === t);

/** Lo que quedó para corregir de prácticas anteriores. */
export const toImprove = [
  {
    title: "Temeraria o con fuerza excesiva",
    id: "entrada-mediocampo",
    when: "De tu práctica de hoy",
  },
  {
    title: "Brazo pegado o silueta ampliada",
    id: "brazo-defensor",
    when: "De tu práctica del lunes",
  },
  {
    title: "Cuándo interviene en el juego",
    id: "pase-profundidad",
    when: "De tu práctica de ayer",
  },
];

/** Respuestas ficticias ya enviadas, para mostrar resultados y progreso. */
export const pastAnswers: {
  id: string;
  when: string;
  d: Decision;
  s: Sanction;
  l: LawId;
}[] = [
  { id: "pase-profundidad", when: "Ayer", d: "sigue", s: "ninguna", l: "12" },
  { id: "entrada-mediocampo", when: "Hoy", d: "tld", s: "amarilla", l: "12" },
  { id: "disputa-area", when: "Lunes", d: "sigue", s: "ninguna", l: "12" },
];

export const resultHref = (id: string, d: Decision, s: Sanction, l: LawId) =>
  `/demo/arbitro/jugada/${id}/resultado?d=${d}&s=${s}&l=${l}`;
