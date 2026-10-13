import { Barlow_Condensed, Inter } from "next/font/google";
import type { ReactNode } from "react";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-rf-display", display: "swap" });
const text = Inter({ subsets: ["latin"], variable: "--font-rf-text", display: "swap" });

/** App del árbitro: blanco y negro editorial, titulares condensados. */
export default function ArbitroLayout({ children }: { children: ReactNode }) {
  return <div className={`rf ${display.variable} ${text.variable}`}>{children}</div>;
}
