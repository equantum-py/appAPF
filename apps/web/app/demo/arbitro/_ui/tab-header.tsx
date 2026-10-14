"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";

export function TabHeader() {
  const path = usePathname();
  if (path === "/demo/arbitro") {
    return (
      <header className="rf-header rf-simple-header">
        <Link href="/demo/arbitro" className="rf-simple-brand">
          <Icon name="silbato" filled={false} className="size-6" />
          Plataforma arbitral
        </Link>
        <Link href="/demo/arbitro/yo" className="rf-simple-profile" aria-label="Mi perfil">
          <Icon name="yo" filled={false} className="size-6" />
        </Link>
      </header>
    );
  }
  const title = path.endsWith("/entrenar") ? "Entrenar"
    : path.endsWith("/progreso") ? "Progreso"
    : path.endsWith("/yo") ? "Yo" : "Inicio";
  return (
    <header className="rf-header">
      <Link href="/demo/arbitro" className="rf-tab-label">{title}</Link>
    </header>
  );
}
