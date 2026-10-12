"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, authClient } from "../../../lib/auth-browser";

type Membership = { organization_id: string; name: string; kind: string; role: string };
const roles: Record<string, string> = {
  REFEREE: "Árbitro", INSTRUCTOR: "Instructor", REVIEWER: "Revisor", ADMIN: "Administrador",
};
export default function Account() {
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[] | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      const client = authClient();
      if (!client) { setMessage("El acceso está pendiente de configuración."); return; }
      // getSession only obtains a bearer; FastAPI verifies identity and permissions.
      const { data } = await client.auth.getSession();
      if (!data.session) { router.replace("/ingresar"); return; }
      try {
        const response = await apiRequest("/v1/me/memberships", data.session.access_token);
        if (!active) return;
        if (response.status === 401) { router.replace("/ingresar"); return; }
        if (response.status === 403) { setMessage("Tu usuario todavía no tiene acceso habilitado."); return; }
        if (!response.ok) { setMessage("No pudimos verificar tu acceso. Intentá nuevamente."); return; }
        setMemberships(await response.json());
      } catch { if (active) setMessage("No pudimos conectar con la plataforma."); }
    }
    void load();
    return () => { active = false; };
  }, [router]);
  async function leave() {
    const client = authClient();
    try { await client?.auth.signOut({ scope: "local" }); }
    finally { router.replace("/ingresar"); }
  }
  return <main className="access-page"><p className="eyebrow">Formación arbitral</p>
    <h1>Tu espacio</h1>
    <p role="status">{message || (memberships ? "Tu acceso fue verificado." : "Verificando tu acceso…")}</p>
    {memberships && <><ul className="membership-list">{memberships.map(item =>
      <li key={item.organization_id}><strong>{item.name}</strong><span>{roles[item.role] ?? "Integrante"}</span></li>)}</ul>
      {memberships.length === 0 && <p>No tenés espacios activos asignados.</p>}
      <p className="status">Los entrenamientos se habilitarán en próximas entregas.</p></>}
    <button type="button" onClick={leave}>Cerrar sesión</button></main>;
}
