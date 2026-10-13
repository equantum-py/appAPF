"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../../../lib/auth-browser";

export default function SignIn() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const client = authClient();
    if (!client) {
      setMessage("El acceso está pendiente de configuración.");
      return;
    }
    setBusy(true);
    setMessage("");
    const data = new FormData(form);
    try {
      const { error } = await client.auth.signInWithPassword({
        email: String(data.get("email") ?? ""), password: String(data.get("password") ?? ""),
      });
      if (error) setMessage("No pudimos ingresar. Revisá tu correo y contraseña.");
      else router.replace("/app");
    } catch {
      setMessage("No pudimos conectar. Intentá nuevamente.");
    } finally {
      const password = form.elements.namedItem("password");
      if (password instanceof HTMLInputElement) password.value = "";
      setBusy(false);
    }
  }
  return <main className="access-page"><p className="eyebrow">Formación arbitral</p>
    <h1>Ingresá a tu cuenta</h1><p>Accedé con el usuario habilitado para vos.</p>
    <form onSubmit={submit} className="access-form">
      <label htmlFor="email">Correo electrónico</label>
      <input id="email" name="email" type="email" autoComplete="username" required />
      <label htmlFor="password">Contraseña</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={busy}>{busy ? "Ingresando…" : "Ingresar"}</button>
    </form><p role="status" aria-live="polite">{message}</p>
    <footer>Proyecto independiente de eQuantum.</footer></main>;
}
