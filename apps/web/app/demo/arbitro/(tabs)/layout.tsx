import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "../_ui/bottom-nav";
import { Icon } from "../_ui/icons";
import { TabHeader } from "../_ui/tab-header";

/** Pantallas con navegación: barra inferior en móvil, columna lateral en escritorio. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="rf-shell">
      <aside className="rf-side">
        <Link href="/demo/arbitro" className="rf-wordmark rf-side-mark">
          <Icon name="silbato" filled={false} className="size-7" />
          Plataforma arbitral
        </Link>
        <BottomNav />
      </aside>
      <div className="rf-col">
        <TabHeader />
        <main className="rf-main">{children}</main>
      </div>
    </div>
  );
}
