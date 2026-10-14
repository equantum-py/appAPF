"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { PitchThumb, PitchVideo } from "../../_components/pitch";
import { reviewQueue } from "../../_data";

const kinds = [
  { id: "bien", label: "Bien", on: "bg-[var(--color-pitch-700)] text-white border-[var(--color-pitch-700)]", dot: "var(--color-pitch-500)" },
  { id: "clave", label: "Clave", on: "bg-[var(--color-card-yellow)] text-[var(--color-ink)] border-[var(--color-card-yellow)]", dot: "var(--color-card-yellow)" },
  { id: "mejorar", label: "A mejorar", on: "bg-[#b02a2a] text-white border-[#b02a2a]", dot: "var(--color-card-red)" },
] as const;
type Kind = (typeof kinds)[number]["id"];
type Note = { time: string; kind: Kind; text: string };

export default function Revision() {
  const [selected, setSelected] = useState(reviewQueue[0].id);
  const [kind, setKind] = useState<Kind>("clave");
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<Record<string, Note[]>>({
    r1: [{ time: "0:03", kind: "mejorar", text: "Posición lejana en el contraataque." }],
  });
  const item = reviewQueue.find((r) => r.id === selected)!;
  const list = notes[selected] ?? [];

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setNotes({ ...notes, [selected]: [...list, { time: "0:07", kind, text }] });
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Revisión y anotaciones</h1>
          <p className="mt-1 text-[var(--text-muted)]">Explicá el criterio jugada por jugada. La evaluación original no se modifica.</p>
        </div>
        <span className="rounded-full bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] ring-1 ring-[var(--border)]">En la versión real: video privado, enlace temporal y acceso auditado</span>
      </div>

      <div className="flex flex-wrap gap-5">
        <section className="flex min-w-0 flex-[1_1_260px] flex-col gap-2.5">
          <h2 className="text-sm font-extrabold">Por revisar <span className="font-semibold text-[var(--text-muted)]">({reviewQueue.length})</span></h2>
          {reviewQueue.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.id === selected}
              onClick={() => setSelected(r.id)}
              className={`flex items-center gap-3 rounded-2xl border-[1.5px] p-3 text-left transition ${r.id === selected ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--accent)]/50"}`}
            >
              <PitchThumb className="h-11 w-14" />
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold leading-snug">{r.title}</span><span className="text-xs text-[var(--text-muted)]">{r.who}</span></span>
              <span className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-extrabold ${r.correct ? "bg-[var(--color-pitch-100)] text-[var(--color-pitch-800)]" : "bg-[#fde3e3] text-[#8a1f1f]"}`}>
                {r.correct ? "CORRECTA" : "A REVISAR"}
              </span>
            </button>
          ))}
        </section>

        <section className="flex min-w-0 flex-[3_1_520px] flex-col gap-4">
          <PitchVideo badge={<span className="rounded-full bg-[var(--color-card-yellow)] px-2.5 py-1 text-xs font-extrabold text-[var(--color-ink)]">Respondió: {item.answer}</span>} />
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-3xl bg-[var(--surface-raised)] p-4.5 ring-1 ring-[var(--border)]">
              <h3 className="text-[15px] font-extrabold">Nueva anotación en 0:07</h3>
              <div role="group" aria-label="Tipo de anotación" className="flex flex-wrap gap-2">
                {kinds.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    aria-pressed={kind === k.id}
                    onClick={() => setKind(k.id)}
                    className={`h-10 rounded-full border-[1.5px] px-4 text-[13px] font-bold transition ${kind === k.id ? k.on : "border-[var(--border)] bg-[var(--surface-raised)]"}`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
              <label className="flex flex-col gap-1.5 text-[13px] font-extrabold">
                Explicación del criterio
                <textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Qué pasó, qué decisión correspondía y por qué"
                  className="resize-y rounded-xl border-[1.5px] border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal"
                />
              </label>
              <Button className="self-start" disabled={!draft.trim()} onClick={add}>Agregar anotación</Button>
            </div>
            <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 rounded-3xl bg-[var(--surface-raised)] p-4.5 ring-1 ring-[var(--border)]">
              <h3 className="text-[15px] font-extrabold">Anotaciones ({list.length})</h3>
              {list.length === 0 && <p className="text-[13px] text-[var(--text-muted)]">Todavía no hay anotaciones en esta jugada.</p>}
              <ul aria-live="polite" className="flex flex-col gap-2.5">
                {list.map((n, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-1 size-3 shrink-0 rounded-full" style={{ background: kinds.find((k) => k.id === n.kind)!.dot }} />
                    <span><span className="block text-xs font-extrabold text-[var(--text-muted)]">{n.time} · {kinds.find((k) => k.id === n.kind)!.label}</span><span className="text-[13px] leading-snug">{n.text}</span></span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto text-[11px] text-[var(--text-muted)]">En la demo las anotaciones viven solo en esta pestaña.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
