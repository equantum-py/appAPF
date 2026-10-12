/**
 * Datos ficticios de la demo. No representan criterio técnico oficial
 * ni personas reales; existen solo para mostrar la experiencia.
 */

export type Decision = "sigue" | "tli" | "tld" | "penal";
export type Sanction = "ninguna" | "amarilla" | "roja";
export type Confidence = "baja" | "media" | "alta";

export type Situation = {
  id: string;
  title: string;
  rule: string;
  difficulty: "baja" | "media" | "alta";
  duration: string;
  decision: Decision;
  sanction: Sanction;
  explanation: string;
};

export const decisions: { id: Decision; label: string }[] = [
  { id: "sigue", label: "Sigue el juego" },
  { id: "tli", label: "Tiro libre indirecto" },
  { id: "tld", label: "Tiro libre directo" },
  { id: "penal", label: "Penal" },
];

export const sanctions: { id: Sanction; label: string; card: string }[] = [
  { id: "ninguna", label: "Ninguna", card: "bg-white border border-[#b9c4bc]" },
  { id: "amarilla", label: "Amarilla", card: "bg-[var(--color-card-yellow)]" },
  { id: "roja", label: "Roja", card: "bg-[var(--color-card-red)]" },
];

export const confidences: { id: Confidence; label: string }[] = [
  { id: "baja", label: "Baja" },
  { id: "media", label: "Media" },
  { id: "alta", label: "Alta" },
];

export const situations: Situation[] = [
  {
    id: "entrada-mediocampo",
    title: "Entrada desde atrás en mediocampo",
    rule: "Faltas",
    difficulty: "media",
    duration: "0:12",
    decision: "tld",
    sanction: "amarilla",
    explanation:
      "El defensor impacta por detrás sin posibilidad real de jugar el balón y de manera temeraria: tiro libre directo y amonestación.",
  },
  {
    id: "disputa-area",
    title: "Disputa hombro con hombro en el área",
    rule: "Faltas",
    difficulty: "alta",
    duration: "0:09",
    decision: "sigue",
    sanction: "ninguna",
    explanation:
      "Contacto hombro con hombro, con el balón a distancia de juego y sin fuerza desmedida: es una disputa legal y el juego continúa.",
  },
  {
    id: "brazo-defensor",
    title: "Balón en el brazo del defensor",
    rule: "Mano",
    difficulty: "alta",
    duration: "0:07",
    decision: "sigue",
    sanction: "ninguna",
    explanation: "El brazo está pegado al cuerpo y no amplía su silueta de forma antinatural: no hay infracción.",
  },
  {
    id: "pase-profundidad",
    title: "Pase en profundidad al delantero",
    rule: "Fuera de juego",
    difficulty: "baja",
    duration: "0:10",
    decision: "tli",
    sanction: "ninguna",
    explanation:
      "Al momento del pase el atacante está más adelantado que el penúltimo defensor e interviene en la jugada: tiro libre indirecto.",
  },
];

export function labelOf<T extends string>(list: { id: T; label: string }[], id: T | null) {
  return list.find((x) => x.id === id)?.label ?? "—";
}

/** Puntaje ilustrativo: 60 por la decisión, 30 por la sanción y hasta 10 por la seguridad si todo es correcto. */
export function scoreFor(s: Situation, d: Decision | null, sa: Sanction | null, c: Confidence) {
  const dOk = d === s.decision;
  const sOk = sa === s.sanction;
  const bonus = dOk && sOk ? { alta: 10, media: 6, baja: 3 }[c] : 0;
  return (dOk ? 60 : 0) + (sOk ? 30 : 0) + bonus;
}

export const progressByRule = [
  { rule: "Faltas", ok: 7, total: 9 },
  { rule: "Mano", ok: 3, total: 5 },
  { rule: "Fuera de juego", ok: 3, total: 4 },
];

export const history = [
  { title: "Entrada desde atrás en mediocampo", when: "Hoy", score: 96 },
  { title: "Pase en profundidad al delantero", when: "Ayer", score: 60 },
  { title: "Disputa hombro con hombro en el área", when: "Lunes", score: 90 },
];

export const annotations = [
  {
    time: "0:03",
    position: 25,
    kind: "A mejorar",
    tone: "red",
    title: "Quedaste detrás de la jugada",
    text: "En el contraataque estabas a más de 30 m. Desplazate en diagonal para ver el contacto con ángulo abierto.",
  },
  {
    time: "0:06",
    position: 50,
    kind: "Clave",
    tone: "yellow",
    title: "El contacto empieza acá",
    text: "El defensor llega tarde y por detrás. Ese es el momento que define la infracción.",
  },
  {
    time: "0:09",
    position: 75,
    kind: "Bien",
    tone: "green",
    title: "Buena lectura de la ventaja",
    text: "Esperaste a ver si el ataque continuaba antes de pitar. El ataque se cortó y la sanción corresponde.",
  },
] as const;

export const groups = [
  { name: "Grupo Primera", done: 20, total: 22 },
  { name: "Grupo Ascenso", done: 12, total: 20 },
  { name: "Grupo Formativas", done: 24, total: 31 },
];

export const reviewQueue = [
  { id: "r1", title: "Entrada desde atrás en mediocampo", who: "Árbitro Demo · Primera", answer: "Tiro libre directo + amarilla", correct: true },
  { id: "r2", title: "Balón en el brazo del defensor", who: "Compañero B · Ascenso", answer: "Penal", correct: false },
  { id: "r3", title: "Pase en profundidad al delantero", who: "Compañero A · Primera", answer: "Sigue el juego", correct: false },
];

export type AuditType = "Publicación" | "Acceso a video" | "Revisión" | "Membresía";

export const auditEvents: { when: string; who: string; type: AuditType; detail: string }[] = [
  { when: "12/10 09:42", who: "Revisor Demo", type: "Publicación", detail: "Aprobó y publicó “Entrada desde atrás en mediocampo” v2" },
  { when: "12/10 09:10", who: "Árbitro Demo", type: "Acceso a video", detail: "Abrió “Entrada desde atrás en mediocampo” con enlace temporal" },
  { when: "11/10 18:03", who: "Instructor Demo", type: "Revisión", detail: "Revisó la evaluación de Compañero B con motivo registrado" },
  { when: "11/10 16:40", who: "Administrador Demo", type: "Membresía", detail: "Agregó a Compañero D al Grupo Ascenso" },
  { when: "11/10 11:22", who: "Instructor Demo", type: "Publicación", detail: "Envió “Pase en profundidad al delantero” a revisión" },
];
