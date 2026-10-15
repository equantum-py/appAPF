import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export function GET() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#071d2c", alignItems: "center", justifyContent: "center", color: "#42c9f4", fontFamily: "sans-serif", fontWeight: 800, fontSize: 69, letterSpacing: -8 }}>
      APF
    </div>,
    { width: 192, height: 192 }
  );
}
