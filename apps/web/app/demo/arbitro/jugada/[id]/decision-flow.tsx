"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonClasses } from "../../../../components/ui/button";
import { PitchVideo } from "../../../_components/pitch";
import {
  confidences,
  decisions,
  labelOf,
  sanctions,
  scoreFor,
  type Confidence,
  type Decision,
  type Sanction,
  type Situation,
} from "../../../_data";

const option = (on: boolean) =>
  `rounded-2xl border-2 font-semibold transition ${on ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--accent)]/50"}`;

export function DecisionFlow({ situation, nextId, position, total }: { situation: Situation; nextId: string; position: number; total: number }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [sanction, setSanction] = useState<Sanction | null>(null);
  const [confidence, setConfidence] = useState<Confidence>("media");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const [tenths, setTenths] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (done || confirming) return;
    const t = setInterval(() => setTenths((x) => x + 1), 100);
    return () => clearInterval(t);
  }, [done, confirming]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (confirming && !d.open) d.showModal();
    if (!confirming && d.open) d.close();
  }, [confirming]);

  const ready = decision !== null && sanction !== null;
  const elapsed = `${(tenths / 10).toFixed(1).replace(".", ",")} s`;
  const score = scoreFor(situation, decision, sanction, confidence);
  const verdict = score >= 90 ? "Decisión correcta" : score >= 60 ? "Parcialmente correcta" : "Decisión incorrecta";
  const ring = score >= 90 ? "var(--color-pitch-500)" : score >= 60 ? "var(--color-card-yellow)" : "var(--color-card-red)";
  const mine = { d: labelOf(decisions, decision), s: labelOf(sanctions, sanction), c: labelOf(confidences, confidence) };
  const expected = {
    d: labelOf(decisions, situation.decision),
    s: situation.sanction === "ninguna" ? "Sin sanción" : `Tarjeta ${labelOf(sanctions, situation.sanction).toLowerCase()}`,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/demo/arbitro" aria-label="Volver a la biblioteca" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)] ring-1 ring-[var(--border)]">
          <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[var(--text-muted)]">Práctica de la biblioteca</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-[var(--border)]">
            <div className="h-1.5 rounded-full bg-[var(--accent)]" style={{ width: `${(position / total) * 100}%` }} />
          </div>
        </div>
        <span className="text-[13px] font-extrabold">{position}/{total}</span>
      </div>

      {!done ? (
        <>
          <PitchVideo
            badge={
              <span className="flex items-center gap-1.5 rounded-full bg-[var(--color-card-yellow)] px-2.5 py-1 text-xs font-extrabold tabular-nums text-[var(--color-ink)]" aria-label={`Tiempo de decisión ${elapsed}`}>
                <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden><circle cx="10" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M10 8v3l2 1.5M8 2.5h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                {elapsed}
              </span>
            }
          />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent)]">{situation.rule}</p>
            <h1 className="mt-1 text-[22px] font-extrabold leading-tight">{situation.title}</h1>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-extrabold">¿Qué decisión tomás?</legend>
            <div className="grid grid-cols-2 gap-2">
              {decisions.map((o) => (
                <button key={o.id} type="button" aria-pressed={decision === o.id} onClick={() => setDecision(o.id)} className={`min-h-13 px-2 text-sm ${option(decision === o.id)}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-extrabold">¿Sanción disciplinaria?</legend>
            <div className="grid grid-cols-3 gap-2">
              {sanctions.map((o) => (
                <button key={o.id} type="button" aria-pressed={sanction === o.id} onClick={() => setSanction(o.id)} className={`flex min-h-13 flex-col items-center justify-center gap-1.5 text-[13px] ${option(sanction === o.id)}`}>
                  <span aria-hidden className={`h-4 w-3 rounded-[3px] ${o.card}`} />
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-extrabold">¿Qué tan seguro estás?</legend>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[var(--border)]/60 p-1">
              {confidences.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={confidence === o.id}
                  onClick={() => setConfidence(o.id)}
                  className={`h-11 rounded-xl text-[13px] font-bold transition ${confidence === o.id ? "bg-[var(--surface-raised)] shadow-[var(--shadow-soft)]" : "text-[var(--text-muted)]"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <Button size="lg" disabled={!ready} onClick={() => setConfirming(true)}>Revisar y confirmar</Button>
          <p className="-mt-1 text-center text-xs text-[var(--text-muted)]">
            {ready ? "El criterio se muestra recién después de confirmar." : "Elegí una decisión y una sanción para continuar."}
          </p>
        </>
      ) : (
        <div role="status" className="flex flex-col gap-3.5">
          <div className="flex items-center gap-4 rounded-3xl bg-[var(--color-pitch-900)] p-5 text-[var(--color-chalk)]">
            <div className="relative size-24 shrink-0">
              <svg viewBox="0 0 96 96" className="size-24 -rotate-90" aria-hidden>
                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--color-pitch-800)" strokeWidth="10" />
                <circle cx="48" cy="48" r="40" fill="none" stroke={ring} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(score / 100) * 251.3} 251.3`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold">{score}</span>
            </div>
            <div>
              <p className="text-xl font-extrabold">{verdict}</p>
              <p className="mt-1 text-[13px] text-[var(--color-pitch-100)]">Decidiste en {elapsed}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-[var(--surface-raised)] p-3.5 ring-1 ring-[var(--border)]">
              <p className="text-[11px] font-extrabold tracking-wider text-[var(--text-muted)]">TU RESPUESTA</p>
              <p className="mt-1.5 font-extrabold">{mine.d}</p>
              <p className="text-[13px] text-[var(--text-muted)]">{mine.s} · seguridad {mine.c.toLowerCase()}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-pitch-50)] p-3.5 text-[var(--color-ink)] ring-1 ring-[var(--color-pitch-100)]">
              <p className="text-[11px] font-extrabold tracking-wider text-[var(--color-pitch-700)]">ESPERADA</p>
              <p className="mt-1.5 font-extrabold">{expected.d}</p>
              <p className="text-[13px] text-[var(--color-muted)]">{expected.s}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--surface-raised)] p-4 ring-1 ring-[var(--border)]">
            <p className="text-sm font-extrabold">Por qué</p>
            <p className="mt-1.5 text-sm leading-relaxed">{situation.explanation}</p>
            <p className="mt-2 text-[11px] text-[var(--text-muted)]">Ejemplo ficticio. No es criterio técnico oficial.</p>
          </div>
          <div className="flex gap-2.5">
            <Link href="/demo/arbitro/feedback" className={buttonClasses({ variant: "secondary" }, "flex-1")}>Ver revisión</Link>
            <Link href={`/demo/arbitro/jugada/${nextId}`} className={buttonClasses({}, "flex-1")}>Siguiente jugada</Link>
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="confirm-title"
        onClose={() => setConfirming(false)}
        className="m-0 mt-auto w-full max-w-none rounded-t-[28px] bg-[var(--surface-raised)] p-0 text-[var(--text)] backdrop:bg-[var(--color-pitch-950)]/55 sm:m-auto sm:max-w-md sm:rounded-[28px]"
      >
        <div className="flex flex-col gap-3.5 px-5 pb-7 pt-3">
          <span aria-hidden className="mx-auto h-1.5 w-11 rounded-full bg-[var(--border)]" />
          <h2 id="confirm-title" className="text-[21px] font-extrabold">¿Confirmás tu decisión?</h2>
          <dl className="flex flex-col gap-2 rounded-2xl bg-[var(--surface)] p-3.5 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Decisión</dt><dd className="font-bold">{mine.d}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Sanción</dt><dd className="font-bold">{mine.s}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Seguridad</dt><dd className="font-bold">{mine.c}</dd></div>
          </dl>
          <p className="text-[13px] leading-relaxed text-[var(--text-muted)]">Una vez confirmada no vas a poder cambiarla.</p>
          <Button size="lg" onClick={() => { setConfirming(false); setDone(true); }}>Confirmar y enviar</Button>
          <Button variant="ghost" onClick={() => setConfirming(false)}>Volver a revisar</Button>
        </div>
      </dialog>
    </div>
  );
}
