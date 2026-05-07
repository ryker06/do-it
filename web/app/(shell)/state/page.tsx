"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { StateMark } from "@/lib/types";

// ── palette ───────────────────────────────────────────────────────────────────
const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";
const SHADOW_CHIP_LIFTED =
  "0 0 0 0.5px rgba(60,60,67,0.05),0 2px 4px rgba(20,20,30,0.05),0 14px 28px -14px rgba(20,20,30,0.16),0 1px 0 rgba(255,255,255,0.6) inset";
const SHADOW_PRESS_INK =
  "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)";
const HAIRLINE_SOFT = "rgba(60,60,67,0.06)";

// ── chip config ───────────────────────────────────────────────────────────────
type ChipConfig = {
  mark: StateMark;
  word: string;
  sub: string;
  glyph: string;
  bg: string;
  color: string;
  border?: string;
  yOffset: number;
  dotClass: "green" | "blue" | "pink" | "warm" | "heavy";
};

const CHIPS: ChipConfig[] = [
  {
    mark: "clear",
    word: "clear",
    sub: "light · sharp",
    glyph: "◐",
    bg: "linear-gradient(180deg,#EEF8EF 0%,#E2F4E6 100%)",
    color: "#1F5C2C",
    border: "inset 0 0 0 0.5px rgba(31,92,44,0.10)",
    yOffset: 0,
    dotClass: "green",
  },
  {
    mark: "focused",
    word: "focused",
    sub: "narrow · steady",
    glyph: "◉",
    bg: "linear-gradient(180deg,#F1F6FE 0%,#E2EEFF 100%)",
    color: "#0050C8",
    border: "inset 0 0 0 0.5px rgba(10,80,200,0.10)",
    yOffset: -4,
    dotClass: "blue",
  },
  {
    mark: "wired",
    word: "wired",
    sub: "over-edge",
    glyph: "⚡︎",
    bg: "linear-gradient(180deg,#FFF1F4 0%,#FFE7EC 100%)",
    color: "#7A2A3C",
    border: "inset 0 0 0 0.5px rgba(122,42,60,0.10)",
    yOffset: -2,
    dotClass: "pink",
  },
  {
    mark: "drained",
    word: "drained",
    sub: "slow burn",
    glyph: "○",
    bg: "linear-gradient(180deg,#FBFAF8 0%,#F1EFEA 100%)",
    color: "#1C1C1E",
    border: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
    yOffset: 2,
    dotClass: "warm",
  },
  {
    mark: "heavy",
    word: "heavy",
    sub: "hard carry",
    glyph: "▼",
    bg: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
    color: "#fff",
    yOffset: 0,
    dotClass: "heavy",
  },
];

// dot tint map for history list
const DOT_STYLE: Record<ChipConfig["dotClass"], { bg: string; ring: string }> =
  {
    green: { bg: "#2F7A40", ring: "#E2F4E6" },
    blue: { bg: "#0A84FF", ring: "#E2EEFF" },
    pink: { bg: "#7A2A3C", ring: "#FFE7EC" },
    warm: { bg: "#3A3A3C", ring: "#FBFAF8" },
    heavy: { bg: "#0B0B0F", ring: "#D8D8DC" },
  };

// seg bar color per mark
const SEG_BG: Record<StateMark, string> = {
  clear: "#E2F4E6",
  focused: "#E2EEFF",
  wired: "#FFE7EC",
  drained: "#EAE6E0",
  heavy: "#0B0B0F",
};

// pattern phrases (static — would be computed from actual log in production)
const PATTERNS = [
  {
    phrase: "you run clearer when you eat earlier.",
    marker: "green",
    meta: "8 of 12 clear days · trained before noon",
  },
  {
    phrase: "wired always follows heavy the next morning.",
    marker: "pink",
    meta: "6 of 7 occurrences · high caffeine days",
  },
  {
    phrase: "focused streaks last 3 days on average.",
    marker: "blue",
    meta: "avg 3.1 days · breaks on sat/sun",
  },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function startOfWeek(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

function weekDays(): { ts: number; label: string }[] {
  const mon = startOfWeek();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon + i * 86400000);
    return { ts: d.getTime(), label: ["M", "T", "W", "T", "F", "S", "S"][i] };
  });
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function StatePage() {
  const { stateLog, addStateMark } = useDoIt();
  const [flash, setFlash] = useState<StateMark | null>(null);
  const [selected, setSelected] = useState<StateMark | null>(null);

  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  })();
  const todayEntries = stateLog
    .filter((e) => e.ts >= todayStart)
    .sort((a, b) => b.ts - a.ts);

  const weekStart = startOfWeek();
  const weekEntries = stateLog.filter((e) => e.ts >= weekStart);
  const days = weekDays();

  function tap(mark: StateMark) {
    addStateMark(mark);
    setSelected(mark);
    setFlash(mark);
    setTimeout(() => setFlash(null), 1400);
  }

  return (
    <>
      <Topbar
        name="today is the lift."
        sub={`${todayEntries.length} log${todayEntries.length !== 1 ? "s" : ""} today`}
      />

      {/* logged toast */}
      {flash && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 80,
            background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
            color: "#fff",
            borderRadius: 20,
            padding: "14px 22px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: SHADOW_PRESS_INK,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#C7F0CF",
              color: "#1F5C2C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: "-0.012em",
              }}
            >
              {flash} logged.
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "#A8A8AC",
                marginTop: 1,
              }}
            >
              → pattern updates overnight.
            </div>
          </div>
        </div>
      )}

      {/* heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "2px 6px 16px",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
          }}
        >
          state.
        </div>
        <div style={{ fontSize: 11.5, color: "#8E8E93", fontWeight: 600 }}>
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>
            {todayEntries.length}
          </b>{" "}
          logs today
        </div>
      </div>

      {/* hero eyebrow */}
      <div
        style={{
          fontSize: 10.5,
          color: "#8E8E93",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 10,
          padding: "0 4px",
        }}
      >
        how are you running <b style={{ color: "#1C1C1E" }}>now</b>
      </div>

      {/* 2+2+1 chip grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {CHIPS.map((chip, idx) => {
          const isActive = selected === chip.mark;
          const isHeavy = chip.mark === "heavy";

          const boxShadow = isHeavy
            ? SHADOW_PRESS_INK
            : `${SHADOW_CHIP_LIFTED}${chip.border ? "," + chip.border : ""}`;

          return (
            <button
              key={chip.mark}
              onClick={() => tap(chip.mark)}
              style={{
                gridColumn: isHeavy ? "1 / -1" : undefined,
                borderRadius: 22,
                padding: "18px 16px 16px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                minHeight: isHeavy ? 108 : 104,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                boxShadow: isActive && !isHeavy ? SHADOW_PRESS_INK : boxShadow,
                background:
                  isActive && !isHeavy
                    ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
                    : chip.bg,
                border: "none",
                fontFamily: "inherit",
                transform: `translateY(${chip.yOffset}px)`,
                color: isActive && !isHeavy ? "#fff" : chip.color,
                transition: "background 0.15s ease",
              }}
            >
              {/* glyph top-right */}
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  fontSize: 18,
                  opacity: 0.6,
                  lineHeight: 1,
                }}
              >
                {chip.glyph}
              </span>

              {/* rotated "logged" chip on selected non-heavy */}
              {isActive && !isHeavy && idx === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "#C7F0CF",
                    color: "#1F5C2C",
                    padding: "5px 11px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "-0.005em",
                    transform: "rotate(-7deg)",
                  }}
                >
                  logged
                </div>
              )}

              <div
                style={{
                  fontSize: isHeavy ? 32 : 26,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  color: isActive && !isHeavy ? "#fff" : chip.color,
                }}
              >
                {chip.word}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  marginTop: 6,
                  opacity: 0.65,
                  color: isHeavy ? "#D8D8DC" : undefined,
                }}
              >
                {chip.sub}
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 10.5,
          color: "#8E8E93",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 18,
          letterSpacing: "-0.005em",
        }}
      >
        tap one above to log your current state
      </div>

      {/* today's history */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: "6px 16px",
          boxShadow: SHADOW_PAPER,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8E8E93",
            padding: "14px 0 10px",
          }}
        >
          today
        </div>
        {todayEntries.length === 0 ? (
          <div
            style={{
              padding: "8px 0 14px",
              fontSize: 14,
              fontWeight: 500,
              color: "#8E8E93",
            }}
          >
            nothing logged yet.
          </div>
        ) : (
          todayEntries.map((e, i) => {
            const chip = CHIPS.find((c) => c.mark === e.mark);
            const dotStyle = chip ? DOT_STYLE[chip.dotClass] : DOT_STYLE.warm;
            return (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "11px 0",
                  borderTop: i > 0 ? `0.5px solid ${HAIRLINE_SOFT}` : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#8E8E93",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    width: 54,
                    letterSpacing: "0.02em",
                    flexShrink: 0,
                  }}
                >
                  {fmtTime(e.ts)}
                </span>
                <span
                  style={{
                    fontSize: 14.5,
                    color: "#0B0B0F",
                    fontWeight: 700,
                    letterSpacing: "-0.012em",
                    flex: 1,
                  }}
                >
                  {e.mark}
                </span>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: dotStyle.bg,
                    boxShadow: `0 0 0 3px ${dotStyle.ring}`,
                    flexShrink: 0,
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* week density */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: 18,
          boxShadow: SHADOW_PAPER,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8E8E93",
            }}
          >
            this week
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1C1C1E",
              letterSpacing: "-0.005em",
            }}
          >
            <b style={{ color: "#0B0B0F", fontWeight: 800 }}>
              {weekEntries.length}
            </b>{" "}
            logs
          </span>
        </div>

        {/* per-day stacked seg bars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 6,
          }}
        >
          {days.map((day) => {
            const dayEnd = day.ts + 86400000;
            const dayLogs = weekEntries.filter(
              (e) => e.ts >= day.ts && e.ts < dayEnd,
            );
            const isToday =
              day.ts ===
              startOfWeek() + ((new Date().getDay() + 6) % 7) * 86400000;

            return (
              <div
                key={day.ts}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isToday ? "#0B0B0F" : "#8E8E93",
                  }}
                >
                  {day.label}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  {CHIPS.map((chip) => {
                    const count = dayLogs.filter(
                      (e) => e.mark === chip.mark,
                    ).length;
                    return (
                      <div
                        key={chip.mark}
                        style={{
                          height: 7,
                          borderRadius: 2.5,
                          background: count > 0 ? SEG_BG[chip.mark] : "#FBFAF8",
                          boxShadow:
                            count > 0
                              ? chip.mark === "heavy"
                                ? "none"
                                : `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`
                              : `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`,
                          opacity: count > 0 ? 1 : 0.5,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* pattern phrases */}
      <div style={{ padding: "0 4px", marginBottom: 14 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8E8E93",
            paddingBottom: 10,
          }}
        >
          patterns
        </div>
        {PATTERNS.map((p, i) => {
          const markerBg =
            p.marker === "green"
              ? "#C7F0CF"
              : p.marker === "blue"
                ? "#D7E6FF"
                : "#FFD9E0";

          return (
            <div
              key={i}
              style={{
                background: "#FFFFFF",
                borderRadius: 18,
                padding: "16px 18px",
                boxShadow: `inset 0 0 0 0.5px rgba(60,60,67,0.10)`,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 36,
                  borderRadius: 3,
                  background: markerBg,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: "#0B0B0F",
                    letterSpacing: "-0.012em",
                    lineHeight: 1.35,
                  }}
                >
                  {p.phrase}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8E8E93",
                    fontWeight: 500,
                    marginTop: 3,
                  }}
                >
                  {p.meta}
                </div>
              </div>
              <span style={{ color: "#8E8E93", fontSize: 14 }}>›</span>
            </div>
          );
        })}
      </div>

      <div style={{ height: 110 }} />
    </>
  );
}
