import { BrandMark } from "./components/brand-mark";
import { PitchIllustration } from "./components/pitch-illustration";
import { ButtonLink } from "./components/ui/button";
import { StatusPill } from "./components/ui/status-pill";

const steps = [
  { n: "01", title: "Mirá la jugada", text: "Situaciones reales en video, organizadas por regla y dificultad." },
  { n: "02", title: "Decidí y fundamentá", text: "Elegí la decisión, la regla aplicada y qué tan seguro estás." },
  { n: "03", title: "Confirmá tu respuesta", text: "El criterio de corrección permanece oculto hasta que confirmás." },
  { n: "04", title: "Aprendé del resultado", text: "Explicación de la decisión correcta y tu progreso en el tiempo." },
];

const principles = [
  { title: "Criterio protegido", text: "La respuesta correcta nunca se revela antes de confirmar tu decisión." },
  { title: "Cada institución, sus datos", text: "Las organizaciones solo ven a sus propios árbitros y resultados." },
  { title: "Contenido validado", text: "Cada situación pasa por revisión técnica humana antes de publicarse." },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <BrandMark />
          <span className="font-semibold tracking-tight">Formación arbitral</span>
        </div>
        <StatusPill tone="progress">En desarrollo</StatusPill>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-10 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
          <div className="animate-rise">
            <p className="text-sm font-medium text-[var(--text-muted)]">eQuantum · Formación arbitral</p>
            <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.04] tracking-tight">
              Un espacio para aprender de{" "}
              <span className="relative whitespace-nowrap">
                cada jugada.
                <svg viewBox="0 0 220 14" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 10 C60 2 150 2 218 8" fill="none" stroke="var(--color-card-yellow)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
              Estamos preparando la plataforma de formación y evaluación arbitral: práctica con jugadas en video,
              decisiones fundamentadas y resultados que explican el porqué.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#flujo" size="lg">
                Cómo va a funcionar
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                  <path d="M10 4v12m0 0 5-5m-5 5-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ButtonLink>
              <ButtonLink href="#principios" size="lg" variant="secondary">
                Nuestros principios
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-[var(--text-muted)]">
              En desarrollo. Las funciones de entrenamiento todavía no están disponibles.
            </p>
          </div>
          <PitchIllustration />
        </section>

        <section id="flujo" className="scroll-mt-8 border-y border-[var(--border)] bg-[var(--surface-raised)]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">De la jugada al aprendizaje</h2>
              <StatusPill tone="soon">Próximamente</StatusPill>
            </div>
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li
                  key={s.n}
                  className="group rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="font-mono text-sm font-semibold text-[var(--accent)]">{s.n}</span>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{s.text}</p>
                  <span aria-hidden className="mt-5 block h-1 w-8 rounded-full bg-[var(--color-card-yellow)] transition-all duration-300 group-hover:w-16" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="principios" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pensada para ser justa y segura</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-[var(--radius-card)] bg-[var(--color-pitch-900)] p-7 text-[var(--color-chalk)] shadow-[var(--shadow-soft)]">
                <span aria-hidden className="block h-5 w-3.5 rounded-[3px] bg-[var(--color-card-yellow)]" />
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-pitch-100)]">{p.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-sm text-[var(--text-muted)]">
          <span>Proyecto independiente. Sin vinculación institucional con la APF.</span>
          <span>eQuantum</span>
        </div>
      </footer>
    </div>
  );
}
