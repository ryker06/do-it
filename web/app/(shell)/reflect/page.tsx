"use client";

import { useState, useEffect } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ReflectPage() {
  const { reflections, addReflection } = useDoIt();
  const today = todayISO();

  const existing = reflections.find((r) => r.dateISO === today);

  const [worked, setWorked] = useState(existing?.worked ?? "");
  const [shifted, setShifted] = useState(existing?.shifted ?? "");
  const [firstMove, setFirstMove] = useState(existing?.firstMove ?? "");
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(!existing);

  useEffect(() => {
    if (existing) {
      setWorked(existing.worked ?? "");
      setShifted(existing.shifted ?? "");
      setFirstMove(existing.firstMove ?? "");
      setEditMode(false);
    }
  }, [existing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    addReflection({ dateISO: today, worked, shifted, firstMove });
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const card = {
    background: "var(--card,#fff)",
    borderRadius: 20,
    padding: "18px 18px",
    marginBottom: 14,
    boxShadow:
      "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
  } as const;

  const label = {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--label,#8E8E93)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
  };

  const textarea = {
    width: "100%",
    minHeight: 80,
    resize: "none" as const,
    border: "none",
    outline: "none",
    fontSize: 15,
    fontWeight: 500,
    color: "var(--ink,#000)",
    letterSpacing: "-0.014em",
    lineHeight: 1.55,
    background: "transparent",
    fontFamily: "inherit",
    padding: 0,
  };

  const readText = {
    fontSize: 15,
    fontWeight: 500,
    color: "var(--ink-2,#1C1C1E)",
    letterSpacing: "-0.014em",
    lineHeight: 1.55,
    whiteSpace: "pre-wrap" as const,
  };

  return (
    <>
      <Topbar name="Reflect" sub="today's close" />

      {/* status row */}
      {existing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--label,#8E8E93)",
              letterSpacing: "-0.01em",
            }}
          >
            {editMode ? "Editing today's reflection" : "Today's reflection"}
          </span>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--blue,#007AFF)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                letterSpacing: "-0.01em",
              }}
            >
              Edit
            </button>
          )}
        </div>
      )}

      <div style={{ paddingBottom: 110 }}>
        {/* What worked */}
        <div style={card}>
          <div style={label}>What worked</div>
          {editMode ? (
            <textarea
              style={textarea}
              placeholder="A moment of clarity, a block that flowed, a decision that landed well…"
              value={worked}
              onChange={(e) => setWorked(e.target.value)}
            />
          ) : (
            <div style={readText}>
              {worked || (
                <span style={{ color: "var(--label,#8E8E93)" }}>—</span>
              )}
            </div>
          )}
        </div>

        {/* What shifted */}
        <div style={card}>
          <div style={label}>What shifted</div>
          {editMode ? (
            <textarea
              style={textarea}
              placeholder="Something that moved, changed, or surprised you today…"
              value={shifted}
              onChange={(e) => setShifted(e.target.value)}
            />
          ) : (
            <div style={readText}>
              {shifted || (
                <span style={{ color: "var(--label,#8E8E93)" }}>—</span>
              )}
            </div>
          )}
        </div>

        {/* Tomorrow's first move */}
        <div style={card}>
          <div style={label}>{"Tomorrow's first move"}</div>
          {editMode ? (
            <textarea
              style={{ ...textarea, minHeight: 56 }}
              placeholder="The one thing you'll do first, before anything else…"
              value={firstMove}
              onChange={(e) => setFirstMove(e.target.value)}
            />
          ) : (
            <div style={readText}>
              {firstMove || (
                <span style={{ color: "var(--label,#8E8E93)" }}>—</span>
              )}
            </div>
          )}
        </div>

        {/* Save */}
        {editMode && (
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "15px 0",
              borderRadius: 18,
              background: "linear-gradient(180deg,#1A1A1F 0%, #0A0A0F 100%)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.018em",
              border: "none",
              cursor: "pointer",
              boxShadow:
                "0 4px 16px rgba(10,10,15,0.22), 0 1px 2px rgba(10,10,15,0.14)",
            }}
          >
            {saved ? "Saved" : "Save reflection"}
          </button>
        )}
      </div>
    </>
  );
}
