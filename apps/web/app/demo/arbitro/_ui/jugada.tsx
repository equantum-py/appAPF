"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  decisions,
  sanctions,
  type Decision,
  type Sanction,
  type Situation,
} from "../../_data";
import {
  fotoOf,
  lawChoices,
  promptOf,
  resultHref,
  type LawId,
} from "./data";
import { Photo } from "./photo";

/** La jugada ocupa toda la pantalla; la decisión se toma en un panel inferior. */
export function Jugada({
  situation,
  position,
  total,
}: {
  situation: Situation;
  position: number;
  total: number;
}) {
  const router = useRouter();
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [sanction, setSanction] = useState<Sanction | null>(null);
  const [law, setLaw] = useState<LawId | null>(null);
  const exitDialog = useRef<HTMLDialogElement>(null);
  const dirty = decision !== null || sanction !== null || law !== null;
  const ready = decision !== null && sanction !== null && law !== null;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const leave = () =>
    dirty ? exitDialog.current?.showModal() : router.push("/demo/arbitro");

  return (
    <div className="rf-play-screen" data-deciding={deciding}>
      <div className="rf-play-stage">
        <Photo
          foto={fotoOf(situation)}
          sizes="(min-width: 1024px) calc(100vw - 420px), 100vw"
          priority
          className="rf-stage-photo"
        />
        <div className="rf-play-top">
          <button
            type="button"
            onClick={leave}
            className="rf-round"
            aria-label="Salir de la práctica"
          >
            ✕
          </button>
          <div
            className="rf-progress"
            aria-label={`Jugada ${position} de ${total}`}
          >
            {Array.from({ length: total }, (_, i) => (
              <span key={i} data-on={i < position} />
            ))}
          </div>
          <span className="rf-count">
            {position}/{total}
          </span>
        </div>
        <div className="rf-stage-copy">
          <p className="rf-stage-label">
            Ejercicio de demostración · sin video real
          </p>
          <p className="rf-stage-prompt">{promptOf(situation)}</p>
          <p className="rf-stage-credit">
            Foto de referencia, no muestra esta jugada:{" "}
            {fotoOf(situation).author} · CC BY 2.0
          </p>
        </div>
      </div>

      <section className="rf-sheet" aria-labelledby="jugada-titulo">
        <p className="rf-eyebrow">Práctica de decisión</p>
        <h1 id="jugada-titulo" className="rf-headline rf-headline-sm">
          {situation.title}
        </h1>

        {!deciding ? (
          <>
            <p className="rf-lead mt-2">
              Leé la situación. Cuando estés listo, decidí qué cobrás.
            </p>
            <button
              type="button"
              className="rf-primary w-full"
              onClick={() => setDeciding(true)}
            >
              Decidir
            </button>
          </>
        ) : (
          <>
            <p className="rf-recap">{promptOf(situation)}</p>
            <fieldset className="mt-4">
              <legend className="rf-eyebrow mb-2">¿Qué cobrás?</legend>
              <div className="grid grid-cols-2 gap-2">
                {decisions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="rf-option"
                    aria-pressed={decision === o.id}
                    onClick={() => setDecision(o.id)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="rf-eyebrow mb-2">
                ¿Sanción disciplinaria?
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {sanctions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className="rf-option"
                    aria-pressed={sanction === o.id}
                    onClick={() => setSanction(o.id)}
                  >
                    <span
                      className="rf-card-swatch"
                      data-card={o.id}
                      aria-hidden
                    />
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="rf-eyebrow mb-2">¿Qué regla aplicás?</legend>
              <div className="grid gap-2">
                {lawChoices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    className="rf-option"
                    aria-pressed={law === choice.id}
                    onClick={() => setLaw(choice.id)}
                  >
                    {choice.title}
                  </button>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              className="rf-primary w-full"
              disabled={!ready}
              onClick={() =>
                ready &&
                router.push(resultHref(situation.id, decision, sanction, law))
              }
            >
              Confirmar decisión
            </button>
            <p className="rf-note mt-2 text-center">
              {ready
                ? "El criterio se muestra después de confirmar. La demo no guarda respuestas."
                : "Elegí una decisión, una sanción y una regla."}
            </p>
          </>
        )}
      </section>
      <dialog
        ref={exitDialog}
        className="rf-exit-dialog"
        aria-labelledby="exit-title"
        aria-describedby="exit-description"
      >
        <h2 id="exit-title" className="rf-headline rf-headline-sm">
          ¿Salir de la práctica?
        </h2>
        <p id="exit-description" className="rf-lead mt-3">
          Se perderán las respuestas que elegiste en esta jugada.
        </p>
        <button
          type="button"
          className="rf-primary"
          autoFocus
          onClick={() => exitDialog.current?.close()}
        >
          Seguir respondiendo
        </button>
        <button
          type="button"
          className="rf-ghost"
          onClick={() => {
            exitDialog.current?.close();
            router.push("/demo/arbitro");
          }}
        >
          Salir y descartar
        </button>
      </dialog>
    </div>
  );
}
