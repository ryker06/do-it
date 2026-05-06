"use client";

import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function getWeekDates(): { day: string; dateISO: string; label: string }[] {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dow + 6) % 7));
  return DAYS.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day,
      dateISO: d.toISOString().slice(0, 10),
      label: d.getDate().toString(),
    };
  });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function WeekPage() {
  const { blocks, goals, visions } = useDoIt();
  const weekDates = getWeekDates();
  const today = todayISO();

  // Compounder: per-goal phrase
  const compounders = goals.slice(0, 2).map((g) => {
    const pct = Math.round((g.currentValue / g.targetValue) * 100);
    const vision = visions.find((v) => v.id === g.visionId);
    const weeksLeft = Math.max(
      0,
      Math.round(
        (new Date(g.deadlineISO).getTime() - Date.now()) / (7 * 86400_000),
      ),
    );
    return {
      id: g.id,
      line: `${vision?.title ?? g.identityLine ?? "goal"}: ${g.currentValue}${g.unit} → ${g.targetValue}${g.unit} · ${weeksLeft}w left`,
      pct,
    };
  });

  return (
    <div className="shell-content">
      <Topbar name="week." sub="the full arc." />

      {/* Compounder strip */}
      {compounders.length > 0 && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 20,
            padding: "14px 16px",
            marginBottom: 18,
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
              marginBottom: 10,
            }}
          >
            compounding
          </div>
          {compounders.map((c) => (
            <div
              key={c.id}
              style={{
                fontSize: 13,
                color: "var(--ink-2)",
                fontWeight: 500,
                letterSpacing: "-0.012em",
                lineHeight: 1.4,
                padding: "6px 0",
                borderBottom: "0.5px solid var(--hairline-2)",
              }}
            >
              {c.line}
            </div>
          ))}
        </div>
      )}

      {/* 7-day strip */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {weekDates.map(({ day, dateISO, label }) => {
          const isToday = dateISO === today;
          const dayBlocks = blocks.filter((b) =>
            b.scheduledFor === "today" && isToday
              ? true
              : b.scheduledFor === dateISO,
          );
          const todayBlocks = isToday
            ? blocks.filter((b) => b.scheduledFor === "today")
            : dayBlocks;
          const doneCount = todayBlocks.filter(
            (b) => b.status === "done",
          ).length;
          const totalMin = todayBlocks.reduce(
            (acc, b) => acc + b.durationMin,
            0,
          );

          return (
            <div
              key={day}
              style={{
                background: "var(--card)",
                borderRadius: 18,
                padding: "13px 16px",
                boxShadow: isToday
                  ? "0 0 0 1.5px var(--blue), var(--shadow-stack)"
                  : "var(--shadow-stack)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ width: 40, flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: isToday ? "var(--blue)" : "var(--label)",
                    marginBottom: 2,
                  }}
                >
                  {day}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: isToday ? "var(--blue)" : "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {label}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {isToday && todayBlocks.length > 0 ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink-2)",
                      fontWeight: 600,
                      letterSpacing: "-0.012em",
                    }}
                  >
                    {doneCount}/{todayBlocks.length} blocks ·{" "}
                    {Math.round(totalMin / 60)}h planned
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--label)",
                      fontWeight: 500,
                    }}
                  >
                    {isToday ? "nothing scheduled." : "rest"}
                  </div>
                )}
              </div>

              {isToday && (
                <Link
                  href="/today"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--blue)",
                    background: "var(--blue-soft)",
                    padding: "5px 11px",
                    borderRadius: 999,
                    textDecoration: "none",
                    boxShadow: "inset 0 0 0 0.5px rgba(0,122,255,0.20)",
                    flexShrink: 0,
                  }}
                >
                  open
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Goals summary */}
      {goals.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--label)",
              padding: "0 2px",
              marginBottom: 12,
            }}
          >
            goals this week
          </div>
          {goals.map((g) => {
            const pct = Math.min(
              1,
              g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
            );
            return (
              <Link
                key={g.id}
                href={`/goals/${g.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--card)",
                    borderRadius: 16,
                    padding: "13px 16px",
                    marginBottom: 10,
                    boxShadow: "var(--shadow-stack)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.012em",
                      marginBottom: 4,
                    }}
                  >
                    {g.identityLine ??
                      `${g.currentValue}${g.unit} → ${g.targetValue}${g.unit}`}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--label-2)",
                      fontWeight: 600,
                    }}
                  >
                    {g.currentValue}
                    {g.unit} of {g.targetValue}
                    {g.unit}
                  </div>
                  {/* hairline track */}
                  <div
                    style={{
                      height: 1.5,
                      background: "var(--inset-2)",
                      borderRadius: 999,
                      marginTop: 10,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "var(--ink)",
                        position: "absolute",
                        top: -5,
                        left: `calc(${pct * 100}% - 6px)`,
                        boxShadow:
                          "0 0 0 3px #fff, 0 0 0 3.5px var(--hairline)",
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
