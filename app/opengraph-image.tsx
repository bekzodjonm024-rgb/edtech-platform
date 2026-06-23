import { ImageResponse } from "next/og";

// Branded social-share card, auto-wired into openGraph + twitter for all routes.
export const runtime = "edge";
export const alt = "EduAI OS — Bitta mavzudan to'liq o'quv ekotizimi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #2a1d6b 60%, #7c5cff 140%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "#7c5cff",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            E
          </div>
          <div style={{ display: "flex", fontSize: "36px", fontWeight: 700 }}>EduAI OS</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", fontSize: "68px", fontWeight: 800, lineHeight: 1.1 }}>
            {"Bitta mavzudan to'liq o'quv ekotizimi"}
          </div>
          <div style={{ display: "flex", fontSize: "30px", color: "#c7d2fe" }}>
            {"AI ma'ruza · taqdimot · test · insho — oliy ta'lim uchun"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
