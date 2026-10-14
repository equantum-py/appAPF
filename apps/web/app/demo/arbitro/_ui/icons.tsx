const paths = {
  inicio: "M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z",
  entrenar: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-2 5.5 6 3.5-6 3.5z",
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
