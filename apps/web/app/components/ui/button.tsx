import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] hover:brightness-110",
  secondary:
    "border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)]",
  ghost: "text-[var(--text)] hover:bg-[var(--accent)]/10",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type Common = { variant?: Variant; size?: Size };

export function buttonClasses({ variant = "primary", size = "md" }: Common = {}, extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export function Button({ variant, size, className = "", ...props }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={buttonClasses({ variant, size }, className)} {...props} />;
}

export function ButtonLink({ variant, size, className = "", ...props }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClasses({ variant, size }, className)} {...props} />;
}
