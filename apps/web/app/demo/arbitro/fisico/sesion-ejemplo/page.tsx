import Link from "next/link";

const blocks = [
  "Objetivo de la sesión",
  "Material necesario",
  "Bloques ordenados",
  "Descansos e instrucciones",
  "Medición cuando corresponda",
];

export default function PhysicalSessionExamplePage() {
  return (
    <main className="min-h-dvh bg-[#f5f7fa] px-5 pb-24 pt-6 text-[#10243f] md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col gap-5 border-b border-[#dce4ee] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#637181]">SESIÓN DE EJEMPLO</span>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Así se verá una sesión</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#637181]">
              Esta vista explica el recorrido previsto sin inventar cargas, tiempos ni rutinas reales.
            </p>
          </div>
          <Link href="/demo/arbitro/fisico" className="text-sm font-semibold text-[#155ec5] hover:underline">
            ← Preparación física
          </Link>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-[28px] border border-[#dce4ee] bg-white p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-[#eaf6ff] px-3 py-1.5 text-[11px] font-semibold text-[#126db3]">
              Preview · contenido no validado
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Sesión guiada de ejemplo</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#637181]">
              En producción, este espacio mostrará únicamente contenido aprobado por el responsable físico: objetivo, nivel, material, duración estimada, bloques, protocolo y versión.
            </p>
            <div className="mt-7 space-y-3">
              {blocks.map((block, index) => (
                <div key={block} className="flex items-center gap-4 rounded-2xl bg-[#f7f9fb] p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0d2949] text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong className="block text-sm font-semibold">{block}</strong>
                    <small className="mt-1 block text-xs text-[#7a8796]">Pendiente de contenido especialista</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-[28px] bg-[#0d2949] p-6 text-white">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-[#9bdcff]">ESTADO</span>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em]">No iniciar entrenamiento</h3>
            <p className="mt-3 text-sm leading-6 text-[#d4e6f8]">
              Esta pantalla no registra actividad. Cuando el módulo real exista, iniciar una sesión creará una ejecución identificable y trazable.
            </p>
            <button type="button" disabled className="mt-6 w-full cursor-not-allowed rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/45">
              Iniciar sesión
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}
