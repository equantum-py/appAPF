"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const items=[["Inicio","/demo/arbitro","⌂"],["Entrenar","/demo/arbitro/fisico/entrenar","◉"],["Progreso","/demo/arbitro/fisico/rendimiento","▥"],["Yo","/demo/arbitro/fisico/perfil","♙"]];
export default function PhysicalNav(){const pathname=usePathname();return <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-xl justify-around border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-5px_25px_#08243b12] backdrop-blur">{items.map(([label,url,icon])=>{const active=pathname===url;return <Link key={url} href={url} aria-current={active?"page":undefined} className={`flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold ${active?"text-[#087be9]":"text-slate-500"}`}><span aria-hidden="true" className="text-xl">{icon}</span>{label}</Link>})}</nav>}
