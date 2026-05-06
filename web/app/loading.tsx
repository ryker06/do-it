"use client";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        zIndex: 9999,
      }}
    >
      {/* ambient halo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 760,
          height: 760,
          transform: "translate(-50%, -58%)",
          background:
            "radial-gradient(closest-side, rgba(0,122,255,0.08) 0%, rgba(0,122,255,0.025) 38%, transparent 68%), radial-gradient(closest-side at 60% 40%, rgba(180,210,255,0.22) 0%, transparent 55%)",
          pointerEvents: "none",
          animation: "breathe 5.5s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes breathe {
          0%,100%{opacity:0.85;transform:translate(-50%,-58%) scale(1);}
          50%{opacity:1;transform:translate(-50%,-58%) scale(1.04);}
        }
        @keyframes float {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-6px);}
        }
        @keyframes shimmer {
          0%{background-position:120% 0;}
          100%{background-position:-120% 0;}
        }
        @keyframes fadein { to { opacity:1; } }
      `}</style>

      {/* version chip */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--label,#8E8E93)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: "rgba(255,255,255,0.7)",
          padding: "6px 12px",
          borderRadius: 999,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 1px rgba(20,20,30,0.03)",
          backdropFilter: "saturate(180%) blur(10px)",
          WebkitBackdropFilter: "saturate(180%) blur(10px)",
          zIndex: 2,
          opacity: 0,
          animation: "fadein 1.2s ease 0.1s forwards",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--green,#34C759)",
            boxShadow: "0 0 0 3px rgba(52,199,89,0.14)",
          }}
        />
        Good morning
      </div>

      {/* orb + wordmark */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: -60,
        }}
      >
        <div
          style={{
            width: 208,
            height: 208,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 22%, transparent 45%), radial-gradient(circle at 50% 60%, #DCEAFC 0%, #C5DCF7 60%, #ABCAF0 100%)",
            boxShadow:
              "inset 0 -10px 30px rgba(60,90,140,0.18), inset 0 2px 0 rgba(255,255,255,0.9), 0 30px 60px -20px rgba(60,90,140,0.30), 0 10px 30px -10px rgba(60,90,140,0.18)",
            animation: "float 5.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            marginTop: 54,
            fontSize: 56,
            fontWeight: 800,
            color: "var(--ink,#000)",
            letterSpacing: "-0.058em",
            lineHeight: 0.95,
            textAlign: "center",
          }}
        >
          Do It<span style={{ color: "var(--blue,#007AFF)" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 16,
            fontWeight: 500,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "-0.018em",
            textAlign: "center",
          }}
        >
          One thing at a time.
        </div>
      </div>

      {/* loading shimmer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 42,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            background:
              "linear-gradient(90deg, rgba(142,142,147,0.55) 0%, rgba(142,142,147,0.55) 35%, #1C1C1E 50%, rgba(142,142,147,0.55) 65%, rgba(142,142,147,0.55) 100%)",
            backgroundSize: "240% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "shimmer 2.4s linear infinite",
          }}
        >
          LOADING YOUR DAY
        </span>
        <div
          style={{
            width: 134,
            height: 5,
            borderRadius: 99,
            background: "rgba(0,0,0,0.85)",
          }}
        />
      </div>
    </div>
  );
}
