import { Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./_ui/icons";
import { BottomNav } from "./_ui/bottom-nav";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-rf-display", display: "swap" });
const text = Inter({ subsets: ["latin"], variable: "--font-rf-text", display: "swap" });

/** Propuesta visual nueva de la app del árbitro, en validación. */
export default function NuevoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`rf ${display.variable} ${text.variable}`}>
      <header className="rf-header">
        <Link href="/demo/nuevo" className="rf-wordmark">
          Formación arbitral
        </Link>
        <button type="button" className="rf-icon-btn" aria-label="Avisos (no disponible en la demo)" disabled>
          <Icon name="campana" filled={false} className="size-[22px]" />
        </button>
      </header>
      <main className="rf-main">{children}</main>
      <BottomNav />
    </div>
  );
}
