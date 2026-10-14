/**
 * Ilustración decorativa de una jugada y de la tarjeta de decisión.
 * Es una vista ilustrativa: no hay entrenamiento ni evaluación integrados.
 */
export function PitchIllustration() {
  return (
    <figure className="mx-auto w-full max-w-md" aria-labelledby="pitch-caption">
      <div className="relative">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-pitch-800)] p-4 shadow-[var(--shadow-lift)]">
          <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden>
            <defs>
              <pattern id="stripes" width="40" height="220" patternUnits="userSpaceOnUse">
                <rect width="20" height="220" fill="var(--color-pitch-700)" />
                <rect x="20" width="20" height="220" fill="var(--color-pitch-800)" />
              </pattern>
              <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 10 5 0 10z" fill="var(--color-card-yellow)" />
              </marker>
            </defs>
            <rect width="320" height="220" rx="10" fill="url(#stripes)" />
            <g fill="none" stroke="var(--color-chalk)" strokeOpacity="0.75" strokeWidth="2">
              <rect x="10" y="10" width="300" height="200" rx="2" />
              <path d="M160 10v200" />
              <circle cx="160" cy="110" r="30" />
              <rect x="250" y="55" width="60" height="110" />
              <rect x="285" y="85" width="25" height="50" />
            </g>
            <path
              className="animate-draw"
              d="M110 160 C150 150 190 120 245 100"
              fill="none"
              stroke="var(--color-card-yellow)"
              strokeWidth="3"
              strokeDasharray="6 6"
              markerEnd="url(#arrow)"
            />
            <circle cx="110" cy="160" r="7" fill="var(--color-chalk)" />
            <circle cx="252" cy="96" r="7" fill="var(--color-chalk)" />
            <circle cx="262" cy="110" r="7" fill="var(--color-card-red)" />
            <circle cx="262" cy="110" r="16" fill="none" stroke="var(--color-card-yellow)" strokeWidth="2" />
          </svg>
        </div>

        <div className="animate-rise absolute -bottom-10 -right-4 w-60 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 shadow-[var(--shadow-lift)] [animation-delay:0.5s] sm:-right-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Tu decisión</p>
          <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden>
            <span className="rounded-lg border border-[var(--border)] py-2 text-center text-xs font-medium">Sigue</span>
            <span className="flex items-center justify-center gap-1 rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)]/10 py-2 text-xs font-semibold">
              <span className="h-3 w-2 rounded-[2px] bg-[var(--color-card-yellow)]" />
              Falta
            </span>
            <span className="rounded-lg border border-[var(--border)] py-2 text-center text-xs font-medium">Penal</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]" aria-hidden>
            <div className="h-full w-2/3 rounded-full bg-[var(--accent)]" />
          </div>
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">Seguridad de la decisión</p>
        </div>
      </div>

      <figcaption id="pitch-caption" className="mt-16 text-left text-xs text-[var(--text-muted)]">
        Vista ilustrativa. Todavía no es una función disponible.
      </figcaption>
    </figure>
  );
}
