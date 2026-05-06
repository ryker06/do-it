"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { StateMark } from "@/lib/types";

const MARKS: {
  mark: StateMark;
  label: string;
  single: string;
  tint: string;
  dot: string;
}[] = [
  {
    mark: "clear",
    label: "Clear",
    single: "C",
    tint: "#E1ECFF",
    dot: "#007AFF",
  },
  {
    mark: "focused",
    label: "Focused",
    single: "F",
    tint: "#E2F4E6",
    dot: "#34C759",
  },
  {
    mark: "wired",
    label: "Wired",
    single: "W",
    tint: "#FFF3E0",
    dot: "#FF9500",
  },
  {
    mark: "drained",
    label: "Drained",
    single: "D",
    tint: "#F0F0F5",
    dot: "#8E8E93",
  },
  {
    mark: "heavy",
    label: "Heavy",
    single: "H",
    tint: "#FFE0E6",
    dot: "#FF6B6B",
  },
];

function fmt(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function weekDayLabel(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", { weekday: "short" });
}

function startOfWeek() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() - ((day + 6) % 7)); // Monday
  return d.getTime();
}

function daysOfWeek() {
  const mon = startOfWeek();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon + i * 86400_000);
    return {
      ts: d.getTime(),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });
}

export default function StatePage() {
  const { stateLog, addStateMark } = useDoIt();
  const [flash, setFlash] = useState<StateMark | null>(null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEntries = stateLog
    .filter((e) => e.ts >= todayStart.getTime())
    .sort((a, b) => b.ts - a.ts);

  const weekStart = startOfWeek();
  const weekEntries = stateLog.filter((e) => e.ts >= weekStart);

  function tap(mark: StateMark) {
    addStateMark(mark);
    setFlash(mark);
    setTimeout(() => setFlash(null), 1200);
  }

  const days = daysOfWeek();

  return (
    <>
      <Topbar name="State" sub="how you're running" />

      {/* Flash confirmation */}
      {flash && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 80,
            background: "rgba(18,18,24,0.88)",
            color: "#fff",
            borderRadius: 20,
            padding: "14px 28px",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            pointerEvents: "none",
          }}
        >
          {MARKS.find((m) => m.mark === flash)?.label} logged
        </div>
      )}

      <div style={{ paddingBottom: 110 }}>
        {/* Tap cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {MARKS.map((m) => (
            <button
              key={m.mark}
              onClick={() => tap(m.mark)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 4px",
                borderRadius: 18,
                background: m.tint,
                border: "none",
                cursor: "pointer",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.06), 0 2px 8px -4px rgba(20,20,30,0.10)",
                minHeight: 80,
                transition: "transform 0.12s ease",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: m.dot,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {m.single}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.01em",
                }}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>

        {/* Today's log */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 8,
            padding: "0 2px",
          }}
        >
          Today
        </div>
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 20,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
          }}
        >
          {todayEntries.length === 0 ? (
            <div
              style={{
                padding: "18px",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
              }}
            >
              Nothing logged yet — tap a state above.
            </div>
          ) : (
            todayEntries.map((e, i) => {
              const info = MARKS.find((m) => m.mark === e.mark);
              return (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 16px",
                    borderTop:
                      i > 0 ? "0.5px solid rgba(60,60,67,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: info?.dot ?? "#8E8E93",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.016em",
                      flex: 1,
                    }}
                  >
                    {info?.label ?? e.mark}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--label,#8E8E93)",
                      letterSpacing: "-0.005em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmt(e.ts)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* This-week density */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 8,
            padding: "0 2px",
          }}
        >
          This week
        </div>
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 20,
            padding: "16px",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
          }}
        >
          {/* day headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 8,
            }}
          >
            {days.map((d) => (
              <div
                key={d.ts}
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.06em",
                }}
              >
                {d.label.slice(0, 1)}
              </div>
            ))}
          </div>
          {/* dots per state per day */}
          {MARKS.map((m) => (
            <div
              key={m.mark}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 4,
                marginBottom: 4,
              }}
            >
              {days.map((d) => {
                const dayEnd = d.ts + 86400_000;
                const count = weekEntries.filter(
                  (e) => e.mark === m.mark && e.ts >= d.ts && e.ts < dayEnd,
                ).length;
                return (
                  <div
                    key={d.ts}
                    title={`${m.label} on ${weekDayLabel(d.ts)}: ${count}`}
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: count > 0 ? m.dot : "var(--inset,#F2F2F7)",
                      opacity: count > 0 ? Math.min(0.4 + count * 0.3, 1) : 1,
                      border: `0.5px solid ${count > 0 ? "transparent" : "rgba(60,60,67,0.08)"}`,
                    }}
                  />
                );
              })}
            </div>
          ))}
          {/* legend */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            {MARKS.map((m) => (
              <div
                key={m.mark}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: m.dot,
                    display: "block",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
