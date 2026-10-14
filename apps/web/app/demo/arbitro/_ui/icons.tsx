const paths = {
  correr: "M15 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4M8 10l3-3 4 1 2 4h4M11 7l-2 6 5 3-2 6m-3-9-3 5H2",
  silbato: "M10 8h11v4h-7a6 6 0 1 1-4-4zm-2 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4M13 5V2m-4 4L7 3m10 3 2-3",
  libro: "M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2zm0 0v15",
  lista: "M9 4H5v18h14V4h-4M9 2h6v4H9zm-1 8h8m-8 4h8m-8 4h5",
  inicio: "M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z",
  entrenar: "M10 8h11v4h-7a6 6 0 1 1-4-4zm-2 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4M13 5V2m-4 4L7 3m10 3 2-3",
  progreso: "M5 20v-7h3v7zm5.5 0V9h3v11zM16 20V4h3v16z",
  yo: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 9.5c4.4 0 8 2.2 8 5V20H4v-1.5c0-2.8 3.6-5 8-5z",
  campana: "M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2.5 15a2.5 2.5 0 0 0 5 0",
  play: "M8 5.5v13l10.5-6.5z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-6", filled = true }: { name: IconName; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d={paths[name]}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fillRule="evenodd"
      />
    </svg>
  );
}
