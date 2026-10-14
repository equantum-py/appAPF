/** Marca provisoria: círculo central del campo con una tarjeta. Sin símbolos institucionales. */
export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="var(--color-pitch-700)" />
      <circle cx="20" cy="20" r="9" fill="none" stroke="var(--color-chalk)" strokeWidth="2" />
      <path d="M20 4v32" stroke="var(--color-chalk)" strokeWidth="2" opacity="0.55" />
      <rect x="24" y="8" width="9" height="13" rx="2" fill="var(--color-card-yellow)" transform="rotate(14 28.5 14.5)" />
    </svg>
  );
}
