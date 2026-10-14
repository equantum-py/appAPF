"use client";

import Link from "next/link";
import { useState } from "react";
import { TopicChips } from "./chips";
import {
  byId,
  byTopic,
  fotoOf,
  lawOf,
  pastAnswers,
  resultHref,
  toImprove,
  type Topic,
} from "./data";
import { Icon } from "./icons";
import { Photo } from "./photo";

const last = pastAnswers[0];
const lastSituation = byId(last.id)!;

export function Inicio() {
  const [topic, setTopic] = useState<Topic>("Para vos");
  const pool = byTopic(topic);
  const next = pool[0];
  const list = toImprove.filter(
    (t) => topic === "Para vos" || byId(t.id)!.rule === topic,
  );
  const play = `/demo/arbitro/jugada/${next.id}`;

  return (
    <>
      <TopicChips value={topic} onChange={setTopic} />

      <div className="rf-home">
        <section aria-labelledby="proxima" className="rf-home-lead">
          <Link
            href={play}
            className="rf-hero-media"
            tabIndex={-1}
            aria-hidden
          >
            <Photo
              foto={fotoOf(next)}
              sizes="(min-width: 1024px) 460px, (min-width: 480px) 400px, 100vw"
              priority
            />
            <span className="rf-badge">Foto de referencia</span>
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

        <div className="rf-home-side">
          <Link
            href={resultHref(last.id, last.d, last.s, last.l)}
            className="rf-result"
          >
            <span className="rf-result-thumb">
              <Photo foto={fotoOf(lastSituation)} sizes="80px" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="rf-eyebrow block">Último resultado</span>
              <span className="rf-result-title">{lastSituation.title}</span>
            </span>
            <span className="rf-secondary">Revisar</span>
          </Link>

          <section aria-labelledby="corregir" className="rf-home-fix">
            <h2 id="corregir" className="rf-eyebrow rf-section-title">
              Para corregir
            </h2>
            {list.length === 0 ? (
              <p className="rf-empty">
                No tenés nada pendiente en este tema. Seguí practicando para
                mantenerlo.
              </p>
            ) : (
              <ul className="rf-list">
                {list.map((item) => {
                  const s = byId(item.id)!;
                  return (
                    <li key={item.title}>
                      <Link
                        href={`/demo/arbitro/jugada/${s.id}`}
                        className="rf-row"
                      >
                        <span className="rf-row-thumb">
                          <Photo foto={fotoOf(s)} sizes="64px" />
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
        </div>
      </div>
    </>
  );
}
