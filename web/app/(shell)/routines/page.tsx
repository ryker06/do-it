"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId, Routine, Weekday } from "@/lib/types";

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

// Routine color token → CSS value
const RAIL: Record<string, string> = {
  weekday: "#0A0A0F",
  recovery: "#7C8FA0",
  friday: "#5E8A6E",
  sunday: "#94707F",
};

function getRailColor(color?: string): string {
  return color ? (RAIL[color] ?? "#8E8E93") : "#8E8E93";
}

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

// Domain tint gradients matching canon
const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

export default function RoutinesPage() {
  const router = useRouter();
  const { routines, weekAssignments } = useDoIt();

  // Count how many days have an assignment
  const assignedCount = Object.values(weekAssignments).filter(Boolean).length;

  // Today's weekday index (0=Mon … 6=Sun)
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7; // JS Sunday=0 → shift so Mon=0

  // Today's date number (day of month)
  const todayDate = today.getDate();

  // Compute date numbers for Mon–Sun of current week
  const weekDates: number[] = WEEKDAY_KEYS.map((_, i) => {
    const diff = i - todayIdx;
    const d = new Date(today);
    d.setDate(todayDate + diff);
    return d.getDate();
  });

  // For each weekday, find which routine(s) are assigned
  // A day can appear in multiple routines → stack pills
  function getRoutinesForDay(dayIdx: number): Routine[] {
    const key = WEEKDAY_KEYS[dayIdx];
    const assigned = weekAssignments[key];
    if (!assigned) return [];
    // Primary assignment
    const primary = routines.find((r) => r.id === assigned);
    const result: Routine[] = primary ? [primary] : [];
    // Overlay: any other routine whose days list includes this weekday
    for (const r of routines) {
      if (r.id !== assigned && r.days.includes(key)) {
        result.push(r);
      }
    }
    return result;
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => router.push("/settings")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--blue,#007AFF)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.018em",
            padding: "6px 6px 6px 2px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 11 18"
            width={11}
            height={18}
            fill="none"
            stroke="var(--blue,#007AFF)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 1L2 9l7 8" />
          </svg>
          Settings
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            transform: "translateX(-6px)",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Routines
          </div>
          <div
            style={{
              fontSize: 15.5,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.022em",
            }}
          >
            Your week
          </div>
        </div>
        <button
          onClick={() => router.push("/routines/new")}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(180deg,#1C1C1E 0%, #0A0A0F 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 0 0 0.5px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 10px -4px rgba(20,20,30,0.45)",
          }}
          aria-label="New routine"
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="#fff"
            strokeWidth={2.6}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* scroll */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 2px 110px",
          margin: "0 -2px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* THIS WEEK card */}
        <div
          style={{
            background: "var(--card,#fff)",
            borderRadius: 22,
            padding: "16px 14px 14px",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 12px 28px -14px rgba(20,20,30,0.10), 0 26px 50px -28px rgba(20,20,30,0.14)",
            position: "relative",
            margin: "2px 0 18px",
          }}
        >
          {/* inset border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          {/* head */}
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
                color: "var(--label,#8E8E93)",
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
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.005em",
              }}
            >
              tap a day to reassign ·{" "}
              <strong
                style={{
                  color: "var(--ink-2,#1C1C1E)",
                  fontWeight: 700,
                }}
              >
                {assignedCount} of 7
              </strong>{" "}
              set
            </span>
          </div>

          {/* week strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 5,
            }}
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
                  {/* day chip */}
                  <button
                    onClick={() => {
                      // Navigate to day assignment — for now a no-op placeholder
                    }}
                    style={{
                      height: 42,
                      borderRadius: 12,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      background: hasAssignment
                        ? "#0A0A0F"
                        : "var(--inset,#F2F2F7)",
                      boxShadow: isToday
                        ? hasAssignment
                          ? "0 0 0 1.5px var(--blue,#007AFF), inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 10px -6px rgba(20,20,30,0.30)"
                          : "0 0 0 1.5px var(--blue,#007AFF), 0 1px 2px rgba(0,122,255,0.18)"
                        : hasAssignment
                          ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 2px rgba(20,20,30,0.16), 0 4px 10px -6px rgba(20,20,30,0.30)"
                          : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: hasAssignment
                          ? "#fff"
                          : "var(--label-2,#6E6E73)",
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
                          : "var(--label,#8E8E93)",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(weekDates[i]).padStart(2, "0")}
                    </div>
                  </button>

                  {/* routine pill(s) */}
                  {dayRoutines.length === 0 ? (
                    <div
                      style={{
                        height: 18,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 5px",
                        background: "transparent",
                        boxShadow:
                          "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 500,
                          color: "var(--label,#8E8E93)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        + set
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
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
                            background: "var(--inset,#F2F2F7)",
                            boxShadow:
                              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                            overflow: "hidden",
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              flexShrink: 0,
                              background: getRailColor(r.color),
                            }}
                          />
                          <span
                            style={{
                              fontSize: 8.5,
                              fontWeight: 700,
                              color: "var(--ink-2,#1C1C1E)",
                              letterSpacing: "0.01em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.color === "friday"
                              ? "Fri pm"
                              : r.name.slice(0, 5)}
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

        {/* section eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 6px",
            margin: "6px 0 12px",
          }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Routines
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: "var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "var(--label-2,#6E6E73)",
              fontWeight: 600,
              letterSpacing: "-0.005em",
            }}
          >
            {routines.length} templates
          </span>
        </div>

        {/* routine cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            margin: "0 2px",
          }}
        >
          {routines.map((r) => {
            const totalMin = r.blocks.reduce((s, b) => s + b.durationMin, 0);
            const railColor = getRailColor(r.color);
            const domains = getUniqueDomains(r);
            const isUnassigned = !Object.values(weekAssignments).includes(r.id);

            return (
              <button
                key={r.id}
                onClick={() => router.push(`/routines/${r.id}`)}
                style={{
                  background: "var(--card,#fff)",
                  borderRadius: 20,
                  padding: "14px 14px 13px",
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {/* inset border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                    pointerEvents: "none",
                  }}
                />
                {/* color rail */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 14,
                    bottom: 14,
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    background: railColor,
                  }}
                />

                {/* top row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 11,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--ink,#000)",
                        letterSpacing: "-0.024em",
                        lineHeight: 1.15,
                      }}
                    >
                      {r.name}
                      {r.color === "friday" && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--label,#8E8E93)",
                            letterSpacing: "-0.005em",
                            marginLeft: 4,
                          }}
                        >
                          · evening overlay
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "var(--label-2,#6E6E73)",
                        letterSpacing: "-0.005em",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span>
                        <strong
                          style={{
                            color: "var(--ink-2,#1C1C1E)",
                            fontWeight: 700,
                          }}
                        >
                          {r.blocks.length}
                        </strong>{" "}
                        blocks
                      </span>
                      <span
                        style={{
                          color: "rgba(60,60,67,0.28)",
                          fontWeight: 600,
                        }}
                      >
                        ·
                      </span>
                      <span>{fmtDuration(totalMin)}</span>
                      {isUnassigned && (
                        <>
                          <span
                            style={{
                              color: "rgba(60,60,67,0.28)",
                              fontWeight: 600,
                            }}
                          >
                            ·
                          </span>
                          <span
                            style={{
                              color: "var(--label,#8E8E93)",
                              fontWeight: 500,
                            }}
                          >
                            unassigned this week
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* chevron */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "var(--inset,#F2F2F7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow:
                        "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={9}
                      height={14}
                      fill="none"
                      stroke="var(--label-2,#6E6E73)"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>

                {/* identity line */}
                {r.identity && (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--label-2,#6E6E73)",
                      fontWeight: 500,
                      fontStyle: "italic",
                      letterSpacing: "-0.005em",
                      marginBottom: 10,
                    }}
                  >
                    — {r.identity}
                  </div>
                )}

                {/* 8-week dot grid — 8 cols × up to 4 rows (32 days) */}
                {(() => {
                  const TOTAL = 32;
                  const todayDotIdx = TOTAL - 1;
                  // For seed data, fill dots based on days array (simulate kept pattern)
                  // In production this would derive from actual block history
                  const dots = Array.from({ length: TOTAL }, (_, i) => {
                    // today = last dot
                    if (i === todayDotIdx) return "today";
                    // simulate: if this weekday matches routine days, mark done
                    const dayOffset = todayDotIdx - i;
                    const weekdayIdx =
                      (today.getDay() - 1 + 7 - (dayOffset % 7) + 7) % 7;
                    const key = WEEKDAY_KEYS[weekdayIdx];
                    if (!key) return "empty";
                    if (r.days.includes(key)) return "done";
                    return "empty";
                  });
                  const keptCount = dots.filter((d) => d === "done").length;
                  return (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(8,1fr)",
                          gap: 5,
                          padding: "2px 0",
                          marginBottom: 8,
                        }}
                      >
                        {dots.map((state, i) => (
                          <div
                            key={i}
                            style={{
                              aspectRatio: "1",
                              borderRadius: 4,
                              background:
                                state === "done"
                                  ? "var(--ink,#0A0A0F)"
                                  : state === "today"
                                    ? "transparent"
                                    : "transparent",
                              boxShadow:
                                state === "done"
                                  ? "none"
                                  : state === "today"
                                    ? "inset 0 0 0 1.5px var(--ink,#0A0A0F), 0 0 0 3px rgba(0,0,0,0.06)"
                                    : "inset 0 0 0 1px var(--hairline-2,rgba(60,60,67,0.06))",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--label-2,#6E6E73)",
                          fontWeight: 600,
                          marginBottom: 10,
                        }}
                      >
                        <strong style={{ color: "var(--ink-2,#1C1C1E)" }}>
                          {keptCount} of {TOTAL} kept
                        </strong>{" "}
                        · last 8 weeks
                      </div>
                    </>
                  );
                })()}

                {/* bottom row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  {/* day badges */}
                  <div style={{ display: "flex", gap: 3 }}>
                    {WEEKDAY_KEYS.map((key, i) => {
                      const on = r.days.includes(key);
                      return (
                        <span
                          key={key}
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: on ? "#fff" : "var(--label-2,#6E6E73)",
                            letterSpacing: "0.04em",
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            background: on ? railColor : "var(--inset,#F2F2F7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: on
                              ? "none"
                              : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
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
                            "inset 0 0 0 0.5px rgba(20,20,30,0.06), 0 1px 2px rgba(20,20,30,0.04), 0 0 0 1.5px #fff",
                          marginLeft: di === 0 ? 0 : -5,
                        }}
                      >
                        <DomainGlyph id={domId} size={10} />
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* new routine row */}
        <button
          onClick={() => router.push("/routines/new")}
          style={{
            margin: "14px 2px 0",
            height: 60,
            borderRadius: 18,
            border: "1px dashed var(--hairline-strong,rgba(60,60,67,0.18))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            background: "transparent",
            cursor: "pointer",
            width: "calc(100% - 4px)",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline-strong,rgba(60,60,67,0.18))",
              color: "var(--ink-2,#1C1C1E)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
            }}
          >
            New routine
          </span>
        </button>
      </div>
    </div>
  );
}
