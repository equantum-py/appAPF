import Link from "next/link";

const groups = [
  { title: "Velocidad y aceleración", subtitle: "Salidas, aceleración y sprints repetidos", exercises: ["Aceleración corta", "Sprint progresivo", "Sprints repetidos (RSA)"], color: "from-[#09273e] to-[#125f84]" },
  { title: "Resistencia", subtitle: "Sostener el esfuerzo durante el partido", exercises: ["Carrera continua", "Intervalos de carrera", "Cambios de ritmo"], color: "from-[#103c3b] to-[#20837c]" },
  { title: "Agilidad y dirección", subtitle: "Reaccionar y desplazarte con control", exercises: ["Desplazamiento lateral", "Cambios de dirección", "Circuito con conos"], color: "from-[#252e4d] to-[#4863a2]" },
  { title: "Fuerza y estabilidad", subtitle: "Preparación muscular complementaria", exercises: ["Sentadillas", "Zancadas", "Plancha"], color: "from-[#303748] to-[#607083]" },
  { title: "Movilidad", subtitle: "Preparar articulaciones y movimientos", exercises: ["Movilidad de cadera", "Movilidad de tobillos", "Movilidad de columna"], color: "from-[#194b55] to-[#3e91a0]" },
  { title: "Recuperación", subtitle: "Vuelta a la calma y recuperación", exercises: ["Caminata suave", "Movilidad controlada", "Vuelta a la calma"], color: "from-[#294754] to-[#547c8c]" },
];

export default function PhysicalPreviewPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-28 pt-5 text-[#10283b] sm:px-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <Link href="/demo/arbitro" className="text-sm font-semibold text-[#167aa5]">← Inicio</Link>
        <span className="rounded-full bg-[#e9f2f8] px-3 py-1 text-[11px] text-[#426277]">Vista previa · sin registros</span>
      </header>
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#228db8]">Tu centro de entrenamiento</span>
        <h1 className="mt-1 text-[32px] font-bold leading-tight tracking-tight">Preparación física</h1>
        <p className="mt-2 text-sm text-[#607182]">Entrená las capacidades que exige dirigir un partido.</p>
      </div>
      <nav aria-label="Áreas de preparación física" className="mb-7 grid grid-cols-4 gap-1 rounded-2xl bg-white p-1 shadow-sm">
        {[["Entrenar","entrenar"],["Mi plan","plan"],["Historial","rendimiento"],["Mi perfil","perfil"]].map(([label, slug]) => <Link key={slug} href={`/demo/arbitro/fisico/${slug}`} className="rounded-xl px-1 py-3 text-center text-xs font-semibold text-[#06415e] hover:bg-[#d8f3ff]">{label}</Link>)}
      </nav>
      <Link href="/demo/arbitro/fisico/sesion-ejemplo" className="mb-6 flex items-center justify-between gap-4 rounded-[22px] bg-[#0d2949] px-5 py-5 text-white shadow-lg"><span><span className="block text-[10px] font-bold uppercase tracking-widest text-[#79d8f5]">Acceso rápido</span><strong className="mt-1 block text-xl">Comenzar entrenamiento</strong><span className="mt-1 block text-xs text-white/70">Cronómetro y sesión de demostración</span></span><span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-[#4dd0f6] text-xl font-bold text-[#082a43]">→</span></Link>
      <section aria-labelledby="physical-groups">
        <h2 id="physical-groups" className="mb-4 text-xl font-bold">¿Qué querés trabajar hoy?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((group) => (
            <article key={group.title} className={`overflow-hidden rounded-[20px] bg-gradient-to-br ${group.color} p-5 text-white shadow-sm`}>
              <div className="mb-5">
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <p className="mt-1 text-xs text-white/80">{group.subtitle}</p>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {group.exercises.map((exercise) => <span key={exercise} className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] text-white">{exercise}</span>)}
              </div>
              <Link href="/demo/arbitro/fisico/sesion-ejemplo" className="inline-flex min-h-11 items-center rounded-full bg-[#4dd0f6] px-5 text-xs font-bold text-[#092e44]">Entrenar →</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Diseñá tu entrenamiento</h2>
        <p className="mt-1 text-sm text-[#607182]">Próximamente podrás combinar ejercicios aprobados y registrar tus sesiones.</p>
        <span className="mt-3 inline-block rounded-full bg-[#eef2f5] px-3 py-2 text-xs text-[#617284]">Disponible en una etapa posterior</span>
      </section>
      <p className="mt-5 text-xs leading-relaxed text-[#6b7c8a]">Demo sin guardado. Ejercicios ilustrativos, no prescripciones. La selección de cargas, descansos y pruebas requiere validación profesional. Sin respaldo institucional de la APF.</p>
    </main>
  );
}
