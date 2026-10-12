import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Formación arbitral", description: "Plataforma independiente en desarrollo" };
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1f16" },
  ],
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
