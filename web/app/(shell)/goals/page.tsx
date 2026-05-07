"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

const COVER_BG: Record<DomainId, string> = {
  fitness: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
  business: "linear-gradient(180deg,#E2EEFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE0E8 0%,#FFC9D6 100%)",
  home: "linear-gradient(180deg,#EAEFF3 0%,#D4DCE3 100%)",
  food: "linear-gradient(180deg,#FFF0DD 0%,#FFDFB5 100%)",
};

// Default SVG glyphs by metricKind
function MetricGlyph({ kind }: { kind: string }) {
  if (kind === "weight") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={42}
        height={42}
        stroke="rgba(20,20,30,0.45)"
        strokeWidth={1.6}
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
    );
  }
  if (kind === "money") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={42}
        height={42}
        stroke="rgba(20,20,30,0.45)"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9l4-4 4 4" />
        <path d="M8 5v10" />
        <path d="M16 19l-4-4-4 4" />
        <circle cx="18" cy="9" r="2" />
      </svg>
    );
  }
  if (kind === "count") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={42}
        height={42}
        stroke="rgba(20,20,30,0.45)"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.2" fill="rgba(20,20,30,0.45)" />
      </svg>
    );
  }
  // boolean
  return (
    <svg
      viewBox="0 0 24 24"
      width={42}
      height={42}
      stroke="rgba(20,20,30,0.45)"
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v14H4z" />
      <path d="M4 9h16" />
      <path d="M8 13h8" />
      <path d="M8 16h6" />
    </svg>
  );
}

function weeksLeft(deadlineISO: string): number {
  return Math.max(
    0,
    Math.round(
      (new Date(deadlineISO).getTime() - Date.now()) / (7 * 86_400_000),
    ),
  );
}

// Build a 12-cell week grid. Each cell = 1 week. Cells up to "current week" are "on", rest are empty.
function WeekGrid({
  currentValue,
  targetValue,
  deadlineISO,
}: {
  currentValue: number;
  targetValue: number;
  deadlineISO: string;
}) {
  const wLeft = weeksLeft(deadlineISO);
  const totalWeeks = 12;
  const weeksUsed = Math.max(0, totalWeeks - wLeft);
  const cells = Array.from({ length: totalWeeks }, (_, i) => {
    if (i < weeksUsed - 1) return "on";
    if (i === weeksUsed - 1) return "cur";
    return "empty";
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 3,
        marginTop: 14,
        padding: "0 4px",
      }}
    >
      {cells.map((state, i) => (
        <div
          key={i}
          style={{
            height: 14,
            borderRadius: 3,
            background:
              state === "on"
                ? "#1C1C1E"
                : state === "cur"
                  ? "#0B0B0F"
                  : "rgba(60,60,67,0.06)",
            boxShadow:
              state === "cur"
                ? "0 0 0 1.5px #fff,0 0 0 2px #0B0B0F"
                : undefined,
          }}
        />
      ))}
    </div>
  );
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
    const echo = `logged ${val}${g.unit}. → ${g.targetValue}${g.unit} coming.`;
    setEchoes((p) => ({ ...p, [goalId]: echo }));
    setTimeout(() => setEchoes((p) => ({ ...p, [goalId]: "" })), 3000);
  }

  if (goals.length === 0) {
    return (
      <>
        <Topbar name="goals." sub="measure what you're becoming." />
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "32px 22px",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(180deg,#FFE7EC 0%,#FFD9E0 100%)",
              margin: "0 auto 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={36}
              height={36}
              stroke="#7A2A3C"
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 4v2" />
              <path d="M12 18v2" />
              <path d="M4 12h2" />
              <path d="M18 12h2" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "#0B0B0F",
              marginBottom: 8,
            }}
          >
            no goals yet.
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "#6E6E73",
              fontWeight: 500,
              lineHeight: 1.5,
              maxWidth: 280,
              margin: "0 auto 18px",
            }}
          >
            a goal is a measurable phrase pointed at the man you're becoming.
            start with one.
          </div>
        </div>
      </>
    );
  }

  // Group goals by vision
  const visionGroups: Array<{
    visionId: string | undefined;
    visionTitle: string;
    goals: typeof goals;
  }> = [];
  const seen = new Set<string>();

  for (const g of goals) {
    const key = g.visionId ?? "__none__";
    if (!seen.has(key)) {
      seen.add(key);
      const vision = visions.find((v) => v.id === g.visionId);
      visionGroups.push({
        visionId: g.visionId,
        visionTitle: vision?.title ?? "goals",
        goals: [],
      });
    }
    const group = visionGroups.find(
      (gr) => (gr.visionId ?? "__none__") === key,
    );
    group?.goals.push(g);
  }

  return (
    <>
      <Topbar name="goals." sub="measure what you're becoming." />

      {/* + goal pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <button
          style={{
            background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            fontFamily: "inherit",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          + goal
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingBottom: 110,
        }}
      >
        {visionGroups.map((group) => (
          <div key={group.visionId ?? "none"}>
            {/* Vision header */}
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8E8E93",
                margin: "14px 4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>vision · {group.visionTitle}</span>
              <div
                style={{
                  flex: 1,
                  height: 0.5,
                  background: "rgba(60,60,67,0.10)",
                }}
              />
            </div>

            {/* Goal cards */}
            {group.goals.map((g) => {
              const vision = visions.find((v) => v.id === g.visionId);
              const domainId = (vision?.domainId ?? "business") as DomainId;
              const pct = Math.min(
                1,
                g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
              );
              const wLeft = weeksLeft(g.deadlineISO);
              const echo = echoes[g.id];

              return (
                <div
                  key={g.id}
                  style={{
                    background: "#fff",
                    borderRadius: 22,
                    boxShadow:
                      "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
                    marginBottom: 14,
                    overflow: "hidden",
                  }}
                >
                  {/* Cover band */}
                  <div
                    style={{
                      height: 80,
                      background: COVER_BG[domainId],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* dot pattern */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                          "radial-gradient(circle at 22% 30%,rgba(255,255,255,0.5) 1.2px,transparent 1.6px),radial-gradient(circle at 75% 65%,rgba(255,255,255,0.4) 1.2px,transparent 1.6px)",
                        backgroundSize: "18px 18px",
                        opacity: 0.6,
                        pointerEvents: "none",
                      }}
                    />
                    <MetricGlyph kind={g.metricKind} />
                  </div>

                  {/* Body */}
                  <div style={{ padding: "18px 18px 16px" }}>
                    {/* Identity line */}
                    {g.identityLine && (
                      <div
                        style={{
                          fontSize: 21,
                          fontWeight: 700,
                          letterSpacing: "-0.025em",
                          color: "#0B0B0F",
                          lineHeight: 1.18,
                          marginBottom: 4,
                        }}
                      >
                        {g.identityLine}
                      </div>
                    )}

                    {/* Metric phrase */}
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#1C1C1E",
                        letterSpacing: "-0.012em",
                        marginTop: 4,
                        fontVariantNumeric: "tabular-nums",
                        display: "flex",
                        alignItems: "baseline",
                        gap: 0,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong style={{ fontWeight: 800, color: "#0B0B0F" }}>
                        {g.currentValue}
                        {g.unit}
                      </strong>
                      <span
                        style={{
                          color: "#8E8E93",
                          fontWeight: 500,
                          margin: "0 4px",
                        }}
                      >
                        →
                      </span>
                      <strong style={{ fontWeight: 800, color: "#0B0B0F" }}>
                        {g.targetValue}
                        {g.unit}
                      </strong>
                      <span
                        style={{
                          color: "#6E6E73",
                          fontWeight: 500,
                          marginLeft: 6,
                          fontSize: 13,
                        }}
                      >
                        · {wLeft}w left
                      </span>
                    </div>

                    {/* Hairline track + dot */}
                    <div style={{ marginTop: 14 }}>
                      <div
                        style={{
                          position: "relative",
                          height: 1,
                          background: "rgba(60,60,67,0.10)",
                          margin: "14px 4px 0",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: `${pct * 100}%`,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#0B0B0F",
                            transform: "translate(-50%, -50%)",
                            boxShadow:
                              "0 0 0 3px #fff,0 0 0 3.5px rgba(60,60,67,0.10)",
                          }}
                        />
                      </div>

                      {/* 12-week mini grid */}
                      <WeekGrid
                        currentValue={g.currentValue}
                        targetValue={g.targetValue}
                        deadlineISO={g.deadlineISO}
                      />
                    </div>

                    {/* Echo line */}
                    {echo && (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#6E6E73",
                          fontWeight: 500,
                          lineHeight: 1.5,
                          marginTop: 14,
                        }}
                      >
                        {echo.split("→").map((part, i) =>
                          i === 0 ? (
                            <span key={i}>{part}→ </span>
                          ) : (
                            <strong
                              key={i}
                              style={{ color: "#1C1C1E", fontWeight: 600 }}
                            >
                              {part}
                            </strong>
                          ),
                        )}
                      </div>
                    )}

                    {/* Inline log row */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: "0.5px solid rgba(60,60,67,0.10)",
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
                          background: "#FBFAF8",
                          border: "none",
                          borderRadius: 14,
                          padding: "11px 14px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#0B0B0F",
                          fontFamily: "inherit",
                          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.005em",
                          outline: "none",
                        }}
                      />
                      {g.unit && (
                        <span
                          style={{
                            fontSize: 12.5,
                            color: "#8E8E93",
                            fontWeight: 600,
                            padding: "0 6px",
                          }}
                        >
                          {g.unit}
                        </span>
                      )}
                      <button
                        onClick={() => handleLog(g.id)}
                        style={{
                          background:
                            "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 999,
                          padding: "11px 18px",
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: "inherit",
                          cursor: "pointer",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
                        }}
                      >
                        log
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
