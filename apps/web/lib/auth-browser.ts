import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const provider = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const apiBase = process.env.NEXT_PUBLIC_API_URL;
if (publishableKey && !publishableKey.startsWith("sb_publishable_")) {
  throw new Error("La configuración pública debe usar una clave publicable.");
}
let client: SupabaseClient | undefined;
export function authClient() {
  if (!provider || !publishableKey || !apiBase) return null;
  client ??= createBrowserClient(provider, publishableKey, {
    cookieOptions: { sameSite: "lax", secure: window.location.protocol === "https:" },
  });
  return client;
}

export async function apiRequest(path: string, token: string) {
  if (!apiBase) throw new Error("API no configurada.");
  return fetch(`${apiBase}${path}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
}
