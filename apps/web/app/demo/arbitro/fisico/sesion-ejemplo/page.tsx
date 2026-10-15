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
  return <main className="min-h-dvh bg-[#f5f7fa] px-5 pb-28 pt-6 text-[#10243f]">
    <div className="mx-auto max-w-2xl">
      <Link href="/demo/arbitro/fisico" onClick={e => { if (phase !== "ready" && phase !== "finished" && !window.confirm("¿Salir y descartar esta sesión sin guardar?")) e.preventDefault(); }} className="text-sm font-semibold text-sky-700">← Preparación física</Link>
      <p className="mt-7 text-xs font-bold uppercase tracking-widest text-sky-700">Demo interactiva · sin guardado</p>
      <h1 className="mt-2 text-3xl font-bold">{exercise.name}</h1>
      <p className="mt-3 text-sm text-slate-600">Cronómetro de demostración. No prescribe cargas, tiempos ni pruebas oficiales.</p>
      <section className="mt-7 rounded-[28px] bg-[#0d2949] p-6 text-center text-white shadow-lg">
        <p className="text-sm text-sky-200">{phase === "finished" ? "Sesión finalizada" : exercise.steps[step]}</p>
        <output aria-label="Tiempo transcurrido" aria-live="off" className="my-6 block font-mono text-6xl font-bold tabular-nums">{format(elapsed)}</output>
        <p className="mb-5 text-xs text-white/70">{phase === "ready" ? "Lista para comenzar" : phase === "running" ? "Cronómetro en marcha" : phase === "paused" ? "En pausa" : "Resumen local · no guardado"}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {phase === "ready" && <button className="rounded-full bg-[#4dd0f6] px-7 py-3 font-bold text-[#082a43]" onClick={() => setPhase("running")}>Comenzar</button>}
          {phase === "running" && <button className="rounded-full bg-[#4dd0f6] px-7 py-3 font-bold text-[#082a43]" onClick={pause}>Pausar</button>}
          {phase === "paused" && <button className="rounded-full bg-[#4dd0f6] px-7 py-3 font-bold text-[#082a43]" onClick={() => setPhase("running")}>Reanudar</button>}
          {(phase === "running" || phase === "paused") && <button className="rounded-full border border-white/50 px-6 py-3 font-semibold" onClick={nextStep} disabled={step===exercise.steps.length-1}>Siguiente →</button>}{(phase === "running" || phase === "paused") && <button className="rounded-full border border-white/50 px-6 py-3 font-semibold" onClick={finish}>Finalizar</button>}
          {phase === "finished" && <button className="rounded-full bg-[#4dd0f6] px-7 py-3 font-bold text-[#082a43]" onClick={reset}>Nueva sesión</button>}
        </div>
      </section>
      {phase !== "finished" ? <section className="mt-6 rounded-2xl bg-white p-5">
        <h2 className="font-semibold">Recorrido ilustrativo</h2>
        <div className="mt-4 space-y-2">{exercise.steps.map((name, i) => <button key={name} type="button" onClick={() => setStep(i)} className={`flex w-full items-center justify-between rounded-xl p-4 text-left text-sm ${step === i ? "bg-sky-100 font-bold text-sky-900" : "bg-slate-50"}`}><span>{i + 1}. {name}</span><span>{step === i ? "Actual" : "Ver"}</span></button>)}</div>
        {(phase === "running" || phase === "paused") && <button className="mt-5 text-sm font-semibold text-red-700" onClick={reset}>Descartar sesión</button>}
      </section> : <section className="mt-6 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">Resumen de demostración</h2><p className="mt-3 text-sm">Tiempo transcurrido: <strong>{format(elapsed)}</strong></p><p className="mt-2 text-sm text-slate-600">Este resultado solo existe en esta pantalla. No se guarda, no mide rendimiento físico ni constituye una evaluación.</p><Link href="/demo/arbitro/fisico" className="mt-5 inline-block text-sm font-semibold text-sky-700">Volver a Preparación física →</Link></section>}
      <p className="mt-6 text-xs leading-5 text-slate-500">La demo no reemplaza la supervisión de un preparador físico. Sin respaldo institucional de la APF.</p>
    </div>
  </main>;
}
\nexport default function Page(){return <Suspense fallback={<main className="p-6">Cargando entrenamiento…</main>}><PhysicalSessionExamplePage/></Suspense>}\n