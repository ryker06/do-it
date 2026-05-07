"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

type Tab = "today" | "history";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function WorkoutsPage() {
  const { workouts, addWorkout, addWorkoutSet } = useDoIt();
  const [tab, setTab] = useState<Tab>("today");
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [echoes, setEchoes] = useState<Record<string, string>>({});

  const today = todayISO();
  const todayWorkout = workouts.find((w) => w.dateISO === today);

  function handleLogSet() {
    if (!exercise.trim() || !reps || !weight) return;
    let wo = workouts.find((w) => w.dateISO === today);
    if (!wo) {
      addWorkout({ dateISO: today, exercises: [] });
      wo = useDoIt.getState().workouts.find((w) => w.dateISO === today);
    }
    if (!wo) return;

    const exName = exercise.trim();
    let ex = wo.exercises.find(
      (e) => e.name.toLowerCase() === exName.toLowerCase(),
    );
    if (!ex) {
      const exId = `ex-${Date.now()}`;
      useDoIt.getState().addWorkout({
        dateISO: today,
        exercises: [...wo.exercises, { id: exId, name: exName, sets: [] }],
      });
      wo = useDoIt.getState().workouts.find((w) => w.dateISO === today);
      if (!wo) return;
      ex = wo.exercises.find(
        (e) => e.name.toLowerCase() === exName.toLowerCase(),
      );
    }
    if (!ex) return;

    addWorkoutSet(wo.id, ex.id, {
      reps: parseInt(reps),
      weightKg: parseFloat(weight),
      loggedAt: Date.now(),
    });

    const target = Math.round(parseFloat(weight) * 1.1);
    const key = `${wo.id}-${ex.id}`;
    setEchoes((p) => ({
      ...p,
      [key]: `${reps}×${weight}kg logged. → ${target}kg coming.`,
    }));
    setTimeout(() => setEchoes((p) => ({ ...p, [key]: "" })), 3000);
    setReps("");
    setWeight("");
  }

  // PRs: best set per exercise across all workouts
  const prMap: Record<
    string,
    { weightKg: number; reps: number; date: string }
  > = {};
  workouts.forEach((w) => {
    w.exercises.forEach((e) => {
      e.sets.forEach((s) => {
        const existing = prMap[e.name];
        if (!existing || s.weightKg > existing.weightKg) {
          prMap[e.name] = {
            weightKg: s.weightKg,
            reps: s.reps,
            date: w.dateISO,
          };
        }
      });
    });
  });

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
  );

  return (
    <>
      <Topbar
        name="the mountain doesn't care."
        sub="lift logged. → stronger coming."
      />

      {/* Ink-underline tab toggle — NOT frosted pill */}
      <div
        style={{
          display: "flex",
          gap: 0,
          padding: "0 0 0",
          borderBottom: "0.5px solid rgba(60,60,67,0.10)",
          marginBottom: 18,
          position: "relative",
        }}
      >
        {(["today", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0 14px",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              color: tab === t ? "#0B0B0F" : "#8E8E93",
              cursor: "pointer",
              position: "relative",
              background: "none",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            {t === "today" ? "today's lift" : "prs · history"}
            {tab === t && (
              <div
                style={{
                  position: "absolute",
                  left: "20%",
                  right: "20%",
                  bottom: -0.5,
                  height: 2,
                  background: "#0B0B0F",
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <div>
          {/* Today hero card */}
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(180deg,#E2F4E6 0%,#CDEBD3 100%)",
              borderRadius: 24,
              padding: "20px 20px 18px",
              marginBottom: 18,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18),0 36px 64px -32px rgba(20,20,30,0.18)",
            }}
          >
            {/* dot pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 22% 28%,rgba(255,255,255,0.55) 1.5px,transparent 2px),radial-gradient(circle at 70% 64%,rgba(255,255,255,0.40) 1.5px,transparent 2px)",
                backgroundSize: "18px 18px",
                opacity: 0.4,
                pointerEvents: "none",
              }}
            />
            {/* dumbbell glyph top-right */}
            <div
              style={{
                position: "absolute",
                right: -10,
                top: -6,
                width: 110,
                height: 110,
                opacity: 0.25,
                pointerEvents: "none",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                stroke="#1F5C2C"
                strokeWidth={1.4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18" />
                <path d="M6 8v8" />
                <path d="M18 8v8" />
                <path d="M2 10v4" />
                <path d="M22 10v4" />
              </svg>
            </div>

            <div
              style={{
                fontSize: 10.5,
                color: "#1F5C2C",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                position: "relative",
              }}
            >
              today
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#0B0B0F",
                lineHeight: 1.05,
                marginTop: 6,
                position: "relative",
              }}
            >
              {todayWorkout && todayWorkout.exercises.length > 0
                ? `${todayWorkout.exercises.length} exercise${todayWorkout.exercises.length !== 1 ? "s" : ""}`
                : "start lifting."}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#1F5C2C",
                fontWeight: 600,
                marginTop: 8,
                letterSpacing: "-0.005em",
                position: "relative",
              }}
            >
              {todayWorkout
                ? `${todayWorkout.exercises.reduce((a, e) => a + e.sets.length, 0)} sets logged`
                : "no sets yet · log below"}
            </div>
          </div>

          {/* Exercise cards from today's workout */}
          {todayWorkout && todayWorkout.exercises.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 14,
              }}
            >
              {todayWorkout.exercises.map((ex) => {
                const echoKey = `${todayWorkout.id}-${ex.id}`;
                const echo = echoes[echoKey];
                return (
                  <div
                    key={ex.id}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: "14px 16px",
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                    }}
                  >
                    {/* Exercise header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: "#FBFAF8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          lineHeight: 1,
                          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                          flexShrink: 0,
                        }}
                      >
                        🏋️
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#0B0B0F",
                            letterSpacing: "-0.012em",
                          }}
                        >
                          {ex.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#8E8E93",
                            fontWeight: 600,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {ex.sets.length} sets
                        </div>
                      </div>
                    </div>

                    {/* Echo line */}
                    {echo && (
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#6E6E73",
                          fontWeight: 600,
                          letterSpacing: "-0.005em",
                          marginBottom: 10,
                          lineHeight: 1.45,
                        }}
                      >
                        {echo.split("→").map((part, i) =>
                          i === 0 ? (
                            <span key={i}>{part}→ </span>
                          ) : (
                            <strong
                              key={i}
                              style={{ color: "#1F5C2C", fontWeight: 700 }}
                            >
                              {part}
                            </strong>
                          ),
                        )}
                      </div>
                    )}

                    {/* Sets table */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                      }}
                    >
                      {ex.sets.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "24px 1fr 1fr 28px",
                            gap: 10,
                            alignItems: "center",
                            padding: "9px 4px",
                            borderTop: "0.5px solid rgba(60,60,67,0.06)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "#8E8E93",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            style={{
                              fontSize: 14.5,
                              color: "#0B0B0F",
                              fontWeight: 700,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {s.reps}
                            <span
                              style={{
                                fontSize: 11,
                                color: "#8E8E93",
                                fontWeight: 600,
                                marginLeft: 3,
                              }}
                            >
                              reps
                            </span>
                          </span>
                          <span
                            style={{
                              fontSize: 14.5,
                              color: "#0B0B0F",
                              fontWeight: 700,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {s.weightKg}
                            <span
                              style={{
                                fontSize: 11,
                                color: "#8E8E93",
                                fontWeight: 600,
                                marginLeft: 3,
                              }}
                            >
                              kg
                            </span>
                          </span>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: "#C7F0CF",
                              color: "#1F5C2C",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 800,
                              boxShadow:
                                "inset 0 0 0 0.5px rgba(31,92,44,0.18)",
                            }}
                          >
                            ✓
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Log set form */}
          <div
            style={{
              background: "#FBFAF8",
              borderRadius: 14,
              padding: "14px 16px",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <input
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              placeholder="exercise"
              style={{
                flex: "2 1 120px",
                background: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "9px 11px",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#0B0B0F",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              }}
            />
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="reps"
              style={{
                flex: "1 1 60px",
                background: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "9px 11px",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#0B0B0F",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogSet()}
              placeholder="kg"
              style={{
                flex: "1 1 60px",
                background: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "9px 11px",
                fontSize: 13.5,
                fontWeight: 600,
                color: "#0B0B0F",
                fontFamily: "inherit",
                outline: "none",
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                fontVariantNumeric: "tabular-nums",
              }}
            />
            <button
              onClick={handleLogSet}
              style={{
                flex: "0 0 auto",
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
              }}
            >
              + set
            </button>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div>
          {/* PRs */}
          {Object.keys(prMap).length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                  marginBottom: 10,
                  paddingLeft: 4,
                }}
              >
                best lifts
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {Object.entries(prMap).map(([name, pr]) => (
                  <div
                    key={name}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: "16px 18px",
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background:
                          "linear-gradient(180deg,#FFD9E0 0%,#FFB6C5 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={18}
                        height={18}
                        stroke="#7A2A3C"
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12h18" />
                        <path d="M6 8v8" />
                        <path d="M18 8v8" />
                        <path d="M2 10v4" />
                        <path d="M22 10v4" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0B0B0F",
                          letterSpacing: "-0.012em",
                        }}
                      >
                        {name}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#6E6E73",
                          fontWeight: 600,
                          marginTop: 2,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {new Date(pr.date).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#0B0B0F",
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {pr.reps}×{pr.weightKg}kg
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent sessions */}
          {sortedWorkouts.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8E8E93",
                  marginBottom: 10,
                  paddingLeft: 4,
                }}
              >
                recent sessions
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sortedWorkouts.map((w) => (
                  <div
                    key={w.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "11px 4px",
                      borderBottom: "0.5px solid rgba(60,60,67,0.10)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#0B0B0F",
                          letterSpacing: "-0.012em",
                        }}
                      >
                        {new Date(w.dateISO).toLocaleDateString("en", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#6E6E73",
                          fontWeight: 600,
                          marginTop: 2,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {w.exercises.map((e) => e.name).join(", ") ||
                          "no exercises"}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#8E8E93",
                        fontWeight: 700,
                      }}
                    >
                      {w.exercises.reduce((a, e) => a + e.sets.length, 0)} sets
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workouts.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#8E8E93",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              no sessions yet. · start lifting.
            </div>
          )}
        </div>
      )}

      <div style={{ height: 110 }} />
    </>
  );
}
