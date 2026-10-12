"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { PitchVideo } from "../../_components/pitch";
import { annotations } from "../../_data";

const tones = {
  red: { chip: "bg-[#fde3e3] text-[#8a1f1f]", dot: "var(--color-card-red)" },
  yellow: { chip: "bg-[var(--color-card-yellow-soft)] text-[#5c4700]", dot: "var(--color-card-yellow)" },
  green: { chip: "bg-[var(--color-pitch-100)] text-[var(--color-pitch-800)]", dot: "var(--color-pitch-500)" },
};
const spots = [
  { x: 120, y: 140 },
  { x: 205, y: 105 },
  { x: 275, y: 95 },
];

export default function Feedback() {
  const [i, setI] = useState(1);
  const a = annotations[i];
  const spot = spots[i];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/demo/arbitro" aria-label="Volver al inicio" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)] ring-1 ring-[var(--border)]">
          <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <p className="text-xs text-[var(--text-muted)]">Revisión del instructor</p>
          <h1 className="text-[17px] font-extrabold">Entrada desde atrás en mediocampo</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-pitch-950)]">
        <PitchVideo
          badge={<span className="rounded-full bg-[var(--color-card-yellow)] px-2.5 py-1 text-xs font-extrabold text-[var(--color-ink)]">{a.time} · {a.kind}</span>}
        >
          <circle cx={spot.x} cy={spot.y} r="7" fill="var(--color-chalk)" />
          <circle cx={spot.x + 14} cy={spot.y + 10} r="7" fill="var(--color-card-red)" />
          <circle cx={spot.x + 7} cy={spot.y + 5} r="30" fill="none" stroke="var(--color-card-yellow)" strokeWidth="3" strokeDasharray="7 5" />
        </PitchVideo>
        <div className="px-4 pb-4 pt-3">
          <div className="relative h-7">
            <div className="absolute inset-x-0 top-3 h-1 rounded-full bg-[#23402f]" />
            <div className="absolute left-0 top-3 h-1 rounded-full bg-[var(--color-pitch-500)]" style={{ width: `${a.position}%` }} />
            {annotations.map((m, k) => (
              <button
                key={m.time}
                type="button"
                aria-label={`Anotación ${k + 1}, ${m.time}`}
                aria-pressed={k === i}
                onClick={() => setI(k)}
                className="absolute top-0 -ml-3.5 size-7 rounded-full border-[3px] border-[var(--color-pitch-950)] transition hover:scale-110"
                style={{ left: `${m.position}%`, background: k === i ? "var(--color-card-yellow)" : "var(--color-chalk)" }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-[#a3b8ab]"><span>0:00</span><span>Tocá un marcador</span><span>0:12</span></div>
        </div>
      </div>

      <article aria-live="polite" className="flex flex-col gap-2.5 rounded-3xl bg-[var(--surface-raised)] p-4 ring-1 ring-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-pitch-900)] text-[13px] font-extrabold text-[var(--color-card-yellow)]">IN</span>
          <div className="flex-1"><p className="text-sm font-extrabold">Instructor Demo</p><p className="text-xs text-[var(--text-muted)]">Anotación {i + 1} de {annotations.length}</p></div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${tones[a.tone].chip}`}>{a.kind}</span>
        </div>
        <h2 className="text-base font-extrabold">{a.title}</h2>
        <p className="text-sm leading-relaxed">{a.text}</p>
      </article>

      <div className="flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={() => setI((i + annotations.length - 1) % annotations.length)}>Anterior</Button>
        <Button className="flex-1" onClick={() => setI((i + 1) % annotations.length)}>Siguiente</Button>
      </div>
      <p className="text-center text-[11px] text-[var(--text-muted)]">Anotaciones ficticias de demostración.</p>
    </div>
  );
}
