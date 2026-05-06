"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function GoalDetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const { goals, visions, logGoalValue } = useDoIt();
  const [inputVal, setInputVal] = useState("");
  const [echo, setEcho] = useState<string | null>(null);

  const goal = goals.find((g) => g.id === id);
  if (!goal)
    return (
      <div className="shell-content">
        <Topbar name="goal not found." />
        <button
          onClick={() => router.back()}
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "var(--label)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          back
        </button>
      </div>
    );

  const vision = visions.find((v) => v.id === goal.visionId);
  const pct = Math.min(
    1,
    goal.targetValue > 0 ? goal.currentValue / goal.targetValue : 0,
  );
  const weeksLeft = Math.max(
    0,
    Math.round(
      (new Date(goal.deadlineISO).getTime() - Date.now()) / (7 * 86400_000),
    ),
  );

  function handleLog() {
    if (!goal) return;
    const val = parseFloat(inputVal);
    if (isNaN(val)) return;
    logGoalValue(goal.id, val);
    const delta = goal.targetValue - val;
    setEcho(
      `logged ${val}${goal.unit}. → ${delta > 0 ? `${delta}${goal.unit} to go.` : "target reached."}`,
    );
    setInputVal("");
    setTimeout(() => setEcho(null), 3000);
  }

  return (
    <div className="shell-content">
      <Topbar name="goal." sub={vision?.title ?? ""} />

      <button
        onClick={() => router.back()}
        style={{
          fontSize: 12.5,
          color: "var(--label)",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 16,
          letterSpacing: "-0.005em",
          fontWeight: 500,
        }}
      >
        ← goals
      </button>

      <div
        style={{
          position: "relative",
          background: "var(--card)",
          borderRadius: 24,
          padding: "22px 22px 18px",
          boxShadow: "var(--shadow-card)",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
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

        {goal.identityLine && (
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
            {goal.identityLine}
          </div>
        )}

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
          {goal.currentValue}
          {goal.unit}
          <span style={{ color: "var(--label)", fontWeight: 400 }}>→</span>
          {goal.targetValue}
          {goal.unit}
          <span
            style={{
              fontSize: 13,
              color: "var(--label-2)",
              fontWeight: 600,
            }}
          >
            by{" "}
            {new Date(goal.deadlineISO).toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: "var(--label-2)",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <strong style={{ color: "var(--ink-2)" }}>
            {goal.targetValue - goal.currentValue}
            {goal.unit}
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
            margin: "24px 4px 16px",
          }}
        >
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
            {goal.currentValue}
            {goal.unit}
          </div>
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
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 0,
              fontSize: 10,
              color: "var(--label)",
              fontWeight: 600,
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
            }}
          >
            {goal.targetValue}
            {goal.unit}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            paddingTop: 14,
            borderTop: "0.5px solid var(--hairline)",
          }}
        >
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLog()}
            placeholder={`log ${goal.unit}`}
            style={{
              flex: 1,
              background: "var(--inset)",
              border: "none",
              borderRadius: 14,
              padding: "11px 14px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 0 0.5px var(--hairline-2)",
              fontVariantNumeric: "tabular-nums",
              outline: "none",
            }}
          />
          <button
            onClick={handleLog}
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

        {echo && (
          <div
            style={{
              fontSize: 11,
              color: "var(--label)",
              fontWeight: 600,
              fontStyle: "italic",
              marginTop: 10,
              paddingLeft: 2,
            }}
          >
            {echo}
          </div>
        )}
      </div>

      {goal.history.length > 0 && (
        <div
          style={{
            background: "var(--card)",
            borderRadius: 20,
            padding: "16px 18px",
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
            history
          </div>
          {[...goal.history].reverse().map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom:
                  i < goal.history.length - 1
                    ? "0.5px solid var(--hairline-2)"
                    : "none",
              }}
            >
              <span
                style={{
                  fontSize: 12.5,
                  color: "var(--label-2)",
                  fontWeight: 600,
                }}
              >
                {new Date(entry.dateISO).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {entry.value}
                {goal.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GoalDetailPage() {
  return (
    <Suspense fallback={<div className="shell-content" />}>
      <GoalDetailInner />
    </Suspense>
  );
}
