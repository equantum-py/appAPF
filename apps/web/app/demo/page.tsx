import Link from "next/link";
import { BrandMark } from "../components/brand-mark";

const areas = [
  {
    href: "/demo/arbitro",
    tag: "App del árbitro",
    title: "Practicá con jugadas y mirá tu progreso",
    text: "Biblioteca, decisión con confirmación, resultado explicado, revisión del instructor y progreso por regla.",
    dark: false,
  },
  {
    href: "/demo/panel",
    tag: "Panel de la organización",
    title: "Revisá evaluaciones y seguí la auditoría",
    text: "Resumen por grupo, revisión de respuestas con anotaciones y registro de acciones sensibles.",
    dark: true,
  },
];

export default function DemoIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center gap-3">
        <BrandMark />
        <span className="font-semibold">Formación arbitral</span>
      </div>
      <h1 className="mt-10 text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-tight tracking-tight">Recorré la demo</h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--text-muted)]">
        Pantallas navegables con datos ficticios para validar la experiencia antes de construir cada entrega. No hay cuentas, videos reales ni evaluación integrada.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {areas.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`group flex flex-col gap-3 rounded-[var(--radius-card)] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
              a.dark ? "bg-[var(--color-pitch-900)] text-[var(--color-chalk)]" : "border border-[var(--border)] bg-[var(--surface-raised)]"
            }`}
          >
            <span className={`text-xs font-extrabold uppercase tracking-wider ${a.dark ? "text-[var(--color-card-yellow)]" : "text-[var(--accent)]"}`}>{a.tag}</span>
            <span className="text-2xl font-extrabold leading-snug">{a.title}</span>
            <span className={`text-[15px] leading-relaxed ${a.dark ? "text-[var(--color-pitch-100)]" : "text-[var(--text-muted)]"}`}>{a.text}</span>
            <span className="mt-2 inline-flex items-center gap-2 font-bold">
              Entrar
              <svg viewBox="0 0 20 20" className="size-4 transition group-hover:translate-x-1" aria-hidden>
                <path d="M4 10h12m0 0-5-5m5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-sm text-[var(--text-muted)]">Proyecto independiente. Sin vinculación institucional con la APF.</p>
    </main>
  );
}
