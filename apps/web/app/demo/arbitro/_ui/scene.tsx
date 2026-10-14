/**
 * Escena ilustrada en lugar de una foto o un video: la demo no usa material
 * real. Dibuja un campo en perspectiva con los jugadores de la situación.
 */
export type SceneKind = "entrada" | "area" | "mano" | "fuera";

const players: Record<SceneKind, { x: number; y: number; team: "a" | "b" }[]> = {
  entrada: [
    { x: 150, y: 128, team: "a" },
    { x: 132, y: 136, team: "b" },
    { x: 220, y: 104, team: "b" },
    { x: 84, y: 112, team: "a" },
    { x: 262, y: 140, team: "a" },
  ],
  area: [
    { x: 172, y: 118, team: "a" },
    { x: 186, y: 120, team: "b" },
    { x: 120, y: 98, team: "b" },
    { x: 238, y: 100, team: "a" },
  ],
  mano: [
    { x: 160, y: 124, team: "b" },
    { x: 196, y: 116, team: "a" },
    { x: 106, y: 140, team: "a" },
    { x: 250, y: 132, team: "b" },
  ],
  fuera: [
    { x: 92, y: 126, team: "a" },
    { x: 196, y: 104, team: "a" },
    { x: 178, y: 112, team: "b" },
    { x: 150, y: 120, team: "b" },
    { x: 240, y: 98, team: "b" },
  ],
};

export function Scene({ kind, className = "" }: { kind: SceneKind; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="320" height="200" fill="#1e2a22" />
      <rect width="320" height="62" fill="#2a3530" />
      <g fill="#3a4a42">
        <rect x="0" y="40" width="320" height="22" />
      </g>
      <g fill="#e9e4d6" opacity="0.55">
        <rect x="46" y="10" width="3" height="34" />
        <rect x="38" y="6" width="19" height="7" rx="1" />
        <rect x="270" y="10" width="3" height="34" />
        <rect x="262" y="6" width="19" height="7" rx="1" />
      </g>
      {/* Césped con franjas de corte en perspectiva */}
      <path d="M0 62h320v138H0z" fill="#3f6b43" />
      <g fill="#4a7a4c">
        <path d="M0 62h46L0 120z" />
        <path d="M92 62h46L84 200H18z" />
        <path d="M184 62h46l60 138h-70z" />
        <path d="M276 62h44v70z" />
      </g>
      <g fill="none" stroke="#f3f1ea" strokeOpacity="0.75" strokeWidth="1.6">
        <path d="M-10 70h340" />
        <path d="M160 62 152 200" />
        <ellipse cx="156" cy="132" rx="58" ry="16" />
      </g>
      {players[kind].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <ellipse cx="0" cy="22" rx="7" ry="2" fill="#000" opacity="0.25" />
          <rect x="-4" y="9" width="8" height="12" rx="2" fill="#20262b" />
          <rect x="-5.5" y="-3" width="11" height="13" rx="3" fill={p.team === "a" ? "#e9e7e1" : "#b2402f"} />
          <circle cx="0" cy="-7" r="4" fill="#c69a7a" />
        </g>
      ))}
      <circle cx={players[kind][0].x + 12} cy={players[kind][0].y + 20} r="3" fill="#fff" />
    </svg>
  );
}
