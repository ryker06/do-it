"use client";

import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

export default function GoalsPage() {
  const { goals, visions } = useDoIt();

  return (
    <div className="shell-content">
      <Topbar name="goals." sub="deadlines, not wishes." />

      {goals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--label)",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          no goals yet. · add one.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {goals.map((g) => {
            const vision = visions.find((v) => v.id === g.visionId);
            const pct = Math.min(
              1,
              g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
            );
            const weeksLeft = Math.max(
              0,
              Math.round(
                (new Date(g.deadlineISO).getTime() - Date.now()) /
                  (7 * 86400_000),
              ),
            );
            const delta = g.targetValue - g.currentValue;

            return (
              <Link
                key={g.id}
                href={`/goals/detail?id=${g.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    background: "var(--card)",
                    borderRadius: 24,
                    padding: "22px 22px 18px",
                    boxShadow: "var(--shadow-stack)",
                    overflow: "hidden",
                  }}
                >
                  {/* inner highlight */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 24,
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* domain tag */}
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: "var(--label)",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: vision?.tint ?? "var(--inset-2)",
                        display: "inline-block",
                      }}
                    />
                    {vision?.title ?? "goal"}
                  </div>

                  {/* identity line */}
                  {g.identityLine && (
                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.05,
                        color: "var(--ink)",
                        marginBottom: 14,
                      }}
                    >
                      {g.identityLine}
                    </div>
                  )}

                  {/* metric line */}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.026em",
                      fontVariantNumeric: "tabular-nums",
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    {g.currentValue}
                    {g.unit}
                    <span style={{ color: "var(--label)", fontWeight: 400 }}>
                      →
                    </span>
                    {g.targetValue}
                    {g.unit}
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--label-2)",
                        fontWeight: 600,
                        letterSpacing: "-0.012em",
                      }}
                    >
                      by{" "}
                      {new Date(g.deadlineISO).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* delta phrase */}
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--label-2)",
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      marginBottom: 16,
                    }}
                  >
                    <strong style={{ color: "var(--ink-2)" }}>
                      {delta}
                      {g.unit}
                    </strong>{" "}
                    away · {weeksLeft} weeks left
                  </div>

                  {/* hairline track */}
                  <div
                    style={{
                      height: 1.5,
                      background: "var(--inset-2)",
                      position: "relative",
                      borderRadius: 999,
                      margin: "0 4px 4px",
                      boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                    }}
                  >
                    {/* current value label */}
                    <div
                      style={{
                        position: "absolute",
                        top: -26,
                        left: `calc(${pct * 100}% - 20px)`,
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "var(--ink)",
                        fontVariantNumeric: "tabular-nums",
                        background: "#fff",
                        padding: "2px 7px",
                        borderRadius: 6,
                        boxShadow: "inset 0 0 0 0.5px var(--hairline)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {g.currentValue}
                      {g.unit}
                    </div>
                    {/* dot */}
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "var(--ink)",
                        position: "absolute",
                        top: -6,
                        left: `calc(${pct * 100}% - 7px)`,
                        boxShadow:
                          "0 0 0 3px #fff, 0 0 0 3.5px var(--hairline), 0 2px 6px rgba(20,20,30,0.20)",
                      }}
                    />
                    {/* start / end labels */}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 0,
                        fontSize: 10,
                        color: "var(--label)",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 0,
                        fontSize: 10,
                        color: "var(--label)",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {g.targetValue}
                      {g.unit}
                    </div>
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
