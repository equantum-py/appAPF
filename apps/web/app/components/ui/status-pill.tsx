import type { ReactNode } from "react";

type Tone = "progress" | "soon" | "neutral";

const tones: Record<Tone, string> = {
  progress: "bg-[var(--color-card-yellow-soft)] text-[#5c4700] dark:bg-[#3a3005] dark:text-[#f8e08a]",
  soon: "bg-[var(--accent)]/12 text-[var(--accent)]",
  neutral: "bg-[var(--border)]/60 text-[var(--text-muted)]",
};

export function StatusPill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${tones[tone]}`}>
      {tone === "progress" && (
        <span aria-hidden className="animate-pulse-dot size-2 rounded-full bg-[var(--color-card-yellow)]" />
      )}
      {children}
    </span>
  );
}
