import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Demo · Formación arbitral", robots: { index: false } };

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div role="note" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[var(--color-card-yellow-soft)] px-4 py-2 text-center text-[13px] font-semibold text-[#5c4700]">
        <span>Demo con datos ficticios. Nada se guarda ni se envía.</span>
        <Link href="/demo" className="underline underline-offset-2">Índice de la demo</Link>
      </div>
      {children}
    </div>
  );
}
