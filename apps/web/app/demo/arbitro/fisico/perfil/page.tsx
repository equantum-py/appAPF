"use client";
import Link from "next/link";
import { useState } from "react";
import PhysicalNav from "../PhysicalNav";

const goals = [
  {name:"Resistencia",icon:"↗"}, {name:"Velocidad",icon:"◷"}, {name:"Agilidad",icon:"ϟ"},
  {name:"Fuerza",icon:"▥"}, {name:"Movilidad",icon:"♧"}, {name:"Prevención",icon:"⬡"},
];
const raised = "border border-white/90 bg-gradient-to-br from-white via-[#f2f7ff] to-[#dce9fc] shadow-[7px_9px_18px_#a7bbd55c,-5px_-5px_14px_#ffffff]";

export default function Page() {
  const [role,setRole]=useState("Principal");
  const [goal,setGoal]=useState("Resistencia");
  return <main className="mx-auto min-h-screen max-w-3xl overflow-hidden bg-[radial-gradient(ellipse_at_top_right,#cbdcff_0%,#edf5ff_38%,#f6f9ff_85%)] px-5 pb-36 pt-7 text-[#0b2047]">
    <Link href="/demo/arbitro/fisico" className={`inline-flex min-h-12 items-center rounded-full px-5 text-sm font-bold ${raised}`}>← &nbsp;Preparación física</Link>
    <header className="relative mt-7">
      <span aria-hidden="true" className="absolute right-1 top-0 rotate-[-18deg] text-6xl text-[#7b9fee]/40">◈</span>
      <h1 className="relative text-[clamp(1.8rem,7vw,2.5rem)] font-extrabold tracking-tight">Mi perfil físico</h1>
      <p className="relative mt-1 text-base text-[#557099]">Personalizá tu entrenamiento.</p>
    </header>
    <section className={`mt-6 flex items-center gap-4 rounded-[2rem] p-4 ${raised}`} aria-label="Perfil de demostración">
      <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#091d4e] text-xl font-bold text-white shadow-[inset_0_2px_5px_#ffffff40,0_7px_15px_#173a7360]">AD</span>
      <div className="min-w-0 flex-1"><h2 className="text-lg font-extrabold">Árbitro Demo</h2><p className="text-sm text-[#59759d]">Perfil de demostración</p></div>
      <span aria-hidden="true" className="text-2xl">›</span>
    </section>
    <section className={`mt-5 rounded-[2rem] p-5 ${raised}`}>
      <h2 className="text-lg font-bold">Tu rol arbitral</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">{["Principal","Asistente"].map((name)=><button type="button" key={name} aria-pressed={role===name} onClick={()=>setRole(name)} className={`min-h-14 rounded-full px-3 text-sm font-bold transition active:scale-[.98] ${role===name?"bg-gradient-to-b from-[#319bff] to-[#0b49c5] text-white shadow-[inset_0_2px_3px_#ffffff77,0_7px_12px_#0c60c34d]":raised+" text-[#52709b]"}`}>{name==="Principal"?"◈":"♧"} &nbsp;{name}</button>)}</div>
      <h2 className="mt-7 text-lg font-bold">Objetivo principal</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{goals.map(({name,icon})=><button type="button" key={name} aria-pressed={goal===name} onClick={()=>setGoal(name)} className={`min-h-14 rounded-full px-2 text-sm font-semibold transition active:scale-[.98] ${goal===name?"bg-gradient-to-r from-[#43b4ff] to-[#2454e7] text-white shadow-[inset_0_2px_3px_#ffffff77,0_7px_12px_#0c60c34d]":raised+" text-[#47638d]"}`}><span aria-hidden="true">{icon}</span> &nbsp;{name}</button>)}</div>
      <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] bg-[#dceafa] p-4 shadow-[inset_3px_3px_9px_#b8cbe5,inset_-3px_-3px_9px_#ffffff]">
        <span aria-hidden="true" className={`grid size-12 shrink-0 place-items-center rounded-full text-2xl text-[#1959e7] ${raised}`}>◎</span>
        <div><p className="text-sm font-semibold">Tu selección: {role} · {goal}</p><p className="mt-1 text-xs text-[#59759d]">No se guarda al salir.</p></div>
      </div>
    </section>
    <section className={`mt-6 rounded-[2rem] p-5 ${raised}`}>
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold">Mis dispositivos</h2><Link href="/demo/arbitro/fisico/dispositivos" className="text-sm font-semibold text-[#1259e6]">Ver guía ›</Link></div>
      <p className="mt-2 text-sm text-[#557099]">Conectá la cámara o buscá sensores Bluetooth compatibles.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link href="/demo/arbitro/fisico/dispositivos" className={`flex min-h-28 flex-col justify-center rounded-[1.5rem] p-3 ${raised}`}><span className="text-3xl" aria-hidden="true">⌚</span><strong className="mt-2 text-sm">Smartwatch y sensores</strong><small className="mt-1 text-[#557099]">Bluetooth compatible</small></Link>
        <Link href="/demo/arbitro/fisico/dispositivos" className={`flex min-h-28 flex-col justify-center rounded-[1.5rem] p-3 ${raised}`}><span className="text-3xl" aria-hidden="true">📷</span><strong className="mt-2 text-sm">Cámara</strong><small className="mt-1 text-[#557099]">Vista previa</small></Link>
      </div>
      <Link href="/demo/arbitro/fisico/dispositivos" className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#388fff] to-[#2851e9] px-4 text-center text-sm font-extrabold text-white shadow-[inset_0_2px_4px_#ffffff88,0_9px_18px_#3c73d45e]">ᛒ &nbsp; Conectar dispositivos &nbsp; ›</Link>
    </section>
    <p className="mt-5 text-center text-xs text-[#7186a4]">Vista de demostración · Sin datos guardados</p>
    <PhysicalNav/>
  </main>;
}