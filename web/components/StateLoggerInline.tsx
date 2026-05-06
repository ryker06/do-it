"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import type { StateMark } from "@/lib/types";

const MARKS: {
  mark: StateMark;
  label: string;
  dot: string;
  tint: string;
}[] = [
  { mark: "clear", label: "C", dot: "#007AFF", tint: "rgba(0,122,255,0.10)" },
  { mark: "focused", label: "F", dot: "#34C759", tint: "rgba(52,199,89,0.10)" },
  { mark: "wired", label: "W", dot: "#FF9500", tint: "rgba(255,149,0,0.10)" },
  {
    mark: "drained",
    label: "D",
    dot: "#8E8E93",
    tint: "rgba(142,142,147,0.10)",
  },
  { mark: "heavy", label: "H", dot: "#FF6B6B", tint: "rgba(255,107,107,0.10)" },
];

export function StateLoggerInline() {
  const { addStateMark } = useDoIt();
  const [flash, setFlash] = useState<StateMark | null>(null);

  function tap(mark: StateMark) {
    addStateMark(mark);
    setFlash(mark);
    setTimeout(() => setFlash(null), 900);
  }

  const flashInfo = flash ? MARKS.find((m) => m.mark === flash) : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 0 6px",
        position: "relative",
      }}
    >
      {flashInfo && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            color: flashInfo.dot,
            letterSpacing: "-0.01em",
            pointerEvents: "none",
            zIndex: 2,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 12,
            backdropFilter: "blur(4px)",
          }}
        >
          {flash} logged
        </div>
      )}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--label,#8E8E93)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        State
      </span>
      <div style={{ display: "flex", gap: 6, flex: 1 }}>
        {MARKS.map((m) => (
          <button
            key={m.mark}
            onClick={() => tap(m.mark)}
            title={m.mark}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 0",
              flex: 1,
              borderRadius: 10,
              background: m.tint,
              border: "none",
              cursor: "pointer",
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: m.dot,
                display: "block",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: m.dot,
                letterSpacing: "0.04em",
              }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
