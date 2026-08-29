import { ImageResponse } from "next/og";

export const alt = "Lhasa — Where books find their next reader.";
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
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1b2e4b 0%, #223a5f 55%, #1b2e4b 100%)",
          color: "#faf8f3",
          fontFamily: "sans-serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: 2,
            opacity: 0.7,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Lohit district · Arunachal Pradesh
        </div>

        <div
          style={{
            fontSize: 128,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Lhasa Books
        </div>

        <div
          style={{
            fontSize: 40,
            marginTop: 24,
            opacity: 0.88,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Where books find their next reader.
        </div>

        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            padding: "16px 32px",
            background: "#c4603e",
            color: "white",
            borderRadius: 10,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          Buy &amp; sell used books · Zero fees
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 22,
            opacity: 0.6,
            letterSpacing: 1,
          }}
        >
          lhasabooks.com
        </div>
      </div>
    ),
    { ...size },
  );
}
