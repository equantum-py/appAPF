import Link from "next/link";
import type { ReactNode } from "react";
import { ArbitroNav } from "../_components/nav";
import { BrandMark } from "../../components/brand-mark";
export default function ArbitroLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/demo/arbitro" className="app-brand">
          <BrandMark className="size-8" />
          <span>
            Formación<span className="brand-sub">ARBITRAL</span>
          </span>
        </Link>
        <details className="profile-menu">
          <summary>
            <span className="profile-avatar">AD</span>
            <span>
              Árbitro <span aria-hidden>⌄</span>
            </span>
          </summary>
          <div className="profile-dropdown">
            <p>Perfil de demostración</p>
            <Link href="/demo/arbitro">Árbitro Demo</Link>
            <Link href="/demo/panel">Cambiar a instructor</Link>
          </div>
        </details>
      </header>
      <main className="app-content">{children}</main>
      <ArbitroNav />
    </div>
  );
}
