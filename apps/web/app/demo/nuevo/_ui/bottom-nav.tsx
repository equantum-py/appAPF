"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/demo/nuevo", label: "Inicio", icon: "inicio" },
  { href: "/demo/nuevo/entrenar", label: "Entrenar", icon: "entrenar" },
  { href: "/demo/nuevo/progreso", label: "Progreso", icon: "progreso" },
  { href: "/demo/nuevo/yo", label: "Yo", icon: "yo" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="rf-nav">
      {items.map((item) => {
        const active = item.href === "/demo/nuevo" ? path === item.href : path.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className="rf-nav-item">
            <Icon name={item.icon} filled={active} className="size-[22px]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
