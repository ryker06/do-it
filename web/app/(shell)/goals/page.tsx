"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { Topbar } from "@/components/Topbar";
import RightDrawer from "@/components/RightDrawer";
import type { DomainId, GoalMetricKind, Goal } from "@/lib/types";

const COVER_BG: Record<DomainId, string> = {
  fitness: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
  business: "linear-gradient(180deg,#E2EEFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE0E8 0%,#FFC9D6 100%)",
  home: "linear-gradient(180deg,#EAEFF3 0%,#D4DCE3 100%)",
  food: "linear-gradient(180deg,#FFF0DD 0%,#FFDFB5 100%)",
};

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

// Full goal card — used in mobile list + desktop detail pane
function GoalCard({
  g,
  domainId,
  inputs,
  echoes,
  onInputChange,
  onLog,
  linkOnTap,
}: {
  g: Goal;
  domainId: DomainId;
  inputs: Record<string, string>;
  echoes: Record<string, string>;
  onInputChange: (id: string, val: string) => void;
  onLog: (id: string) => void;
  linkOnTap: boolean;
}) {
  const pct = Math.min(
    1,
    g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
  );
  const wLeft = weeksLeft(g.deadlineISO);
  const echo = echoes[g.id];

  const cardBody = (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        boxShadow:
          "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
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
      <div style={{ padding: "18px 18px 0" }}>
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
          <span style={{ color: "#8E8E93", fontWeight: 500, margin: "0 4px" }}>
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
                boxShadow: "0 0 0 3px #fff,0 0 0 3.5px rgba(60,60,67,0.10)",
              }}
            />
          </div>
          <WeekGrid
            currentValue={g.currentValue}
            targetValue={g.targetValue}
            deadlineISO={g.deadlineISO}
          />
        </div>
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
                <strong key={i} style={{ color: "#1C1C1E", fontWeight: 600 }}>
                  {part}
                </strong>
              ),
            )}
          </div>
        )}
      </div>
      {/* Inline log row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          margin: "0 18px",
          paddingTop: 14,
          paddingBottom: 16,
          borderTop: "0.5px solid rgba(60,60,67,0.10)",
          marginTop: 14,
        }}
      >
        <input
          type="number"
          value={inputs[g.id] ?? ""}
          onChange={(e) => onInputChange(g.id, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLog(g.id)}
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
          onClick={() => onLog(g.id)}
          style={{
            background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
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
  );

  if (linkOnTap) {
    return (
      <div style={{ marginBottom: 14 }}>
        <Link
          href={`/goals/detail?id=${g.id}`}
          style={{ textDecoration: "none", display: "block" }}
        >
          {cardBody}
        </Link>
      </div>
    );
  }
  return <div style={{ marginBottom: 14 }}>{cardBody}</div>;
}

function GoalsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const isDesktop = useIsDesktop();

  const { goals, visions, logGoalValue, addGoal } = useDoIt();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [echoes, setEchoes] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [cName, setCName] = useState("");
  const [cIdentity, setCIdentity] = useState("");
  const [cKind, setCKind] = useState<GoalMetricKind>("count");
  const [cTarget, setCTarget] = useState("");
  const [cUnit, setCUnit] = useState("");
  const [cDeadline, setCDeadline] = useState("");
  const [cVisionId, setCVisionId] = useState(visions[0]?.id ?? "");

  function handleCreate() {
    if (!cName.trim() || !cDeadline) return;
    addGoal({
      visionId: cVisionId,
      identityLine: cIdentity.trim() || cName.trim(),
      metricKind: cKind,
      targetValue: parseFloat(cTarget) || 1,
      currentValue: 0,
      unit: cUnit.trim(),
      deadlineISO: cDeadline,
    });
    setCName("");
    setCIdentity("");
    setCKind("count");
    setCTarget("");
    setCUnit("");
    setCDeadline("");
    setCreateOpen(false);
  }

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
    visionGroups
      .find((gr) => (gr.visionId ?? "__none__") === key)
      ?.goals.push(g);
  }

  const selectedGoal = goals.find((g) => g.id === selectedId) ?? null;
  const selectedVision = selectedGoal
    ? visions.find((v) => v.id === selectedGoal.visionId)
    : null;
  const selectedDomainId = (selectedVision?.domainId ?? "business") as DomainId;

  const addButton = (
    <button
      onClick={() => setCreateOpen(true)}
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
        flexShrink: 0,
      }}
    >
      + goal
    </button>
  );

  const createDrawer = (
    <RightDrawer
      open={createOpen}
      onClose={() => setCreateOpen(false)}
      title="new goal"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          autoFocus
          value={cName}
          onChange={(e) => setCName(e.target.value)}
          placeholder="goal name"
          style={{
            width: "100%",
            fontSize: 15,
            fontWeight: 600,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            letterSpacing: "-0.012em",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        <input
          value={cIdentity}
          onChange={(e) => setCIdentity(e.target.value)}
          placeholder="identity line (e.g. I am a 100kg deadlifter)"
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            letterSpacing: "-0.008em",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        {visions.length > 0 && (
          <select
            value={cVisionId}
            onChange={(e) => setCVisionId(e.target.value)}
            style={{
              width: "100%",
              fontSize: 14,
              fontWeight: 500,
              color: "#0B0B0F",
              background: "#FBFAF8",
              border: "none",
              outline: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              boxSizing: "border-box",
            }}
          >
            {visions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          {(["weight", "money", "count", "boolean"] as GoalMetricKind[]).map(
            (k) => (
              <button
                key={k}
                onClick={() => setCKind(k)}
                style={{
                  flex: 1,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "7px 4px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background: cKind === k ? "#0B0B0F" : "rgba(60,60,67,0.06)",
                  color: cKind === k ? "#fff" : "#8E8E93",
                }}
              >
                {k}
              </button>
            ),
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={cTarget}
            onChange={(e) => setCTarget(e.target.value)}
            placeholder="target"
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 600,
              color: "#0B0B0F",
              background: "#FBFAF8",
              border: "none",
              outline: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            }}
          />
          <input
            value={cUnit}
            onChange={(e) => setCUnit(e.target.value)}
            placeholder="unit (kg, €…)"
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 600,
              color: "#0B0B0F",
              background: "#FBFAF8",
              border: "none",
              outline: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "inherit",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            }}
          />
        </div>
        <input
          type="date"
          value={cDeadline}
          onChange={(e) => setCDeadline(e.target.value)}
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleCreate}
          disabled={!cName.trim() || !cDeadline}
          style={{
            background:
              cName.trim() && cDeadline
                ? "linear-gradient(180deg,#1A1A20,#000)"
                : "#F4F5F7",
            color: cName.trim() && cDeadline ? "#fff" : "#8E8E93",
            border: "none",
            borderRadius: 14,
            padding: "13px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: cName.trim() && cDeadline ? "pointer" : "default",
            letterSpacing: "-0.005em",
            boxShadow:
              cName.trim() && cDeadline
                ? "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)"
                : "none",
          }}
        >
          save goal
        </button>
      </div>
    </RightDrawer>
  );

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
          {addButton}
        </div>
        {createDrawer}
      </>
    );
  }

  // ── Desktop master/detail ──
  if (isDesktop) {
    return (
      <>
        {createDrawer}
        <div className="md-layout">
          {/* LEFT — 320px list pane */}
          <div className="md-list" style={{ width: 320 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 14px 10px",
                borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "var(--label,#8E8E93)",
                }}
              >
                {goals.length} goal{goals.length !== 1 ? "s" : ""}
              </span>
              {addButton}
            </div>

            {visionGroups.map((group) => (
              <div key={group.visionId ?? "none"}>
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#8E8E93",
                    padding: "12px 14px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{group.visionTitle}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 0.5,
                      background: "rgba(60,60,67,0.10)",
                    }}
                  />
                </div>
                {group.goals.map((g) => {
                  const isSelected = selectedId === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() =>
                        router.push(`/goals?selected=${g.id}`, {
                          scroll: false,
                        })
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        width: "100%",
                        padding: "10px 14px",
                        background: isSelected
                          ? "var(--ink,#0B0B0F)"
                          : "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "background 160ms",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          letterSpacing: "-0.012em",
                          color: isSelected ? "#fff" : "var(--ink,#0B0B0F)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.identityLine || g.unit}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: isSelected
                            ? "rgba(255,255,255,0.6)"
                            : "var(--label-2,#6E6E73)",
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {g.currentValue}
                        {g.unit} → {g.targetValue}
                        {g.unit}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* RIGHT — detail pane */}
          <div className="md-detail">
            {selectedGoal ? (
              <div style={{ padding: "24px 32px 40px", maxWidth: 500 }}>
                <GoalCard
                  g={selectedGoal}
                  domainId={selectedDomainId}
                  inputs={inputs}
                  echoes={echoes}
                  onInputChange={(id, val) =>
                    setInputs((p) => ({ ...p, [id]: val }))
                  }
                  onLog={handleLog}
                  linkOnTap={false}
                />
              </div>
            ) : (
              <div className="md-empty">
                <span className="md-empty-icon">◎</span>
                <span>select a goal to see the detail</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Mobile single-column ──
  return (
    <>
      <Topbar name="goals." sub="measure what you're becoming." />
      {createDrawer}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {addButton}
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
            {group.goals.map((g) => {
              const vision = visions.find((v) => v.id === g.visionId);
              const domainId = (vision?.domainId ?? "business") as DomainId;
              return (
                <GoalCard
                  key={g.id}
                  g={g}
                  domainId={domainId}
                  inputs={inputs}
                  echoes={echoes}
                  onInputChange={(id, val) =>
                    setInputs((p) => ({ ...p, [id]: val }))
                  }
                  onLog={handleLog}
                  linkOnTap
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function GoalsPage() {
  return (
    <Suspense>
      <GoalsInner />
    </Suspense>
  );
}
