"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph } from "@/components/icons";
import type { DomainId, Routine, Weekday } from "@/lib/types";

// ── constants ─────────────────────────────────────────────────────────────────
const WEEKDAY_KEYS: Weekday[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];
const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";
const SHADOW_CHIP =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset";
const HAIRLINE = "rgba(60,60,67,0.10)";
const HAIRLINE_SOFT = "rgba(60,60,67,0.06)";

// domain background gradients
const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%,#FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%,#CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%,#FFE0B2 100%)",
};

// cover tile gradient by routine color token
const COVER_GRAD: Record<string, string> = {
  green: "linear-gradient(180deg,#EEF8EF,#E2F4E6)",
  pink: "linear-gradient(180deg,#FFF1F4,#FFE7EC)",
  blue: "linear-gradient(180deg,#F1F6FE,#E2EEFF)",
  warm: "linear-gradient(180deg,#FFF6E8,#FFE9CC)",
  default: "linear-gradient(180deg,#FFF1F4,#FFE7EC)",
};

function coverGrad(color?: string): string {
  return COVER_GRAD[color ?? ""] ?? COVER_GRAD.default;
}

// ── helpers ───────────────────────────────────────────────────────────────────
function fmtDuration(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getUniqueDomains(routine: Routine): DomainId[] {
  const seen = new Set<DomainId>();
  const out: DomainId[] = [];
  for (const b of routine.blocks) {
    if (!seen.has(b.domain)) {
      seen.add(b.domain);
      out.push(b.domain);
    }
  }
  return out;
}

// Derive cadence phrase from the cadence object
function cadencePhrase(r: Routine): string {
  if (r.cadenceDescription) return r.cadenceDescription;
  if (r.cadence) {
    const c = r.cadence;
    if (c.kind === "weekly") {
      const days = c.days.map((d) => d.toLowerCase().slice(0, 3)).join(" · ");
      const totalMin = r.blocks.reduce((s, b) => s + b.durationMin, 0);
      return `${days} · ${fmtDuration(totalMin)}`;
    }
    if (c.kind === "biweekly") {
      const days = c.days.map((d) => d.toLowerCase().slice(0, 3)).join(" · ");
      return `${days} · biweekly`;
    }
    if (c.kind === "monthlyWeeks") {
      const days = c.days.map((d) => d.toLowerCase().slice(0, 3)).join(" · ");
      const wks = c.weeks.join(" + ");
      return `${days} · weeks ${wks}`;
    }
    if (c.kind === "monthlyDays") {
      return `days ${c.days.join(", ")} of month`;
    }
    if (c.kind === "interval") {
      return `every ${c.everyDays} days`;
    }
  }
  // Fallback: derive from legacy days
  if (r.days.length > 0) {
    const days = r.days.map((d) => d.toLowerCase().slice(0, 3)).join(" · ");
    const totalMin = r.blocks.reduce((s, b) => s + b.durationMin, 0);
    return `${days} · ${fmtDuration(totalMin)}`;
  }
  return "custom cadence";
}

// Build the 8×7 = 56-dot grid data (8 cols of 7 days each, newest col rightmost)
// Row 0 = Mon ... Row 6 = Sun; Col 7 (rightmost) = this week
function build56Grid(
  r: Routine,
): ("kept" | "kept-pink" | "miss" | "rest" | "today" | "today-empty")[] {
  const today = new Date();
  const todayDOW = (today.getDay() + 6) % 7; // Mon=0 ... Sun=6
  // 56 slots: slot 0 = 55 days ago, slot 55 = today
  return Array.from({ length: 56 }, (_, i) => {
    const daysAgo = 55 - i;
    if (daysAgo === 0) {
      // Today
      const d = new Date(today);
      const dow = (d.getDay() + 6) % 7;
      const key = WEEKDAY_KEYS[dow];
      const isRoutineDay = r.days.includes(key);
      return isRoutineDay ? "today" : "today-empty";
    }
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const dow = (d.getDay() + 6) % 7;
    const key = WEEKDAY_KEYS[dow];
    if (!r.days.includes(key)) {
      // non-routine day = rest for Sat/Sun if not in days, miss otherwise
      return dow >= 5 && !r.days.includes(key) ? "rest" : "miss";
    }
    // Simulate: most routine days kept (in real production derives from history)
    // Use deterministic pattern based on day-of-year
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000,
    );
    const kept = dayOfYear % 5 !== 0; // miss 1 in 5
    if (r.color === "sunday" || r.color === "friday") {
      return kept ? "kept-pink" : "miss";
    }
    return kept ? "kept" : "miss";
  });
}

// ── dot cell ──────────────────────────────────────────────────────────────────
function DotCell({
  state,
}: {
  state: "kept" | "kept-pink" | "miss" | "rest" | "today" | "today-empty";
}) {
  let bg = "transparent";
  let shadow = `inset 0 0 0 0.5px ${HAIRLINE}`;

  if (state === "kept") {
    bg = "linear-gradient(180deg,#E2F4E6,#C7F0CF)";
    shadow = "inset 0 0 0 0.5px rgba(31,92,44,0.10)";
  } else if (state === "kept-pink") {
    bg = "linear-gradient(180deg,#FFE7EC,#FFD9E0)";
    shadow = "inset 0 0 0 0.5px rgba(122,42,60,0.10)";
  } else if (state === "rest") {
    bg = "#FBFAF8";
    shadow = `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`;
  } else if (state === "today") {
    bg = "linear-gradient(180deg,#E2F4E6,#C7F0CF)";
    shadow = "0 0 0 1.5px #0B0B0F,0 0 0 3px rgba(11,11,15,0.10)";
  } else if (state === "today-empty") {
    bg = "transparent";
    shadow = "0 0 0 1.5px #0B0B0F,0 0 0 3px rgba(11,11,15,0.10)";
  }

  return (
    <div
      style={{
        aspectRatio: "1",
        borderRadius: 3,
        background: bg,
        boxShadow: shadow,
      }}
    />
  );
}

// ── streak pill ───────────────────────────────────────────────────────────────
function StreakPill({ phrase, color }: { phrase?: string; color?: string }) {
  if (!phrase) return null;
  let bg = "#C7F0CF";
  let textColor = "#1F5C2C";

  if (color === "friday" || color === "sunday") {
    bg = "#FFE7EC";
    textColor = "#7A2A3C";
  } else if (color === "recovery") {
    bg = "#FBFAF8";
    textColor = "#1C1C1E";
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: bg,
        color: textColor,
        padding: "5px 11px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: "-0.005em",
        boxShadow: SHADOW_CHIP,
      }}
    >
      {phrase}
    </div>
  );
}

// ── routine card ──────────────────────────────────────────────────────────────
function RoutineCard({ r, onClick }: { r: Routine; onClick: () => void }) {
  const domains = getUniqueDomains(r);
  const dots = build56Grid(r);
  const keptCount = dots.filter(
    (d) => d === "kept" || d === "kept-pink" || d === "today",
  ).length;
  const phrase = cadencePhrase(r);
  const coverEmoji = r.coverImage?.kind === "emoji" ? r.coverImage.value : "🏋︎";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "18px 18px 16px",
        boxShadow: SHADOW_PAPER,
        marginBottom: 14,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* cover emoji tile — top right */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 42,
          height: 42,
          borderRadius: 14,
          background: coverGrad(r.color),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          lineHeight: 1,
          boxShadow: `inset 0 0 0 0.5px ${HAIRLINE},0 1px 2px rgba(20,20,30,0.04)`,
        }}
      >
        {coverEmoji}
        {/* edit pencil */}
        <div
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#0B0B0F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 8,
            fontWeight: 700,
            boxShadow: "0 0 0 1.5px #FFFFFF",
          }}
        >
          ✎
        </div>
      </div>

      {/* identity — display 18/800 */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          color: "#0B0B0F",
          lineHeight: 1.2,
          paddingRight: 54,
        }}
      >
        {r.identity ?? r.name}
      </div>

      {/* cadence phrase */}
      <div
        style={{
          fontSize: 13,
          color: "#6E6E73",
          fontWeight: 500,
          letterSpacing: "-0.005em",
          marginTop: 6,
          lineHeight: 1.4,
        }}
      >
        {phrase}
      </div>

      {/* 8-week × 7-day kept-dot grid (8 cols × 7 rows = 56 dots) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8,1fr)",
          gridAutoRows: 11,
          gap: 3,
          marginTop: 14,
          padding: "10px 0 8px",
        }}
      >
        {dots.map((state, i) => (
          <DotCell key={i} state={state} />
        ))}
      </div>

      {/* foot: streak pill + last kept + day badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 6,
          paddingTop: 10,
          borderTop: `0.5px solid ${HAIRLINE_SOFT}`,
        }}
      >
        <StreakPill phrase={r.streakPhrase} color={r.color} />

        <span
          style={{
            fontSize: 11.5,
            color: "#8E8E93",
            fontWeight: 500,
            marginLeft: "auto",
          }}
        >
          {keptCount} of 56 kept
        </span>
      </div>

      {/* day badges row */}
      <div
        style={{
          display: "flex",
          gap: 3,
          marginTop: 8,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 3 }}>
          {WEEKDAY_KEYS.map((key, i) => {
            const on = r.days.includes(key);
            return (
              <span
                key={key}
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: on ? "#fff" : "#6E6E73",
                  letterSpacing: "0.04em",
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: on ? "#0B0B0F" : "#F4F5F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: on ? "none" : `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`,
                }}
              >
                {WEEKDAY_LETTERS[i]}
              </span>
            );
          })}
        </div>

        {/* domain dot strip */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {domains.map((domId, di) => (
            <div
              key={domId}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background: DOMAIN_BG[domId],
                boxShadow:
                  "inset 0 0 0 0.5px rgba(20,20,30,0.06),0 1px 2px rgba(20,20,30,0.04),0 0 0 1.5px #fff",
                marginLeft: di === 0 ? 0 : -5,
              }}
            >
              <DomainGlyph id={domId} size={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function RoutinesPage() {
  const router = useRouter();
  const { routines, weekAssignments } = useDoIt();

  const assignedCount = Object.values(weekAssignments).filter(Boolean).length;
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const todayDate = today.getDate();

  const weekDates: number[] = WEEKDAY_KEYS.map((_, i) => {
    const diff = i - todayIdx;
    const d = new Date(today);
    d.setDate(todayDate + diff);
    return d.getDate();
  });

  function getRoutinesForDay(dayIdx: number): Routine[] {
    const key = WEEKDAY_KEYS[dayIdx];
    const assigned = weekAssignments[key];
    if (!assigned) return [];
    const primary = routines.find((r) => r.id === assigned);
    const result: Routine[] = primary ? [primary] : [];
    for (const r of routines) {
      if (r.id !== assigned && r.days.includes(key)) result.push(r);
    }
    return result;
  }

  return (
    <>
      <Topbar
        name="show up. that's the move."
        sub={`${routines.length} routines · ${assignedCount} of 7 days set`}
      />

      {/* heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
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
          routines.
        </div>
        <div style={{ fontSize: 11.5, color: "#8E8E93", fontWeight: 600 }}>
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>{routines.length}</b>{" "}
          running
        </div>
      </div>

      {/* THIS WEEK card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 22,
          padding: "16px 14px 14px",
          boxShadow: SHADOW_PAPER,
          position: "relative",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            padding: "0 4px",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#8E8E93",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            This week
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "#6E6E73",
              letterSpacing: "-0.005em",
            }}
          >
            tap a day to reassign ·{" "}
            <strong style={{ color: "#1C1C1E", fontWeight: 700 }}>
              {assignedCount} of 7
            </strong>{" "}
            set
          </span>
        </div>

        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 5 }}
        >
          {WEEKDAY_KEYS.map((key, i) => {
            const isToday = i === todayIdx;
            const dayRoutines = getRoutinesForDay(i);
            const hasAssignment = dayRoutines.length > 0;

            return (
              <div
                key={key}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <button
                  onClick={() => {}}
                  style={{
                    height: 42,
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    background: hasAssignment ? "#0A0A0F" : "#F4F5F7",
                    boxShadow: isToday
                      ? hasAssignment
                        ? "0 0 0 1.5px #0A84FF,inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "0 0 0 1.5px #0A84FF"
                      : hasAssignment
                        ? "inset 0 1px 0 rgba(255,255,255,0.06),0 1px 2px rgba(20,20,30,0.16)"
                        : `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: hasAssignment ? "#fff" : "#6E6E73",
                      letterSpacing: "0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {WEEKDAY_LETTERS[i]}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: hasAssignment
                        ? "rgba(255,255,255,0.55)"
                        : "#8E8E93",
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(weekDates[i]).padStart(2, "0")}
                  </div>
                </button>

                {dayRoutines.length === 0 ? (
                  <div
                    style={{
                      height: 18,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 8.5,
                        fontWeight: 500,
                        color: "#8E8E93",
                      }}
                    >
                      + set
                    </span>
                  </div>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {dayRoutines.map((r) => (
                      <div
                        key={r.id}
                        style={{
                          height: 18,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          padding: "0 5px",
                          background: "#F4F5F7",
                          boxShadow: `inset 0 0 0 0.5px ${HAIRLINE_SOFT}`,
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: "#0B0B0F",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 8.5,
                            fontWeight: 700,
                            color: "#1C1C1E",
                            letterSpacing: "0.01em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.name.slice(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* routine cards */}
      {routines.map((r) => (
        <RoutineCard
          key={r.id}
          r={r}
          onClick={() => router.push(`/routines/${r.id}`)}
        />
      ))}

      {/* + routine pill */}
      <button
        onClick={() => router.push("/routines/new")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "#FBFAF8",
          borderRadius: 14,
          padding: 14,
          margin: "0 0 110px",
          boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
          fontSize: 14,
          fontWeight: 600,
          color: "#1C1C1E",
          letterSpacing: "-0.005em",
          cursor: "pointer",
          border: "none",
          width: "100%",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#0B0B0F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +
        </span>
        routine
      </button>
    </>
  );
}
