"use client";

import Link from "next/link";
import { useState } from "react";
import { TopicChips } from "./chips";
import { byTopic, lawOf, sceneOf, type Topic } from "./data";
import { Icon } from "./icons";
import { Scene } from "./scene";

export function Entrenar() {
  const [topic, setTopic] = useState<Topic>("Para vos");
  const [first, ...rest] = byTopic(topic);

  return (
    <>
      <h1 className="rf-page-title">Entrenar</h1>
      <TopicChips value={topic} onChange={setTopic} />

      <p className="rf-eyebrow">Sugerida</p>
      <Link href={`/demo/arbitro/jugada/${first.id}`} className="mt-2 block">
        <span className="rf-hero-media">
          <Scene kind={sceneOf(first)} className="size-full" />
          <span className="rf-play rf-play-lg" aria-hidden>
            <Icon name="play" className="size-5" />
          </span>
          <span className="rf-duration">{first.duration}</span>
        </span>
        <span className="rf-card-title mt-3">{first.title}</span>
        <span className="rf-byline mt-1">
          <strong>{lawOf(first).short}</strong>
          <span aria-hidden>·</span>
          <span>Nivel {first.difficulty}</span>
        </span>
      </Link>

      {rest.length > 0 && (
        <>
          <p className="rf-eyebrow rf-section-title mt-7">Más jugadas</p>
          <ul className="rf-grid">
            {rest.map((s) => (
              <li key={s.id}>
                <Link href={`/demo/arbitro/jugada/${s.id}`} className="block">
                  <span className="rf-grid-media">
                    <Scene kind={sceneOf(s)} className="size-full" />
                    <span className="rf-duration">{s.duration}</span>
                  </span>
                  <span className="rf-card-title rf-card-title-sm mt-2">{s.title}</span>
                  <span className="rf-byline mt-1">
                    <span>
                      {s.rule} · nivel {s.difficulty}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="rf-note">Las jugadas son ilustraciones de ejemplo, no videos reales.</p>
    </>
  );
}
