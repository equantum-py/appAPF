"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const arbitroLinks = [
  { href: "/demo/arbitro", label: "Inicio", icon: "M4 11 12 4l8 7v9h-5v-6H9v6H4z" },
  { href: "/demo/arbitro/feedback", label: "Revisión", icon: "M3 5h18v14H3z M10 9.5l4.5 2.5-4.5 2.5z" },
  { href: "/demo/arbitro/progreso", label: "Progreso", icon: "M5 20V12M12 20V5M19 20v-9" },
];

export function ArbitroNav() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="sticky bottom-0 grid grid-cols-3 border-t border-[var(--border)] bg-[var(--surface-raised)] px-2 pb-5 pt-2">
      {arbitroLinks.map((l) => {
        const active = l.href === "/demo/arbitro" ? path === l.href || path.startsWith("/demo/arbitro/jugada") : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] ${active ? "font-extrabold text-[var(--accent)]" : "font-semibold text-[var(--text-muted)]"}`}
          >
            <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden>
              <path d={l.icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

const panelLinks = [
  { href: "/demo/panel", label: "Resumen" },
  { href: "/demo/panel/revision", label: "Revisión y anotaciones" },
  { href: "/demo/panel/auditoria", label: "Auditoría" },
];

export function PanelNav() {
  const path = usePathname();
  return (
    <nav aria-label="Panel" className="flex flex-col gap-1 text-sm font-bold">
      {panelLinks.map((l) => {
        const active = l.href === "/demo/panel" ? path === l.href : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-3 py-3 transition ${active ? "bg-[var(--color-pitch-700)] text-white" : "text-[var(--color-pitch-100)] hover:bg-white/5"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
