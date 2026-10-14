"use client";

import Link from "next/link";
import { useState } from "react";
import { TopicChips } from "./chips";
import { byTopic, fotoOf, lawOf, type Topic } from "./data";
import { fotos } from "./fotos";
import { Photo } from "./photo";

export function Entrenar() {
  const [topic, setTopic] = useState<Topic>("Para vos");
  const [first, ...rest] = byTopic(topic);

  return (
    <>
      <h1 className="rf-page-title">Entrenar</h1>

      <div className="rf-train-cover">
        <Photo
          foto={fotos.arbitrosSorteo}
          sizes="(min-width: 1024px) 720px, (min-width: 480px) 400px, 100vw"
          priority
        />
        <div className="rf-train-cover-text">
          <p className="rf-eyebrow rf-on-photo">Entrenamiento arbitral</p>
          <p className="rf-train-cover-title">
            Decidí, compará con el criterio y corregí.
          </p>
        </div>
      </div>

      <h2 id="reglas" className="rf-eyebrow rf-section-title mt-6">Jugadas de decisión</h2>
      <p className="rf-note">Elegí un tema. Cada ejercicio muestra su regla y, después de confirmar, el criterio explicado.</p>
      <TopicChips value={topic} onChange={setTopic} />

      <div className="rf-train">
        <Link href={`/demo/arbitro/jugada/${first.id}`} className="block">
          <span className="rf-hero-media">
            <Photo
              foto={fotoOf(first)}
              sizes="(min-width: 1024px) 360px, (min-width: 480px) 400px, 100vw"
            />
            <span className="rf-badge">Sugerida</span>
          </span>
          <span className="rf-card-title mt-3">{first.title}</span>
          <span className="rf-byline mt-1">
            <strong>{lawOf(first).short}</strong>
            <span aria-hidden>·</span>
            <span>Nivel {first.difficulty}</span>
          </span>
        </Link>

        {rest.length > 0 && (
          <ul className="rf-list rf-train-list">
            {rest.map((s) => (
              <li key={s.id}>
                <Link href={`/demo/arbitro/jugada/${s.id}`} className="rf-row">
                  <span className="rf-row-thumb">
                    <Photo foto={fotoOf(s)} sizes="64px" />
                  </span>
                  <span className="min-w-0">
                    <span className="rf-row-title">{s.title}</span>
                    <span className="rf-byline mt-1">
                      <strong>{lawOf(s).short}</strong>
                      <span aria-hidden>·</span>
                      <span>
                        {s.rule} · nivel {s.difficulty}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="rf-note">
        Ejercicios de demostración, sin video real. Las fotos son de referencia
        y no muestran estas jugadas.
      </p>

      <section aria-labelledby="fisico" className="rf-physical">
        <span className="rf-physical-media">
          <Photo
            foto={fotos.calentamiento}
            sizes="(min-width: 480px) 160px, 34vw"
          />
        </span>
        <div className="min-w-0">
          <span className="rf-tag">Próximamente</span>
          <span className="rf-eyebrow mt-2 block">Preparación física</span>
          <h2 id="fisico" className="rf-row-title mt-1">
            Rutinas de velocidad y resistencia
          </h2>
          <span className="rf-byline mt-1">
            Llegan en una próxima entrega. Todavía no se pueden usar.
          </span>
        </div>
      </section>
    </>
  );
}
