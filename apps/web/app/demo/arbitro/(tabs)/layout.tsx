import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "../_ui/bottom-nav";
import { Icon } from "../_ui/icons";

/** Pantallas con navegación: barra inferior en móvil, columna lateral en escritorio. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="rf-shell">
      <aside className="rf-side">
        <Link href="/demo/arbitro" className="rf-wordmark rf-side-mark">
          Formación arbitral
        </Link>
        <BottomNav />
      </aside>
      <div className="rf-col">
        <header className="rf-header">
          <Link href="/demo/arbitro" className="rf-wordmark rf-head-mark">
            Formación arbitral
          </Link>
          <button type="button" className="rf-icon-btn" aria-label="Avisos (no disponible en la demo)" disabled>
            <Icon name="campana" filled={false} className="size-[22px]" />
          </button>
        </header>
        <main className="rf-main">{children}</main>
      </div>
    </div>
  );
}
