import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(path.join(process.cwd(), "public", "images", "logo.jpg"));
  const logoDataUri = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

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
          <img src={logoDataUri} width={72} height={72} alt="" />
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
