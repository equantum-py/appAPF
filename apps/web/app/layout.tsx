import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import PwaRegister from "./pwa-register";
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
export const metadata: Metadata = { title: "Formación arbitral", description: "Plataforma independiente en desarrollo", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, title: "Arbitral", statusBarStyle: "black-translucent" } };
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1f16" },
  ],
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={archivo.variable}><body>{children}<PwaRegister /></body></html>;
}
