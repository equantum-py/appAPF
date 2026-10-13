"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { decisions, sanctions, type Decision, type Sanction, type Situation } from "../../_data";
import { lawOf, resultHref, sceneOf } from "./data";
import { Scene } from "./scene";

/** La jugada ocupa toda la pantalla; la decisión se toma en un panel inferior. */
export function Jugada({ situation, position, total }: { situation: Situation; position: number; total: number }) {
  const router = useRouter();
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [sanction, setSanction] = useState<Sanction | null>(null);
  const ready = decision !== null && sanction !== null;

  return (
    <div className="rf-play-screen" data-deciding={deciding}>
      <div className="rf-play-stage">
        <Scene kind={sceneOf(situation)} className="size-full" />
        <div className="rf-play-top">
          <Link href="/demo/arbitro" className="rf-round" aria-label="Salir de la práctica">
            ✕
          </Link>
          <div className="rf-progress" aria-label={`Jugada ${position} de ${total}`}>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} data-on={i < position} />
            ))}
          </div>
          <span className="rf-count">
            {position}/{total}
          </span>
        </div>
        <span className="rf-badge rf-stage-badge">Ilustración en lugar del video · {situation.duration}</span>
      </div>

      <section className="rf-sheet" aria-labelledby="jugada-titulo">
        <p className="rf-eyebrow">
          {situation.rule} · {lawOf(situation).short}
        </p>
        <h1 id="jugada-titulo" className="rf-headline rf-headline-sm">
          {situation.title}
        </h1>

        {!deciding ? (
          <>
            <p className="rf-lead mt-2">Mirá la jugada completa. Cuando estés listo, decidí qué cobrás.</p>
            <button type="button" className="rf-primary w-full" onClick={() => setDeciding(true)}>
              Decidir
            </button>
          </>
        ) : (
          <>
            <fieldset className="mt-4">
              <legend className="rf-eyebrow mb-2">¿Qué cobrás?</legend>
              <div className="grid grid-cols-2 gap-2">
                {decisions.map((o) => (
                  <button key={o.id} type="button" className="rf-option" aria-pressed={decision === o.id} onClick={() => setDecision(o.id)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="rf-eyebrow mb-2">¿Sanción disciplinaria?</legend>
              <div className="grid grid-cols-3 gap-2">
                {sanctions.map((o) => (
                  <button key={o.id} type="button" className="rf-option" aria-pressed={sanction === o.id} onClick={() => setSanction(o.id)}>
                    <span className="rf-card-swatch" data-card={o.id} aria-hidden />
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="rf-primary w-full"
              disabled={!ready}
              onClick={() => ready && router.push(resultHref(situation.id, decision, sanction))}
            >
              Confirmar decisión
            </button>
            <p className="rf-note mt-2 text-center">
              {ready ? "Después de confirmar no podés cambiarla." : "Elegí una decisión y una sanción."}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
