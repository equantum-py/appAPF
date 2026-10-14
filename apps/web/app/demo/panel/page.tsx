import Link from "next/link";
import { buttonClasses } from "../../components/ui/button";
import { auditEvents, groups } from "../_data";

const kpis = [
  { label: "Árbitros activos", value: "73", note: "+5 este mes", dark: true },
  { label: "Jugadas respondidas", value: "1.284", note: "esta semana" },
  { label: "Aciertos promedio", value: "76%", note: "+4 pts vs. septiembre" },
  { label: "Evaluaciones por revisar", value: "9", note: "Ir a revisar", href: "/demo/panel/revision", warn: true },
];

export default function PanelResumen() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-[var(--text-muted)]">Semana del 6 al 12 de octubre</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Resumen de la organización</h1>
        </div>
        <Link href="/demo/panel/revision" className={buttonClasses()}>Revisar evaluaciones</Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl p-4.5 ${k.dark ? "bg-[var(--color-pitch-900)] text-[var(--color-chalk)]" : k.warn ? "bg-[var(--color-card-yellow-soft)] text-[#5c4700]" : "bg-[var(--surface-raised)] ring-1 ring-[var(--border)]"}`}
          >
            <p className={`text-[13px] ${k.dark ? "text-[#a3b8ab]" : k.warn ? "" : "text-[var(--text-muted)]"}`}>{k.label}</p>
            <p className="mt-1.5 text-[34px] font-extrabold leading-none">{k.value}</p>
            {k.href ? (
              <Link href={k.href} className="mt-2 inline-block text-xs font-extrabold underline underline-offset-2">{k.note}</Link>
            ) : (
              <p className={`mt-2 text-xs ${k.dark ? "text-[var(--color-pitch-100)]" : "text-[var(--text-muted)]"}`}>{k.note}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <section className="flex min-w-0 flex-[2_1_420px] flex-col gap-4 rounded-3xl bg-[var(--surface-raised)] p-5 ring-1 ring-[var(--border)]">
          <h2 className="text-lg font-extrabold">Aciertos por grupo</h2>
          {groups.map((g) => {
            const p = g.done / g.total;
            return (
              <div key={g.name} className="grid grid-cols-[140px_minmax(0,1fr)_64px] items-center gap-3.5">
                <span className="text-sm font-bold">{g.name}</span>
                <div className="h-3 rounded-full bg-[var(--border)]">
                  <div className={`h-3 rounded-full ${p >= 0.75 ? "bg-[var(--color-pitch-500)]" : "bg-[var(--color-card-yellow)]"}`} style={{ width: `${Math.round(p * 100)}%` }} />
                </div>
                <span className="text-right text-[13px] text-[var(--text-muted)]">{Math.round(p * 100)}%</span>
              </div>
            );
          })}
        </section>
        <section className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-3xl bg-[var(--surface-raised)] p-5 ring-1 ring-[var(--border)]">
          <h2 className="text-lg font-extrabold">Requieren atención</h2>
          <p className="flex gap-2.5 rounded-xl bg-[#fde3e3] p-3 text-[13px] text-[#5c1515]"><span aria-hidden className="mt-0.5 h-3.5 w-2.5 shrink-0 rounded-sm bg-[var(--color-card-red)]" /><span>Aciertos en <strong>mano</strong> bajaron 9 pts en Grupo Ascenso.</span></p>
          <p className="flex gap-2.5 rounded-xl bg-[var(--color-card-yellow-soft)] p-3 text-[13px] text-[#5c4700]"><span aria-hidden className="mt-0.5 h-3.5 w-2.5 shrink-0 rounded-sm bg-[var(--color-card-yellow)]" /><span>2 situaciones esperan revisión técnica para publicarse.</span></p>
        </section>
      </div>

      <section className="rounded-3xl bg-[var(--surface-raised)] p-5 ring-1 ring-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Actividad reciente</h2>
          <Link href="/demo/panel/auditoria" className="text-[13px] font-extrabold text-[var(--accent)]">Ver auditoría</Link>
        </div>
        <ul className="mt-2">
          {auditEvents.slice(0, 3).map((e) => (
            <li key={e.when + e.detail} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[var(--border)] py-2.5 text-sm last:border-0">
              <span className="w-24 text-[var(--text-muted)]">{e.when}</span>
              <span><strong>{e.who}</strong> · {e.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
