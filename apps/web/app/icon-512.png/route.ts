import { ImageResponse } from "next/og";
import { createElement } from "react";

export const runtime = "nodejs";
export function GET() {
  return new ImageResponse(
    createElement("div", { style: { display: "flex", width: "100%", height: "100%", background: "#071d2c", alignItems: "center", justifyContent: "center", color: "#42c9f4", fontFamily: "sans-serif", fontWeight: 800, fontSize: 184, letterSpacing: -8 } }, "APF"),
    { width: 512, height: 512 }
  );
}
