import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const text = Inter({ subsets: ["latin"], variable: "--font-rf-text", display: "swap" });

/** Identidad aprobada: tipografía liviana, azul oscuro y celeste. */
export default function ArbitroLayout({ children }: { children: ReactNode }) {
  return <div className={`rf ${text.variable}`}>{children}</div>;
}
