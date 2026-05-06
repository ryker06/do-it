"use client";

import { useState } from "react";
import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

const DOMAIN_DOT: Record<DomainId, string> = {
  fitness: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
  business: "linear-gradient(180deg,#E1ECFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%,#FFCFDC 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%,#CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%,#FFE0B2 100%)",
};

function weeksLeft(deadlineISO: string): number {
  return Math.max(
    0,
    Math.round(
      (new Date(deadlineISO).getTime() - Date.now()) / (7 * 86_400_000),
    ),
  );
}

function deadlineLabel(deadlineISO: string): string {
  return new Date(deadlineISO).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

export default function GoalsPage() {
  const { goals, visions, logGoalValue } = useDoIt();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [echoes, setEchoes] = useState<Record<string, string>>({});

  function handleLog(goalId: string) {
    const raw = inputs[goalId] ?? "";
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    const g = goals.find((g) => g.id === goalId);
    if (!g) return;
    logGoalValue(goalId, val);
    setInputs((p) => ({ ...p, [goalId]: "" }));
    setEchoes((p) => ({
      ...p,
      [goalId]: `logged ${val}${g.unit}. → ${g.targetValue}${g.unit} coming.`,
    }));
  }

  if (goals.length === 0) {
    return (
      <>
        <Topbar name="goals." sub="deadlines, not wishes." />
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--label,#8E8E93)",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          no goals yet · add one.
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar name="goals." sub="deadlines you set." />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          paddingBottom: 110,
        }}
      >
        {goals.map((g) => {
          const vision = visions.find((v) => v.id === g.visionId);
          const pct = Math.min(
            1,
            g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
          );
          const wLeft = weeksLeft(g.deadlineISO);
          const delta = g.targetValue - g.currentValue;
          const echo = echoes[g.id];
          const domainId = (vision?.domainId ?? "business") as DomainId;

          return (
            <div
              key={g.id}
              style={{
                position: "relative",
                background: "var(--card,#fff)",
                borderRadius: 24,
                padding: "22px 22px 18px",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05),0 8px 22px -14px rgba(20,20,30,0.12)",
                overflow: "hidden",
              }}
            >
              {/* inset highlight */}
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
                  color: "var(--label,#8E8E93)",
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
                    background: DOMAIN_DOT[domainId],
                    display: "inline-block",
                    flexShrink: 0,
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
                    color: "var(--ink,#000)",
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
                  color: "var(--ink,#000)",
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
                <span
                  style={{ color: "var(--label,#8E8E93)", fontWeight: 400 }}
                >
                  →
                </span>
                {g.targetValue}
                {g.unit}
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--label-2,#6E6E73)",
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                  }}
                >
                  by {deadlineLabel(g.deadlineISO)}
                </span>
              </div>

              {/* delta phrase */}
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--label-2,#6E6E73)",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  marginBottom: 16,
                }}
              >
                <strong style={{ color: "var(--ink-2,#1C1C1E)" }}>
                  {delta}
                  {g.unit}, {wLeft} weeks left.
                </strong>
              </div>

              {/* hairline track + dot */}
              <div
                style={{
                  height: 1.5,
                  background: "var(--inset-2,#EAEAEF)",
                  position: "relative",
                  borderRadius: 999,
                  margin: "8px 4px 14px",
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                }}
              >
                {/* current label */}
                <div
                  style={{
                    position: "absolute",
                    top: -26,
                    left: `calc(${pct * 100}% - 20px)`,
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "var(--ink,#000)",
                    fontVariantNumeric: "tabular-nums",
                    background: "#fff",
                    padding: "2px 7px",
                    borderRadius: 6,
                    boxShadow:
                      "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
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
                    background: "var(--ink,#000)",
                    position: "absolute",
                    top: -6,
                    left: `calc(${pct * 100}% - 7px)`,
                    boxShadow:
                      "0 0 0 3px #fff, 0 0 0 3.5px var(--hairline,rgba(60,60,67,0.10)), 0 2px 6px rgba(20,20,30,0.20)",
                  }}
                />
                {/* start */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 0,
                    fontSize: 10,
                    color: "var(--label,#8E8E93)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  0
                </div>
                {/* end */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 0,
                    fontSize: 10,
                    color: "var(--label,#8E8E93)",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {g.targetValue}
                  {g.unit}
                </div>
              </div>

              {/* Log row */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  paddingTop: 14,
                  borderTop: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
                }}
              >
                <input
                  type="number"
                  value={inputs[g.id] ?? ""}
                  onChange={(e) =>
                    setInputs((p) => ({ ...p, [g.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleLog(g.id)}
                  placeholder={`log ${g.unit || "value"}`}
                  style={{
                    flex: 1,
                    background: "var(--inset,#F2F2F7)",
                    border: "none",
                    borderRadius: 14,
                    padding: "11px 14px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink,#000)",
                    fontFamily: "inherit",
                    boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                    fontVariantNumeric: "tabular-nums",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleLog(g.id)}
                  style={{
                    background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "11px 18px",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 12px 24px -14px rgba(10,10,20,0.45)",
                  }}
                >
                  log
                </button>
              </div>

              {/* Echo line */}
              {echo && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--label,#8E8E93)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    letterSpacing: "-0.005em",
                    marginTop: 10,
                    paddingLeft: 2,
                  }}
                >
                  {echo.split("→").map((part, i) =>
                    i === 0 ? (
                      <span key={i}>{part}→ </span>
                    ) : (
                      <strong
                        key={i}
                        style={{
                          color: "var(--ink-2,#1C1C1E)",
                          fontWeight: 700,
                          fontStyle: "normal",
                        }}
                      >
                        {part}
                      </strong>
                    ),
                  )}
                </div>
              )}

              {/* Link to detail */}
              <Link
                href={`/goals/detail?id=${g.id}`}
                style={{
                  display: "block",
                  marginTop: echo ? 10 : 6,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  textDecoration: "none",
                }}
              >
                view history →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
