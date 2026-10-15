"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {label:"Inicio",url:"/demo/arbitro",icon:"⌂"},
  {label:"Entrenar",url:"/demo/arbitro/fisico/entrenar",icon:"◴"},
  {label:"Progreso",url:"/demo/arbitro/fisico/rendimiento",icon:"▥"},
  {label:"Yo",url:"/demo/arbitro/fisico/perfil",icon:"♟"},
];
export default function PhysicalNav(){
  const pathname=usePathname();
  return <nav aria-label="Navegación principal" className="fixed inset-x-3 bottom-[max(env(safe-area-inset-bottom),10px)] z-40 mx-auto flex max-w-lg items-center justify-between rounded-[2.5rem] border border-white/90 bg-[#f5f9ff]/95 px-2 py-2 shadow-[0_12px_35px_#08243b30,inset_0_2px_4px_#ffffff] backdrop-blur-xl">
    {items.slice(0,2).map(({label,url,icon})=><Link key={url} href={url} aria-current={pathname===url?"page":undefined} className={`flex min-h-14 min-w-12 flex-col items-center justify-center rounded-full px-2 text-[11px] font-semibold ${pathname===url?"bg-[#dcecff] text-[#1757dc]":"text-[#7187aa]"}`}><span aria-hidden="true" className="text-xl">{icon}</span>{label}</Link>)}
    <Link href="/demo/arbitro/fisico/sesion-ejemplo" aria-label="Comenzar entrenamiento" className="mx-1 grid size-16 shrink-0 -translate-y-4 place-items-center rounded-full border-[5px] border-[#f5f9ff] bg-gradient-to-b from-[#5ec8ff] to-[#214bf0] text-2xl text-white shadow-[inset_0_3px_5px_#ffffff80,0_8px_18px_#315be380]">▶</Link>
    {items.slice(2).map(({label,url,icon})=><Link key={url} href={url} aria-current={pathname===url?"page":undefined} className={`flex min-h-14 min-w-12 flex-col items-center justify-center rounded-full px-2 text-[11px] font-semibold ${pathname===url?"bg-[#dcecff] text-[#1757dc]":"text-[#7187aa]"}`}><span aria-hidden="true" className="text-xl">{icon}</span>{label}</Link>)}
  </nav>;
}