"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabHeader() {
  const path = usePathname();
  const title = path.endsWith("/entrenar") ? "Entrenar"
    : path.endsWith("/progreso") ? "Progreso"
    : path.endsWith("/yo") ? "Yo" : "Inicio";
  return (
    <header className="rf-header">
      <Link href="/demo/arbitro" className="rf-tab-label">{title}</Link>
    </header>
  );
}
