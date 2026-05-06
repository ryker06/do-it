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
  const [echo, setEcho] = useState<string | null>(null);

  const today = todayISO();
  const todayWorkout = workouts.find((w) => w.dateISO === today);

  function ensureTodayWorkout() {
    if (!todayWorkout) {
      addWorkout({ dateISO: today, exercises: [] });
    }
    return workouts.find((w) => w.dateISO === today) ?? todayWorkout;
  }

  function handleLogSet() {
    if (!exercise.trim() || !reps || !weight) return;
    let wo = workouts.find((w) => w.dateISO === today);
    if (!wo) {
      addWorkout({ dateISO: today, exercises: [] });
      // store is sync via zustand — re-read
      wo = useDoIt.getState().workouts.find((w) => w.dateISO === today);
    }
    if (!wo) return;

    const exName = exercise.trim();
    let ex = wo.exercises.find(
      (e) => e.name.toLowerCase() === exName.toLowerCase(),
    );
    if (!ex) {
      // add new exercise inline via addWorkoutSet path — need exercise id
      const exId = `ex-${Date.now()}`;
      // We'll use addWorkout to get a fresh workout with the exercise
      useDoIt.getState().addWorkout({
        dateISO: today,
        exercises: [...wo.exercises, { id: exId, name: exName, sets: [] }],
      });
      ex = { id: exId, name: exName, sets: [] };
    }

    addWorkoutSet(wo.id, ex.id, {
      reps: parseInt(reps),
      weightKg: parseFloat(weight),
      loggedAt: Date.now(),
    });

    const target = parseFloat(weight) * 1.1;
    setEcho(`logged ${reps}×${weight}kg. → ${Math.round(target)}kg coming.`);
    setReps("");
    setWeight("");
    setTimeout(() => setEcho(null), 3000);
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

  return (
    <div className="shell-content">
      <Topbar name="workouts." sub="lift logged. → stronger coming." />

      {/* Tab toggle */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 18,
          background: "var(--inset)",
          padding: 4,
          borderRadius: 14,
          boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
        }}
      >
        {(["today", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 10,
              border: "none",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.012em",
              cursor: "pointer",
              background: tab === t ? "var(--card)" : "transparent",
              color: tab === t ? "var(--ink)" : "var(--label)",
              boxShadow: tab === t ? "var(--shadow-stack)" : "none",
              transition: "background 160ms cubic-bezier(.32,.72,0,1)",
            }}
          >
            {t === "today" ? "today's lift" : "prs · history"}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <div>
          {/* Log set form */}
          <div
            style={{
              background: "var(--card)",
              borderRadius: 20,
              padding: "16px",
              boxShadow: "var(--shadow-stack)",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--label)",
                marginBottom: 12,
              }}
            >
              log a set
            </div>
            <input
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              placeholder="exercise name"
              style={{
                width: "100%",
                background: "var(--inset)",
                border: "none",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--ink)",
                fontFamily: "inherit",
                outline: "none",
                marginBottom: 8,
                boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="reps"
                style={{
                  flex: 1,
                  background: "var(--inset)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  outline: "none",
                  boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="kg"
                style={{
                  flex: 1,
                  background: "var(--inset)",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                  fontFamily: "inherit",
                  outline: "none",
                  boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
                  fontVariantNumeric: "tabular-nums",
                }}
              />
            </div>
            <button
              onClick={handleLogSet}
              style={{
                width: "100%",
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "13px 0",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 12px 24px -14px rgba(10,10,20,0.45)",
              }}
            >
              log set
            </button>
            {echo && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--label)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  marginTop: 10,
                }}
              >
                {echo}
              </div>
            )}
          </div>

          {/* Today's sets */}
          {todayWorkout && todayWorkout.exercises.length > 0 ? (
            <div
              style={{
                background: "var(--card)",
                borderRadius: 20,
                padding: "16px",
                boxShadow: "var(--shadow-stack)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--label)",
                  marginBottom: 12,
                }}
              >
                today
              </div>
              {todayWorkout.exercises.map((ex) => (
                <div key={ex.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.018em",
                      marginBottom: 6,
                    }}
                  >
                    {ex.name}
                  </div>
                  {ex.sets.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px 0",
                        borderBottom: "0.5px solid var(--hairline-2)",
                        fontSize: 13,
                        color: "var(--ink-2)",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span>set {i + 1}</span>
                      <span>
                        {s.reps} × {s.weightKg}kg
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--label)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              nothing logged yet. · start above.
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div>
          {/* PRs */}
          {Object.keys(prMap).length > 0 && (
            <div
              style={{
                background: "var(--card)",
                borderRadius: 20,
                padding: "16px",
                boxShadow: "var(--shadow-stack)",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--label)",
                  marginBottom: 12,
                }}
              >
                best lifts
              </div>
              {Object.entries(prMap).map(([name, pr]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "9px 0",
                    borderBottom: "0.5px solid var(--hairline-2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--ink)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {pr.reps} × {pr.weightKg}kg
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Recent sessions */}
          {[...workouts]
            .sort(
              (a, b) =>
                new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
            )
            .map((w) => (
              <div
                key={w.id}
                style={{
                  background: "var(--card)",
                  borderRadius: 18,
                  padding: "14px 16px",
                  boxShadow: "var(--shadow-stack)",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--label-2)",
                    letterSpacing: "-0.005em",
                    marginBottom: 6,
                  }}
                >
                  {new Date(w.dateISO).toLocaleDateString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {w.exercises.map((e) => (
                  <div
                    key={e.id}
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      fontWeight: 600,
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {e.name} · {e.sets.length} sets
                  </div>
                ))}
                {w.notes && (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--label)",
                      fontStyle: "italic",
                      marginTop: 6,
                    }}
                  >
                    {w.notes}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
