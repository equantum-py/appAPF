"use client";

import Link from "next/link";
import { useState } from "react";
import { situations } from "../../_data";
import { Icon } from "./icons";
import { Scene, type SceneKind } from "./scene";

const topics = ["Para vos", "Faltas", "Mano", "Fuera de juego"] as const;
type Topic = (typeof topics)[number];

const sceneOf: Record<string, SceneKind> = {
  "entrada-mediocampo": "entrada",
  "disputa-area": "area",
  "brazo-defensor": "mano",
  "pase-profundidad": "fuera",
};

const lawOf: Record<string, string> = { Faltas: "Regla 12", Mano: "Regla 12", "Fuera de juego": "Regla 11" };

/** Lo que quedó para corregir de prácticas anteriores (datos ficticios). */
const toImprove = [
  { title: "Temeraria o con fuerza excesiva", rule: "Faltas", from: "entrada-mediocampo", when: "De tu práctica de hoy" },
  { title: "Brazo pegado o silueta ampliada", rule: "Mano", from: "brazo-defensor", when: "De tu práctica del lunes" },
  { title: "Cuándo interviene en el juego", rule: "Fuera de juego", from: "pase-profundidad", when: "De tu práctica de ayer" },
];

const lastResult = situations[3];

export function Inicio() {
  const [topic, setTopic] = useState<Topic>("Para vos");
  const next = topic === "Para vos" ? situations[0] : (situations.find((s) => s.rule === topic) ?? situations[0]);
  const count = topic === "Para vos" ? situations.length : situations.filter((s) => s.rule === topic).length;
  const list = topic === "Para vos" ? toImprove : toImprove.filter((t) => t.rule === topic);

  return (
    <>
      <div className="rf-chips" role="group" aria-label="Tema de práctica">
        {topics.map((t) => (
          <button key={t} type="button" className="rf-chip" aria-pressed={t === topic} onClick={() => setTopic(t)}>
            {t === topic && <span aria-hidden>✓</span>}
            {t}
          </button>
        ))}
      </div>

      <section aria-labelledby="proxima">
        <Link href={`/demo/arbitro/jugada/${next.id}`} className="rf-hero-media" tabIndex={-1} aria-hidden>
          <Scene kind={sceneOf[next.id]} className="size-full" />
          <span className="rf-badge">Ilustración</span>
        </Link>
        <p className="rf-eyebrow mt-4">Próxima práctica · {next.rule}</p>
        <h1 id="proxima" className="rf-headline">
          {next.title}
        </h1>
        <p className="rf-byline">
          <strong>
            {count} {count === 1 ? "jugada" : "jugadas"}
          </strong>
          <span aria-hidden>·</span>
          <span>{lawOf[next.rule]}</span>
        </p>
        <Link href={`/demo/arbitro/jugada/${next.id}`} className="rf-primary">
          <Icon name="play" className="size-5" />
          Empezar práctica
        </Link>
      </section>

      <Link href="/demo/arbitro/feedback" className="rf-result">
        <span className="rf-result-thumb">
          <Scene kind={sceneOf[lastResult.id]} className="size-full" />
          <span className="rf-play" aria-hidden>
            <Icon name="play" className="size-3.5" />
          </span>
          <span className="rf-duration">{lastResult.duration}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="rf-eyebrow block">Último resultado</span>
          <span className="rf-result-title">{lastResult.title}</span>
        </span>
        <span className="rf-secondary">Revisar</span>
      </Link>

      <section aria-labelledby="corregir" className="mt-7">
        <h2 id="corregir" className="rf-eyebrow rf-section-title">
          Para corregir
        </h2>
        {list.length === 0 ? (
          <p className="rf-empty">No tenés nada pendiente en este tema. Seguí practicando para mantenerlo.</p>
        ) : (
          <ul className="rf-list">
            {list.map((item) => (
              <li key={item.title}>
                <Link href={`/demo/arbitro/jugada/${item.from}`} className="rf-row">
                  <span className="rf-row-thumb">
                    <Scene kind={sceneOf[item.from]} className="size-full" />
                  </span>
                  <span className="min-w-0">
                    <span className="rf-row-title">{item.title}</span>
                    <span className="rf-byline mt-1">
                      <strong>{lawOf[item.rule]}</strong>
                      <span aria-hidden>·</span>
                      <span>{item.when}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
