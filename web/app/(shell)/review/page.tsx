"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function getMondayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - ((day + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const QUESTIONS: {
  key: "kept" | "shifted" | "learned" | "aiming" | "firstMoveNextWeek";
  label: string;
  placeholder: string;
}[] = [
  {
    key: "kept",
    label: "What I kept",
    placeholder:
      "Commitments held, rhythms maintained, promises to yourself that landed…",
  },
  {
    key: "shifted",
    label: "What shifted",
    placeholder: "Plans that changed, surprises, pivots that turned out right…",
  },
  {
    key: "learned",
    label: "What I learned",
    placeholder: "A lesson, an insight, something that clicked this week…",
  },
  {
    key: "aiming",
    label: "What I'm aiming at",
    placeholder: "The target for next week — one sentence, honest…",
  },
  {
    key: "firstMoveNextWeek",
    label: "First move next week",
    placeholder: "The single action that opens the week well…",
  },
];

export default function ReviewPage() {
  const { weeklyReviews, addWeeklyReview } = useDoIt();
  const thisMonday = getMondayISO();

  const existing = weeklyReviews.find((r) => r.weekStartISO === thisMonday);

  const [answers, setAnswers] = useState<Record<string, string>>({
    kept: existing?.q.kept ?? "",
    shifted: existing?.q.shifted ?? "",
    learned: existing?.q.learned ?? "",
    aiming: existing?.q.aiming ?? "",
    firstMoveNextWeek: existing?.q.firstMoveNextWeek ?? "",
  });
  const [editMode, setEditMode] = useState(!existing);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    addWeeklyReview({
      weekStartISO: thisMonday,
      q: {
        kept: answers.kept || undefined,
        shifted: answers.shifted || undefined,
        learned: answers.learned || undefined,
        aiming: answers.aiming || undefined,
        firstMoveNextWeek: answers.firstMoveNextWeek || undefined,
      },
    });
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

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--label,#8E8E93)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
  };

  const textareaStyle = {
    width: "100%",
    minHeight: 72,
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

  // Format week label
  const weekLabel = new Date(thisMonday + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
    },
  );

  return (
    <>
      <Topbar name="Review" sub={`week of ${weekLabel}`} />

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
            {editMode ? "Editing this week" : "This week's review"}
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
              }}
            >
              Edit
            </button>
          )}
        </div>
      )}

      <div style={{ paddingBottom: 110 }}>
        {QUESTIONS.map((q) => (
          <div key={q.key} style={card}>
            <div style={labelStyle}>{q.label}</div>
            {editMode ? (
              <textarea
                style={textareaStyle}
                placeholder={q.placeholder}
                value={answers[q.key]}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))
                }
              />
            ) : (
              <div style={readText}>
                {answers[q.key] || (
                  <span style={{ color: "var(--label,#8E8E93)" }}>—</span>
                )}
              </div>
            )}
          </div>
        ))}

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
            {saved ? "Saved" : "Save review"}
          </button>
        )}
      </div>
    </>
  );
}
