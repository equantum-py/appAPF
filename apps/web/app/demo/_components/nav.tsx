"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        const active =
          l.href === "/demo/panel" ? path === l.href : path.startsWith(l.href);
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
