import Link from "next/link";
import { Icon } from "../_ui/icons";

const categories = [
  { name: "Resistencia", detail: "Base aeróbica y continuidad" },
  { name: "Velocidad", detail: "Aceleración y cambios de ritmo" },
  { name: "Fuerza", detail: "Trabajo complementario" },
  { name: "Movilidad", detail: "Preparación y recuperación" },
];

const sessions = [
  {
    title: "Sesión guiada de ejemplo",
    meta: "Preview · contenido por validar",
    description:
      "Muestra cómo se presentarán objetivo, bloques, materiales y registro. No guarda resultados ni prescribe cargas reales.",
  },
  {
    title: "Historial de entrenamiento",
    meta: "Preview · sin datos persistidos",
    description:
      "Vista prevista para consultar sesiones completadas, abandonadas y mediciones cuando el módulo funcional esté habilitado.",
  },
];

export default function PhysicalPreviewPage() {
  return (
    <main className="min-h-dvh bg-[#f5f7fa] px-5 pb-24 pt-6 text-[#10243f] md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col gap-5 border-b border-[#dce4ee] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#637181]">PREVIEW NAVEGABLE</span>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Preparación física</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#637181]">
              Propuesta visual aprobada. Esta pantalla usa datos ficticios y no guarda entrenamientos.
            </p>
          </div>
          <Link href="/demo/arbitro" className="text-sm font-semibold text-[#155ec5] hover:underline">
            ← Inicio
          </Link>
        </header>

        <section className="relative overflow-hidden rounded-[28px] bg-[#0d2949] p-6 text-white shadow-[0_18px_50px_rgba(13,41,73,0.18)] sm:p-8">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#28b8ff] text-[#0d2949]">
              <Icon name="correr" filled={false} className="size-8" />
            </span>
            <div>
              <span className="text-[10px] font-semibold tracking-[0.18em] text-[#9bdcff]">PRIORIDAD DEL ÁRBITRO</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Entrená tu rendimiento físico</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d4e6f8]">
                Sesiones organizadas por objetivo, historial y progreso. Las rutinas reales deben ser validadas por un responsable físico especializado.
              </p>
            </div>
          </div>
          <span className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/90">
            Demo · sin persistencia
          </span>
        </section>

        <section className="mt-9" aria-labelledby="physical-categories-title">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.18em] text-[#637181]">CATEGORÍAS</span>
              <h2 id="physical-categories-title" className="mt-1 text-xl font-semibold tracking-[-0.025em]">¿Qué querés trabajar?</h2>
            </div>
            <span className="text-xs text-[#7a8796]">Contenido pendiente de validación</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {categories.map((category) => (
              <button key={category.name} type="button" className="group min-h-36 rounded-2xl border border-[#dce4ee] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#8ccfff] hover:shadow-sm">
                <span className="block text-base font-semibold">{category.name}</span>
                <small className="mt-2 block text-xs leading-5 text-[#6a7887]">{category.detail}</small>
                <span className="mt-5 block text-lg text-[#1583d8] transition group-hover:translate-x-1" aria-hidden>→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="physical-sessions-title">
          <div className="mb-4">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#637181]">SESIONES GUIADAS</span>
            <h2 id="physical-sessions-title" className="mt-1 text-xl font-semibold tracking-[-0.025em]">Tu entrenamiento</h2>
          </div>
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <article key={session.title} className="grid gap-4 rounded-2xl border border-[#dce4ee] bg-white p-5 sm:grid-cols-[52px_1fr_auto] sm:items-center">
                <div className="grid size-11 place-items-center rounded-xl bg-[#eaf6ff] text-sm font-semibold text-[#126db3]">0{index + 1}</div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7b8795]">{session.meta}</span>
                  <h3 className="mt-1 text-base font-semibold">{session.title}</h3>
                  <p className="mt-1 max-w-2xl text-xs leading-5 text-[#667584]">{session.description}</p>
                </div>
                {index === 0 ? (
                  <Link href="/demo/arbitro/fisico/sesion-ejemplo" className="text-sm font-semibold text-[#155ec5] hover:underline">
                    Ver sesión →
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-[#8b96a2]">Sin datos reales</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-8 rounded-2xl border border-[#c8d8e8] bg-[#eef6fd] px-4 py-3 text-xs leading-5 text-[#48637c]">
          <strong>Importante:</strong> esta preview no habilita entrenamiento físico real, no persiste respuestas y no representa criterios oficiales de la APF.
        </aside>
      </div>
    </main>
  );
}
