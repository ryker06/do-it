"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

// Jar SVG illustration (simple inline)
function JarSvg() {
  return (
    <svg
      width={100}
      height={120}
      viewBox="0 0 100 120"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      {/* lid */}
      <rect
        x={20}
        y={8}
        width={60}
        height={14}
        rx={7}
        fill="rgba(122,42,60,0.22)"
      />
      <rect
        x={28}
        y={4}
        width={44}
        height={10}
        rx={5}
        fill="rgba(122,42,60,0.16)"
      />
      {/* jar body */}
      <rect
        x={14}
        y={22}
        width={72}
        height={82}
        rx={14}
        fill="rgba(255,255,255,0.55)"
        stroke="rgba(122,42,60,0.18)"
        strokeWidth={1.5}
      />
      {/* jar fill */}
      <rect
        x={18}
        y={58}
        width={64}
        height={42}
        rx={10}
        fill="rgba(122,42,60,0.12)"
      />
      {/* highlight */}
      <rect
        x={22}
        y={28}
        width={8}
        height={36}
        rx={4}
        fill="rgba(255,255,255,0.50)"
      />
      {/* cookie dots */}
      <circle cx={42} cy={72} r={5} fill="rgba(122,42,60,0.22)" />
      <circle cx={58} cy={80} r={4} fill="rgba(122,42,60,0.18)" />
      <circle cx={50} cy={65} r={3} fill="rgba(122,42,60,0.15)" />
    </svg>
  );
}

// Glyph icons
type GlyphKind = "flame" | "mountain" | "target" | "seed" | "peak";
const GLYPHS: GlyphKind[] = ["flame", "mountain", "target", "seed", "peak"];

function getGlyph(index: number): GlyphKind {
  return GLYPHS[index % GLYPHS.length];
}

const GLYPH_STYLE: Record<GlyphKind, { bg: string }> = {
  flame: { bg: "linear-gradient(180deg,#FFE7EC 0%,#FFD9E0 100%)" },
  mountain: { bg: "#F4F5F7" },
  seed: { bg: "#E2F4E6" },
  target: { bg: "#E2EEFF" },
  peak: { bg: "#E2EEFF" },
};

function GlyphIcon({ kind }: { kind: GlyphKind }) {
  const strokeColor =
    kind === "flame"
      ? "#7A2A3C"
      : kind === "seed"
        ? "#1F5C2C"
        : kind === "target" || kind === "peak"
          ? "#0050C8"
          : "#1C1C1E";

  if (kind === "flame") {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2c0 0-4 4-4 9a4 4 0 0 0 8 0c0-3-2-6-2-9z" />
        <path d="M12 15c0 0-2 1.5-2 3a2 2 0 0 0 4 0c0-1.5-2-3-2-3z" />
      </svg>
    );
  }
  if (kind === "mountain") {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 20l7-12 4 6 3-4 4 10" />
      </svg>
    );
  }
  if (kind === "target") {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx={12} cy={12} r={9} />
        <circle cx={12} cy={12} r={5} />
        <circle cx={12} cy={12} r={1.5} fill={strokeColor} stroke="none" />
      </svg>
    );
  }
  if (kind === "seed") {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22V12" />
        <path d="M12 12C12 6 6 4 4 8c3 1 7 2 8 4z" />
        <path d="M12 12c0-6 6-8 8-4-3 1-7 2-8 4z" />
      </svg>
    );
  }
  // peak
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 18 9 6 6 12 2 12" />
    </svg>
  );
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export default function CookieJarPage() {
  const { jar, addJarEntry, removeJarEntry } = useDoIt();
  const [newEntry, setNewEntry] = useState("");

  function handleAdd() {
    if (!newEntry.trim()) return;
    addJarEntry({ capturedAt: Date.now(), oneLine: newEntry.trim() });
    setNewEntry("");
  }

  const sorted = [...jar].sort((a, b) => b.capturedAt - a.capturedAt);

  return (
    <>
      <Topbar name="cookie jar." sub="proof you've done hard things." />

      {/* HERO opening card */}
      <div
        style={{
          position: "relative",
          background:
            "linear-gradient(165deg,#FFE7EC 0%,#FFD9E0 60%,#FFCED9 100%)",
          borderRadius: 26,
          padding: "24px 22px 22px",
          marginBottom: 18,
          boxShadow:
            "0 0 0 0.5px rgba(122,42,60,0.10),0 2px 3px rgba(122,42,60,0.05),0 24px 44px -20px rgba(122,42,60,0.30),0 40px 70px -36px rgba(122,42,60,0.18)",
          overflow: "hidden",
        }}
      >
        {/* dot texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 12% 22%,rgba(255,255,255,0.55) 1.5px,transparent 2px),radial-gradient(circle at 82% 70%,rgba(255,255,255,0.40) 1.5px,transparent 2px)",
            backgroundSize: "18px 18px",
            opacity: 0.45,
            pointerEvents: "none",
          }}
        />

        {/* Jar SVG — top right corner */}
        <div
          style={{
            position: "absolute",
            right: -10,
            top: 18,
            opacity: 0.9,
          }}
        >
          <JarSvg />
        </div>

        <div
          style={{
            fontSize: 10.5,
            color: "#7A2A3C",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            position: "relative",
            opacity: 0.85,
            marginBottom: 6,
          }}
        >
          cookie jar
        </div>

        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.032em",
            color: "#0B0B0F",
            lineHeight: 1.04,
            marginTop: 0,
            maxWidth: 230,
            position: "relative",
          }}
        >
          scroll. you&apos;ve already done harder.
        </h2>

        <div
          style={{
            fontSize: 13,
            color: "#1C1C1E",
            fontWeight: 600,
            letterSpacing: "-0.012em",
            marginTop: 14,
            position: "relative",
            lineHeight: 1.45,
          }}
        >
          <b
            style={{
              fontWeight: 800,
              color: "#0B0B0F",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {sorted.length}
          </b>{" "}
          {sorted.length === 1 ? "entry" : "entries"}.{" "}
          <span style={{ color: "#7A2A3C", fontWeight: 700 }}>→</span> keep
          stacking.
        </div>
      </div>

      {/* Auto-capture sketch — visual mock only */}
      {/* TODO: wire real auto-capture in NOW completion logic */}
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          borderRadius: 18,
          padding: "14px 16px",
          marginBottom: 14,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
          borderLeft: "3px solid #FFD9E0",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#7A2A3C",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          auto-capture
        </div>
        <div
          style={{
            fontSize: 13.5,
            color: "#1C1C1E",
            fontWeight: 500,
            lineHeight: 1.45,
            letterSpacing: "-0.005em",
          }}
        >
          you finished the 90-min zone 2 after pausing twice.{" "}
          <span style={{ color: "#7A2A3C", fontWeight: 700 }}>→</span> add to
          jar?
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => {
              addJarEntry({
                capturedAt: Date.now(),
                oneLine: "finished the 90-min zone 2 after pausing twice.",
              });
            }}
            style={{
              flex: 1,
              background: "linear-gradient(180deg,#1A1A20,#000)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: 10,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: "-0.005em",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
            }}
          >
            add
          </button>
          <button
            style={{
              flex: 1,
              background: "#FFFFFF",
              color: "#1C1C1E",
              border: "none",
              borderRadius: 12,
              padding: 10,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.18)",
              fontFamily: "inherit",
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
          >
            skip
          </button>
        </div>
      </div>

      {/* Jar entry list */}
      <div style={{ padding: "0 6px", marginBottom: 14 }}>
        {sorted.length === 0 && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#8E8E93",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            nothing yet · add something hard you finished
          </div>
        )}
        {sorted.map((entry, idx) => {
          const glyph = getGlyph(idx);
          const glyphStyle = GLYPH_STYLE[glyph];
          return (
            <div
              key={entry.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "14px 4px",
                borderBottom: "0.5px solid rgba(60,60,67,0.10)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: glyphStyle.bg,
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                  marginTop: 1,
                }}
              >
                <GlyphIcon kind={glyph} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    color: "#0B0B0F",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.4,
                  }}
                >
                  {entry.oneLine}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#8E8E93",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: 5,
                  }}
                >
                  {relativeTime(entry.capturedAt)}
                </div>
              </div>
              <button
                onClick={() => removeJarEntry(entry.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#8E8E93",
                  padding: "0 2px",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* + add to jar inline at bottom */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#FBFAF8",
          borderRadius: 14,
          padding: "8px 8px 8px 14px",
          marginBottom: 110,
          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
        }}
      >
        <input
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="what hard thing did you just finish?"
          style={{
            flex: 1,
            fontSize: 13.5,
            color: "#8E8E93",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!newEntry.trim()}
          style={{
            background: newEntry.trim()
              ? "linear-gradient(180deg,#1A1A20,#000)"
              : "#F4F5F7",
            color: newEntry.trim() ? "#fff" : "#8E8E93",
            border: "none",
            borderRadius: 10,
            padding: "8px 14px",
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            fontFamily: "inherit",
            cursor: newEntry.trim() ? "pointer" : "default",
            boxShadow: newEntry.trim()
              ? "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)"
              : "none",
          }}
        >
          + add
        </button>
      </div>
    </>
  );
}
