import { ImageResponse } from "next/og";

export const alt =
  "Sarthak Gupta. AI agents your security team will actually approve.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 90px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#9aa0a6",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 6,
              height: 28,
              background: "#D97757",
              borderRadius: 1,
            }}
          />
          <span>sarthak gupta</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              maxWidth: 1020,
              display: "flex",
            }}
          >
            I build AI agents your security team will actually approve.
          </div>
          <div
            style={{
              color: "#b6bcc4",
              fontSize: 32,
              lineHeight: 1.3,
              maxWidth: 980,
              display: "flex",
            }}
          >
            For US tech companies past Series A that need agents, not chatbots.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            color: "#7AB4E8",
            fontSize: 22,
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "#28c840" }}>$</span>
          <span style={{ color: "#e6e6ea" }}>scoped access</span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              background: "#3a3a48",
            }}
          />
          <span style={{ color: "#e6e6ea" }}>audit trail</span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              background: "#3a3a48",
            }}
          />
          <span style={{ color: "#e6e6ea" }}>human in the loop</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
