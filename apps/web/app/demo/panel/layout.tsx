import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "../../components/brand-mark";
import { PanelNav } from "../_components/nav";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-36px)] flex-wrap">
      <aside className="flex max-w-full flex-[1_1_240px] flex-col gap-5 bg-[var(--color-pitch-900)] p-4 text-[var(--color-chalk)] lg:max-w-[260px]">
        <Link href="/demo" className="flex items-center gap-2.5 font-extrabold">
          <BrandMark className="size-8" />
          Formación arbitral
        </Link>
        <div className="rounded-xl bg-[var(--color-pitch-800)] px-3 py-2.5">
          <p className="text-[11px] text-[#a3b8ab]">Organización</p>
          <p className="text-sm font-extrabold">Organización Demo</p>
        </div>
        <PanelNav />
        <p className="mt-auto text-xs text-[#a3b8ab]">Instructor Demo · datos ficticios</p>
      </aside>
      <main className="min-w-0 flex-[999_1_640px] px-6 py-7 sm:px-8">{children}</main>
    </div>
  );
}
