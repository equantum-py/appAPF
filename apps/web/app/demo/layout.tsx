import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = {
  title: "Demo · Formación arbitral",
  robots: { index: false },
};
export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="apf-app min-h-screen">
      <div role="note" className="app-demo-note">
        <span className="demo-dot" /> Demo · datos ficticios, sin guardado
      </div>
      {children}
    </div>
  );
}
