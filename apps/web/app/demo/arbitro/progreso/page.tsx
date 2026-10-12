import { history, progressByRule } from "../../_data";

const weeks = [62, 66, 64, 70, 73, 71, 78, 82];

export default function Progreso() {
  const weakest = [...progressByRule].sort((a, b) => a.ok / a.total - b.ok / b.total)[0];
  const max = Math.max(...weeks);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight">Tu progreso</h1>

      <section className="rounded-3xl bg-[var(--surface-raised)] p-4 ring-1 ring-[var(--border)]">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-extrabold">Aciertos por semana</h2>
          <span className="text-xs text-[var(--text-muted)]">Últimas 8 semanas</span>
        </div>
        <ol className="mt-3 grid h-32 grid-cols-8 items-end gap-2" aria-label="Porcentaje de aciertos por semana">
          {weeks.map((v, i) => (
            <li key={i} className="flex h-full flex-col items-center justify-end gap-1">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">{v}%</span>
              <span
                className={`w-full rounded-t-md rounded-b-sm ${i === weeks.length - 1 ? "bg-[var(--accent)]" : "bg-[var(--color-pitch-100)]"}`}
                style={{ height: `${(v / max) * 96}px` }}
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3.5 rounded-3xl bg-[var(--surface-raised)] p-4 ring-1 ring-[var(--border)]">
        <h2 className="text-sm font-extrabold">Aciertos por regla</h2>
        {progressByRule.map((r) => {
          const p = r.ok / r.total;
          return (
            <div key={r.rule}>
              <div className="flex justify-between text-[13px]"><span className="font-semibold">{r.rule}</span><span className="text-[var(--text-muted)]">{r.ok} de {r.total}</span></div>
              <div className="mt-1.5 h-2.5 rounded-full bg-[var(--border)]">
                <div className={`h-2.5 rounded-full ${p >= 0.75 ? "bg-[var(--color-pitch-500)]" : "bg-[var(--color-card-yellow)]"}`} style={{ width: `${Math.round(p * 100)}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex items-start gap-3 rounded-2xl bg-[var(--color-pitch-50)] p-4 text-[var(--color-ink)]">
        <span aria-hidden className="mt-0.5 h-4 w-3 shrink-0 rounded-[3px] bg-[var(--color-card-yellow)]" />
        <p className="text-[13px] leading-relaxed">Sugerencia: practicá más situaciones de <strong>{weakest.rule}</strong>, es donde tenés menos aciertos.</p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-extrabold">Historial</h2>
        {history.map((h) => (
          <div key={h.title} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-raised)] p-3 ring-1 ring-[var(--border)]">
            <span aria-hidden className={`h-9 w-2.5 shrink-0 rounded-full ${h.score >= 90 ? "bg-[var(--color-pitch-500)]" : "bg-[var(--color-card-yellow)]"}`} />
            <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{h.title}</span><span className="text-xs text-[var(--text-muted)]">{h.when}</span></span>
            <span className="text-sm font-extrabold">{h.score} pts</span>
          </div>
        ))}
      </section>
    </div>
  );
}
