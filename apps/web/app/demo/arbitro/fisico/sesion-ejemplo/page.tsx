"use client";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {exerciseById} from "../exerciseData";
import { Suspense, useEffect, useRef, useState } from "react";

type Phase = "ready" | "running" | "paused" | "finished";
const steps = ["Preparación y calentamiento", "Ejercicio de demostración", "Vuelta a la calma"];
function format(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function PhysicalSessionExamplePage() {
  const searchParams=useSearchParams();
  const exercise=exerciseById(searchParams.get("ejercicio")??"sprints");
  const [phase, setPhase] = useState<Phase>("ready");
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);
  const started = useRef<number | null>(null);
  const accumulated = useRef(0);
  useEffect(() => {
    if (phase !== "running") return;
    started.current = Date.now();
    const tick = () => setElapsed(Math.floor((accumulated.current + Date.now() - (started.current ?? Date.now())) / 1000));
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [phase]);
  const pause = () => {
    if (started.current !== null) accumulated.current += Date.now() - started.current;
    started.current = null;
    setElapsed(Math.floor(accumulated.current / 1000));
    setPhase("paused");
  };
  const finish = () => {
    if (!window.confirm("¿Finalizar esta sesión de demostración?")) return;
    if (phase === "running" && started.current !== null) accumulated.current += Date.now() - started.current;
    setElapsed(Math.floor(accumulated.current / 1000));
    started.current = null;
    setPhase("finished");
  };
  const nextStep=()=>setStep(v=>Math.min(v+1,exercise.steps.length-1));
  const reset = () => { if (!window.confirm("¿Descartar el tiempo de esta sesión?")) return; accumulated.current = 0; started.current = null; setElapsed(0); setStep(0); setPhase("ready"); };
  const active = phase === "running" || phase === "paused";
  const progress = ((elapsed % 60) / 60) * 100;
  return <main className="min-h-dvh bg-[#061b30] pb-16 text-white">
    <div className="relative mx-auto max-w-xl overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#12466b] via-[#092943] to-[#061b30] opacity-80" aria-hidden="true"/>
      <div className="relative px-5 pt-7">
        <Link href="/demo/arbitro/fisico" onClick={e => {if(active && !window.confirm("¿Salir y descartar esta sesión sin guardar?")) e.preventDefault();}} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/90">← Preparación física</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-[#48c9fb]">Entrenamiento · Demo</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{exercise.name}</h1>
        <p className="mt-2 text-sm text-white/70">{phase==="finished"?"Sesión completada":exercise.steps[step]}</p>
        <div className="relative mx-auto mt-8 grid aspect-square w-full max-w-[330px] place-items-center rounded-full bg-[#041629] shadow-[0_18px_55px_#0005]" style={{background:`conic-gradient(#22b7ff ${progress}%, #25445d ${progress}% 100%)`}}>
          <div className="absolute inset-[11px] rounded-full bg-[#09233b]"/>
          <div className="relative z-10 text-center">
            <div className="text-4xl text-[#3ac8ff]" aria-hidden="true">◉</div>
            <output aria-label="Tiempo transcurrido" aria-live="off" className="mt-3 block text-[clamp(3.5rem,16vw,5rem)] font-extrabold tracking-tight tabular-nums">{format(elapsed)}</output>
            <p className="mt-1 text-sm text-white/65">{phase==="ready"?"Listo para comenzar":phase==="running"?"Tiempo de entrenamiento":phase==="paused"?"En pausa":"Sesión finalizada"}</p>
            <span className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs text-white/80">Etapa {step+1} de {exercise.steps.length}</span>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-5">
          {active && <button type="button" onClick={finish} className="flex min-w-20 flex-col items-center gap-2 text-xs"><span className="grid size-14 place-items-center rounded-full border border-white/20 bg-white/10 text-xl">■</span>Detener</button>}
          {phase!=="finished" ? <button type="button" onClick={()=>phase==="running"?pause():setPhase("running")} className="flex min-w-24 flex-col items-center gap-2 text-sm font-semibold"><span className="grid size-20 place-items-center rounded-full bg-[#087bff] text-3xl shadow-lg shadow-blue-600/30">{phase==="running"?"Ⅱ":"▶"}</span>{phase==="running"?"Pausar":phase==="paused"?"Reanudar":"Comenzar"}</button> : <button type="button" onClick={reset} className="rounded-full bg-[#087bff] px-7 py-4 font-bold">Nueva sesión</button>}
          {active && <button type="button" onClick={nextStep} disabled={step===exercise.steps.length-1} className="flex min-w-20 flex-col items-center gap-2 text-xs disabled:opacity-35"><span className="grid size-14 place-items-center rounded-full border border-white/20 bg-white/10 text-xl">➜</span>Siguiente</button>}
        </div>
        <div className="mt-8 grid grid-cols-2 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/5 py-4 text-center"><div><p className="text-xs text-white/60">Tiempo total</p><strong className="mt-1 block text-2xl tabular-nums">{format(elapsed)}</strong></div><div><p className="text-xs text-white/60">Etapa actual</p><strong className="mt-1 block text-2xl">{step+1}/{exercise.steps.length}</strong></div></div>
        <p className="mt-5 rounded-xl bg-white/10 p-4 text-xs leading-5 text-white/75">Cronómetro ilustrativo. No mide distancia, ritmo ni calorías; no prescribe cargas ni tiempos oficiales.</p>
      </div>
      <section className="relative mt-7 rounded-t-[30px] bg-white px-5 pb-10 pt-7 text-[#10243f]">
        <h2 className="text-lg font-bold">{phase==="finished"?"Resumen de sesión":"Recorrido ilustrativo"}</h2>
        {phase==="finished" && <p className="mt-2 text-sm text-slate-600">Tiempo transcurrido: {format(elapsed)} · Resultado local sin guardar.</p>}
        <ol className="mt-5 space-y-3">{exercise.steps.map((name,i)=><li key={i}><button type="button" disabled={phase==="finished"} onClick={()=>setStep(i)} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-sm ${step===i?"bg-sky-50 text-sky-900":"bg-slate-50"}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full font-bold ${step===i?"bg-[#087bff] text-white":"bg-slate-200 text-slate-600"}`}>{i+1}</span><span className="flex-1">{name}</span>{step===i&&<span className="text-xs font-bold text-blue-600">Actual</span>}</button></li>)}</ol>
        {active && <button type="button" className="mt-5 text-sm font-semibold text-red-700" onClick={reset}>Descartar sesión</button>}
        {phase==="finished" && <Link href="/demo/arbitro/fisico" className="mt-5 inline-block text-sm font-semibold text-blue-700">Volver a Preparación física →</Link>}
        <p className="mt-6 text-xs text-slate-500">Demo sin guardado. No reemplaza la supervisión profesional.</p>
      </section>
    </div>
  </main>;
}

export default function Page(){return <Suspense fallback={<main className="p-6">Cargando entrenamiento…</main>}><PhysicalSessionExamplePage/></Suspense>}