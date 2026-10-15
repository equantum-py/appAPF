import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Plataforma Arbitral",
    short_name: "Arbitral",
    description: "Entrenamiento y preparación para árbitros de fútbol. Proyecto independiente.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071d2c",
    theme_color: "#071d2c",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
