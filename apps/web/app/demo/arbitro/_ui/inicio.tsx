"use client";

import Link from "next/link";
import { useState } from "react";
import { TopicChips } from "./chips";
import { byId, byTopic, lawOf, pastAnswers, resultHref, sceneOf, toImprove, type Topic } from "./data";
import { Icon } from "./icons";
import { Scene } from "./scene";

const last = pastAnswers[0];
const lastSituation = byId(last.id)!;

export function Inicio() {
  const [topic, setTopic] = useState<Topic>("Para vos");
  const pool = byTopic(topic);
  const next = pool[0];
  const list = toImprove.filter((t) => topic === "Para vos" || byId(t.id)!.rule === topic);
  const play = `/demo/arbitro/jugada/${next.id}`;

  return (
    <>
      <TopicChips value={topic} onChange={setTopic} />

      <section aria-labelledby="proxima">
        <Link href={play} className="rf-hero-media" tabIndex={-1} aria-hidden>
          <Scene kind={sceneOf(next)} className="size-full" />
          <span className="rf-badge">Ilustración</span>
        </Link>
        <p className="rf-eyebrow mt-4">Próxima práctica · {next.rule}</p>
        <h1 id="proxima" className="rf-headline">
          {next.title}
        </h1>
        <p className="rf-byline mt-2">
          <strong>
            {pool.length} {pool.length === 1 ? "jugada" : "jugadas"}
          </strong>
          <span aria-hidden>·</span>
          <span>{lawOf(next).short}</span>
        </p>
        <Link href={play} className="rf-primary">
          <Icon name="play" className="size-5" />
          Empezar práctica
        </Link>
      </section>

      <Link href={resultHref(last.id, last.d, last.s)} className="rf-result">
        <span className="rf-result-thumb">
          <Scene kind={sceneOf(lastSituation)} className="size-full" />
          <span className="rf-play" aria-hidden>
            <Icon name="play" className="size-3.5" />
          </span>
          <span className="rf-duration">{lastSituation.duration}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="rf-eyebrow block">Último resultado</span>
          <span className="rf-result-title">{lastSituation.title}</span>
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
            {list.map((item) => {
              const s = byId(item.id)!;
              return (
                <li key={item.title}>
                  <Link href={`/demo/arbitro/jugada/${s.id}`} className="rf-row">
                    <span className="rf-row-thumb">
                      <Scene kind={sceneOf(s)} className="size-full" />
                    </span>
                    <span className="min-w-0">
                      <span className="rf-row-title">{item.title}</span>
                      <span className="rf-byline mt-1">
                        <strong>{lawOf(s).short}</strong>
                        <span aria-hidden>·</span>
                        <span>{item.when}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
