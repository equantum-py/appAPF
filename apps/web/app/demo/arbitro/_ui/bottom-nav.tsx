"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/demo/arbitro", label: "Inicio", icon: "inicio" },
  { href: "/demo/arbitro/entrenar", label: "Entrenar", icon: "entrenar" },
  { href: "/demo/arbitro/progreso", label: "Progreso", icon: "progreso" },
  { href: "/demo/arbitro/yo", label: "Yo", icon: "yo" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="rf-nav">
      {items.map((item) => {
        const active = item.href === "/demo/arbitro" ? path === "/demo/arbitro" : path.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="rf-nav-item">
            <Icon name={path === "/demo/arbitro" && item.icon === "entrenar" ? "videoentrenar" : item.icon} filled={active} className="size-[22px]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
