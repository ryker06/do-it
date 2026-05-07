"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

const WEEKS = 8;
const COLS = 7; // days per week

function getLast56Dates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = WEEKS * COLS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function HabitsPage() {
  const { habits, addHabit, markHabit } = useDoIt();
  const [newName, setNewName] = useState("");
  const [pressTimer, setPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const dates = getLast56Dates();
  const today = todayISO();
  const weekDates = getWeekDates();

  function handleAdd() {
    if (!newName.trim()) return;
    addHabit({ name: newName.trim() });
    setNewName("");
  }

  function handleDotTap(habitId: string, dateISO: string) {
    if (dateISO !== today) return;
    const habit = habits.find((h) => h.id === habitId);
    const todayMark = habit?.marks.find((m) => m.dateISO === today);
    if (todayMark?.status === "done") return;
    markHabit(habitId, "done");
  }

  function handleDotLongPressStart(habitId: string, dateISO: string) {
    if (dateISO !== today) return;
    const t = setTimeout(() => {
      markHabit(habitId, "rested");
    }, 320);
    setPressTimer(t);
  }

  function handleDotLongPressEnd() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  }

  // This-week summary
  const totalHabitsThisWeek = habits.length * 7;
  const keptThisWeek = habits.reduce((acc, h) => {
    return (
      acc +
      weekDates.filter((d) => {
        const m = h.marks.find((mk) => mk.dateISO === d);
        return m?.status === "done" || m?.status === "rested";
      }).length
    );
  }, 0);

  const summaryPhrase =
    habits.length === 0
      ? "no habits yet."
      : totalHabitsThisWeek > 0
        ? `${keptThisWeek} of ${totalHabitsThisWeek} kept this week.`
        : "add habits to track.";

  return (
    <>
      <Topbar
        name="you become what you repeat."
        sub={`${habits.length} live · 8w view`}
      />

      {/* Heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "2px 6px 14px",
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
          habits.
        </div>
        <div style={{ fontSize: 11.5, color: "#8E8E93", fontWeight: 600 }}>
          <strong style={{ color: "#1C1C1E" }}>{habits.length}</strong> live ·
          8w view
        </div>
      </div>

      {/* + habit inline strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#FBFAF8",
          borderRadius: 14,
          padding: "10px 14px",
          margin: "0 4px 16px",
          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
        }}
      >
        <button
          onClick={handleAdd}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#0B0B0F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1,
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          +
        </button>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="habit · name + identity"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 13.5,
            color: "#1C1C1E",
            fontWeight: 600,
            fontFamily: "inherit",
            outline: "none",
            letterSpacing: "-0.005em",
          }}
        />
      </div>

      {habits.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 32px",
            textAlign: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 36,
              background: "linear-gradient(180deg,#E2F4E6 0%,#EEF8EF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 54,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
            }}
          >
            🌱
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "#0B0B0F",
              marginTop: 14,
            }}
          >
            one habit. that's the start.
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#6E6E73",
              fontWeight: 500,
              letterSpacing: "-0.005em",
              lineHeight: 1.5,
              maxWidth: 260,
            }}
          >
            pick the smallest move you'll do daily. compounding does the rest.
          </div>
        </div>
      ) : (
        <>
          {/* Hero "this week" panel */}
          <div
            style={{
              background: "linear-gradient(180deg,#FBFAF8 0%,#fff 60%)",
              borderRadius: 24,
              padding: "18px 18px 16px",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18),0 36px 64px -32px rgba(20,20,30,0.18)",
              position: "relative",
              overflow: "hidden",
              margin: "0 4px 18px",
            }}
          >
            {/* rotated chip */}
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "#C7F0CF",
                color: "#1F5C2C",
                padding: "7px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "-0.005em",
                transform: "rotate(-7deg)",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset",
                zIndex: 2,
              }}
            >
              on rhythm
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  color: "#8E8E93",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                this week · mon → sun
              </div>
            </div>

            {/* 7-day cells */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7,1fr)",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {weekDates.map((d, i) => {
                const isToday = d === today;
                const isFuture = d > today;
                // aggregate across all habits
                const allKept = habits.every((h) => {
                  const m = h.marks.find((mk) => mk.dateISO === d);
                  return m?.status === "done" || m?.status === "rested";
                });
                const anyKept = habits.some((h) => {
                  const m = h.marks.find((mk) => mk.dateISO === d);
                  return m?.status === "done" || m?.status === "rested";
                });

                let bg = "transparent";
                let boxShadow = "inset 0 0 0 1px rgba(60,60,67,0.10)";
                let color = "#8E8E93";

                if (isToday) {
                  bg = "#0B0B0F";
                  boxShadow =
                    "0 0 0 3px rgba(11,11,15,0.10),0 6px 14px -8px rgba(11,11,15,0.40)";
                  color = "#fff";
                } else if (!isFuture && allKept) {
                  bg = "linear-gradient(180deg,#E2F4E6,#C7F0CF)";
                  boxShadow = "inset 0 0 0 0.5px rgba(31,92,44,0.12)";
                  color = "#1F5C2C";
                } else if (!isFuture && anyKept) {
                  bg = "linear-gradient(180deg,#E2F4E6,#C7F0CF)";
                  boxShadow = "inset 0 0 0 0.5px rgba(31,92,44,0.12)";
                  color = "#1F5C2C";
                }

                return (
                  <div
                    key={d}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bg,
                      boxShadow,
                      opacity: isFuture ? 0.35 : 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color,
                      }}
                    >
                      {DAY_LABELS[i]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary phrase */}
            <div
              style={{
                fontSize: 13.5,
                color: "#1C1C1E",
                fontWeight: 600,
                letterSpacing: "-0.005em",
                lineHeight: 1.45,
              }}
            >
              <strong style={{ fontWeight: 800, color: "#0B0B0F" }}>
                {summaryPhrase}
              </strong>
              <span
                style={{ color: "#8E8E93", fontWeight: 600, margin: "0 4px" }}
              >
                →
              </span>
              <span style={{ color: "#1F5C2C", fontWeight: 700 }}>solid.</span>
            </div>
          </div>

          {/* Habit rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {habits.map((habit) => {
              const todayMark = habit.marks.find((m) => m.dateISO === today);

              return (
                <div
                  key={habit.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "14px 6px",
                    borderBottom: "0.5px solid rgba(60,60,67,0.06)",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background:
                        "linear-gradient(180deg,#EEF8EF 0%,#E2F4E6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      lineHeight: 1,
                      boxShadow:
                        "inset 0 0 0 0.5px rgba(60,60,67,0.10),0 1px 2px rgba(20,20,30,0.04)",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      if (!todayMark) markHabit(habit.id, "done");
                    }}
                  >
                    {todayMark?.status === "done"
                      ? "✓"
                      : todayMark?.status === "rested"
                        ? "~"
                        : "·"}
                  </div>

                  {/* Body */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        letterSpacing: "-0.012em",
                        color: "#0B0B0F",
                        lineHeight: 1.2,
                      }}
                    >
                      {habit.name}
                    </div>
                    {habit.identity && (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#6E6E73",
                          fontWeight: 500,
                          letterSpacing: "-0.005em",
                          marginTop: 3,
                          lineHeight: 1.35,
                        }}
                      >
                        {habit.identity}
                      </div>
                    )}
                  </div>

                  {/* 8×7 dot grid — cols=weeks (oldest left), rows=days of week */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(8, 8px)",
                      gridTemplateRows: "repeat(7, 8px)",
                      gap: 3,
                      flexShrink: 0,
                    }}
                  >
                    {dates.map((dateISO) => {
                      const mark = habit.marks.find(
                        (m) => m.dateISO === dateISO,
                      );
                      const isToday = dateISO === today;
                      const isFuture = dateISO > today;

                      let bg = "transparent";
                      let boxShadow = "inset 0 0 0 0.5px rgba(60,60,67,0.10)";

                      if (mark?.status === "done") {
                        bg = "linear-gradient(180deg,#E2F4E6,#C7F0CF)";
                        boxShadow = "inset 0 0 0 0.5px rgba(31,92,44,0.10)";
                      } else if (mark?.status === "rested") {
                        bg = "#EEF8EF";
                        boxShadow = "inset 0 0 0 0.5px rgba(31,92,44,0.08)";
                      } else if (isToday) {
                        bg = "transparent";
                        boxShadow =
                          "0 0 0 1.5px #0B0B0F,0 0 0 3px rgba(11,11,15,0.10)";
                      }

                      return (
                        <div
                          key={dateISO}
                          onClick={() => handleDotTap(habit.id, dateISO)}
                          onPointerDown={() =>
                            handleDotLongPressStart(habit.id, dateISO)
                          }
                          onPointerUp={handleDotLongPressEnd}
                          onPointerLeave={handleDotLongPressEnd}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2.5,
                            background: bg,
                            boxShadow,
                            cursor: isToday ? "pointer" : "default",
                            opacity: isFuture ? 0.25 : 1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ height: 110 }} />
    </>
  );
}
