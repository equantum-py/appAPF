import type { ReactNode } from "react";
import { ArbitroNav } from "../_components/nav";

export default function ArbitroLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-36px)] max-w-md flex-col bg-[var(--surface)] sm:my-6 sm:min-h-0 sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-[var(--border)] sm:shadow-[var(--shadow-lift)]">
      <div className="flex-1 px-5 pb-6 pt-5">{children}</div>
      <ArbitroNav />
    </div>
  );
}
