"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

const WEEKS = 8;
const COLS = 7;

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

export default function HabitsPage() {
  const { habits, addHabit, markHabit } = useDoIt();
  const [newName, setNewName] = useState("");
  const [pressTimer, setPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const dates = getLast56Dates();
  const today = todayISO();

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

  function keptCount(habitId: string) {
    const habit = habits.find((h) => h.id === habitId);
    return (
      habit?.marks.filter((m) => m.status === "done" || m.status === "rested")
        .length ?? 0
    );
  }

  return (
    <div className="shell-content">
      <Topbar name="habits." sub="kept, not counted." />

      {/* add row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          background: "var(--card)",
          borderRadius: 16,
          boxShadow: "var(--shadow-stack)",
          marginBottom: 14,
        }}
      >
        <button
          onClick={handleAdd}
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--ink)",
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
          placeholder="new habit"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 14,
            color: "var(--ink)",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>

      {habits.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--label)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          no habits yet. · add one above.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {habits.map((habit) => {
            const todayMark = habit.marks.find((m) => m.dateISO === today);
            const kept = keptCount(habit.id);

            return (
              <div
                key={habit.id}
                style={{
                  position: "relative",
                  background: "var(--card)",
                  borderRadius: 20,
                  padding: "16px 16px 14px",
                  boxShadow: "var(--shadow-stack)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.022em",
                    marginBottom: 2,
                  }}
                >
                  {habit.name}
                </div>
                {habit.identity && (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--label-2)",
                      fontWeight: 500,
                      fontStyle: "italic",
                      marginBottom: 12,
                      lineHeight: 1.3,
                    }}
                  >
                    — {habit.identity}
                  </div>
                )}

                {/* 8×7 dot grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 5,
                    padding: "2px 0",
                    marginBottom: 10,
                  }}
                >
                  {dates.map((dateISO) => {
                    const mark = habit.marks.find((m) => m.dateISO === dateISO);
                    const isToday = dateISO === today;
                    const isFuture = dateISO > today;

                    let bg = "transparent";
                    let boxShadow = "inset 0 0 0 1px rgba(60,60,67,0.10)";

                    if (mark?.status === "done") {
                      bg = "var(--ink)";
                      boxShadow = "none";
                    } else if (mark?.status === "rested") {
                      bg = "var(--inset-2)";
                      boxShadow = "inset 0 0 0 0.5px var(--hairline)";
                    } else if (isToday) {
                      boxShadow =
                        "inset 0 0 0 1.5px var(--ink), 0 0 0 3px rgba(0,0,0,0.06)";
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
                          aspectRatio: "1",
                          borderRadius: 4,
                          background: bg,
                          boxShadow,
                          cursor: isToday ? "pointer" : "default",
                          opacity: isFuture ? 0.3 : 1,
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11.5,
                      color: "var(--label-2)",
                      fontWeight: 600,
                    }}
                  >
                    <strong style={{ color: "var(--ink-2)" }}>{kept}</strong> of{" "}
                    {WEEKS * COLS} kept
                  </span>
                  {!todayMark ? (
                    <button
                      onClick={() => markHabit(habit.id, "done")}
                      style={{
                        fontSize: 11.5,
                        color: "var(--ink)",
                        fontWeight: 700,
                        background: "var(--inset)",
                        padding: "5px 11px",
                        borderRadius: 999,
                        boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
                        fontFamily: "inherit",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      mark today
                    </button>
                  ) : (
                    <span
                      style={{
                        fontSize: 11.5,
                        color:
                          todayMark.status === "done"
                            ? "var(--green-deep)"
                            : "var(--label-2)",
                        fontWeight: 700,
                      }}
                    >
                      {todayMark.status === "done" ? "done." : "rested."}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
