import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b3552 0%, #072238 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 9999,
              border: "3px solid #c79a3d",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#c79a3d",
            }}
          >
            CV
          </div>
          <div style={{ fontSize: 24, letterSpacing: 4, color: "#c79a3d" }}>EST. 1926</div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, marginTop: 40, maxWidth: 900 }}>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 20, color: "#e7c988" }}>
          {site.address.locality}, {site.address.region}, {site.address.state}
        </div>
      </div>
    ),
    { ...size }
  );
}
