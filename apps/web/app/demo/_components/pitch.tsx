import type { ReactNode } from "react";

/** Miniatura rayada de campo para listas. */
export function PitchThumb({ className = "h-16 w-20", children }: { className?: string; children?: ReactNode }) {
  return (
    <span
      aria-hidden
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[repeating-linear-gradient(90deg,var(--color-pitch-700)_0_12px,var(--color-pitch-800)_12px_24px)] ${className}`}
    >
      <span className="absolute inset-1.5 rounded-sm border border-white/60" />
      {children ?? (
        <span className="relative flex size-7 items-center justify-center rounded-full bg-[var(--color-chalk)]/95">
          <svg viewBox="0 0 20 20" className="size-3"><path d="M6 4l10 6-10 6z" fill="var(--color-pitch-800)" /></svg>
        </span>
      )}
    </span>
  );
}

/** Lugar del video: una ilustración rotulada, nunca un video real en la demo. */
export function PitchVideo({ badge, children }: { badge?: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative h-52 overflow-hidden rounded-[var(--radius-card)] bg-[repeating-linear-gradient(90deg,var(--color-pitch-700)_0_28px,var(--color-pitch-800)_28px_56px)]">
      <svg viewBox="0 0 350 200" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <g fill="none" stroke="var(--color-chalk)" strokeOpacity="0.7" strokeWidth="2">
          <rect x="10" y="10" width="330" height="180" rx="2" />
          <path d="M175 10v180" />
          <circle cx="175" cy="100" r="28" />
          <rect x="280" y="50" width="60" height="100" />
        </g>
        {children ?? (
          <>
            <path d="M120 150 C160 140 210 112 262 94" fill="none" stroke="var(--color-card-yellow)" strokeWidth="3" strokeDasharray="6 6" />
            <circle cx="120" cy="150" r="7" fill="var(--color-chalk)" />
            <circle cx="268" cy="92" r="7" fill="var(--color-chalk)" />
            <circle cx="280" cy="106" r="7" fill="var(--color-card-red)" />
          </>
        )}
      </svg>
      <span className="absolute bottom-2.5 left-3 rounded-md bg-[var(--color-pitch-950)]/70 px-2 py-1 text-[11px] font-bold text-[var(--color-chalk)]">
        Ilustración en lugar del video
      </span>
      {badge && <span className="absolute right-3 top-2.5">{badge}</span>}
    </div>
  );
}
