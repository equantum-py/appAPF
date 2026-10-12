"use client";

import { useState } from "react";
import { auditEvents, type AuditType } from "../../_data";

const types: ("Todas" | AuditType)[] = ["Todas", "Publicación", "Acceso a video", "Revisión", "Membresía"];
const chip: Record<AuditType, string> = {
  Publicación: "bg-[var(--color-pitch-100)] text-[var(--color-pitch-800)]",
  "Acceso a video": "bg-[#e6ece7] text-[#2c4337]",
  Revisión: "bg-[#fde3e3] text-[#8a1f1f]",
  Membresía: "bg-[var(--color-card-yellow-soft)] text-[#5c4700]",
};

export default function Auditoria() {
  const [filter, setFilter] = useState<(typeof types)[number]>("Todas");
  const rows = auditEvents.filter((e) => filter === "Todas" || e.type === filter);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Auditoría</h1>
        <p className="mt-1 text-[var(--text-muted)]">Registro de acciones sensibles. Los eventos no se pueden editar ni borrar.</p>
      </div>
      <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filter === t}
            onClick={() => setFilter(t)}
            className={`h-10 rounded-full border-[1.5px] px-4 text-[13px] font-bold transition ${filter === t ? "border-[var(--color-pitch-700)] bg-[var(--color-pitch-700)] text-white" : "border-[var(--border)] bg-[var(--surface-raised)]"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-3xl bg-[var(--surface-raised)] ring-1 ring-[var(--border)]">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--surface)] text-left text-xs tracking-wider text-[var(--text-muted)]">
              <th scope="col" className="px-4 py-3.5">FECHA</th>
              <th scope="col" className="px-4 py-3.5">ACTOR</th>
              <th scope="col" className="px-4 py-3.5">ACCIÓN</th>
              <th scope="col" className="px-4 py-3.5">DETALLE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.when + e.detail} className="border-t border-[var(--border)]">
                <td className="whitespace-nowrap px-4 py-3.5 text-[var(--text-muted)]">{e.when}</td>
                <td className="px-4 py-3.5 font-bold">{e.who}</td>
                <td className="px-4 py-3.5"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-extrabold ${chip[e.type]}`}>{e.type}</span></td>
                <td className="px-4 py-3.5">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
