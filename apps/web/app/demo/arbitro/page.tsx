import Link from "next/link";
import { PitchThumb } from "../_components/pitch";
import { progressByRule, situations } from "../_data";

const answered: Record<string, number> = { "entrada-mediocampo": 96, "pase-profundidad": 60 };

export default function ArbitroInicio() {
  const total = progressByRule.reduce((a, r) => a + r.total, 0);
  const ok = progressByRule.reduce((a, r) => a + r.ok, 0);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--color-pitch-700)] font-extrabold text-white">AD</span>
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">Buen día</p>
          <p className="text-lg font-extrabold">Árbitro Demo</p>
        </div>
      </div>

      <Link
        href={`/demo/arbitro/jugada/${situations[1].id}`}
        className="block rounded-3xl bg-[var(--color-pitch-900)] p-5 text-[var(--color-chalk)] shadow-[var(--shadow-lift)] transition hover:-translate-y-0.5"
      >
        <span className="rounded-full bg-[var(--color-card-yellow)] px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-[var(--color-ink)]">SIGUIENTE JUGADA</span>
        <p className="mt-3 text-[21px] font-extrabold leading-tight">{situations[1].title}</p>
        <p className="mt-1 text-[13px] text-[var(--color-pitch-100)]">{situations[1].rule} · dificultad {situations[1].difficulty}</p>
        <span className="mt-4 flex h-12 items-center justify-center rounded-full bg-[var(--color-chalk)] font-extrabold text-[var(--color-pitch-900)]">Practicar ahora</span>
      </Link>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-[var(--surface-raised)] p-3 ring-1 ring-[var(--border)]"><p className="text-2xl font-extrabold">{Math.round((ok / total) * 100)}%</p><p className="text-[11px] text-[var(--text-muted)]">aciertos</p></div>
        <div className="rounded-2xl bg-[var(--surface-raised)] p-3 ring-1 ring-[var(--border)]"><p className="text-2xl font-extrabold">{total}</p><p className="text-[11px] text-[var(--text-muted)]">jugadas</p></div>
        <div className="rounded-2xl bg-[var(--color-card-yellow-soft)] p-3 text-[#5c4700]"><p className="text-2xl font-extrabold">4</p><p className="text-[11px]">días seguidos</p></div>
      </div>

      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-extrabold">Biblioteca de jugadas</h1>
        {situations.map((s) => {
          const score = answered[s.id];
          return (
            <Link
              key={s.id}
              href={`/demo/arbitro/jugada/${s.id}`}
              className="flex items-center gap-3.5 rounded-2xl bg-[var(--surface-raised)] p-3 ring-1 ring-[var(--border)] transition hover:ring-[var(--accent)]"
            >
              <PitchThumb />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[15px] font-bold leading-snug">{s.title}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--accent)]">{s.rule}</span> · {s.duration}
                </span>
              </span>
              <span
                className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  score === undefined ? "bg-[var(--color-card-yellow-soft)] text-[#5c4700]" : score >= 90 ? "bg-[var(--color-pitch-100)] text-[var(--color-pitch-800)]" : "bg-[#fde3e3] text-[#8a1f1f]"
                }`}
              >
                {score === undefined ? "Nueva" : `${score} pts`}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
