"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysSince(isoDate?: string): number | null {
  if (!isoDate) return null;
  const d = new Date(isoDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((now.getTime() - d.getTime()) / 86400_000);
}

function touchPhrase(isoDate?: string): string {
  const days = daysSince(isoDate);
  if (days === null) return "never touched";
  if (days === 0) return "touched today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days quiet`;
  if (days < 14) return "a week quiet";
  if (days < 30) return `${Math.floor(days / 7)} weeks quiet`;
  return `${Math.floor(days / 30)} months quiet`;
}

export function ClientView({ id }: { id: string }) {
  const router = useRouter();

  const { people, updatePerson } = useDoIt();
  const person = people.find((p) => p.id === id);

  const [name, setName] = useState(person?.name ?? "");
  const [relation, setRelation] = useState(person?.relation ?? "");
  const [nextMove, setNextMove] = useState(person?.nextMove ?? "");
  const [note, setNote] = useState(person?.note ?? "");
  const [lastTouchedISO, setLastTouchedISO] = useState(
    person?.lastTouchedISO ?? "",
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (person) {
      setName(person.name);
      setRelation(person.relation ?? "");
      setNextMove(person.nextMove ?? "");
      setNote(person.note ?? "");
      setLastTouchedISO(person.lastTouchedISO ?? "");
    }
  }, [person?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!person) {
    return (
      <>
        <Topbar name="Person" sub="not found" />
        <div
          style={{
            padding: "32px 0",
            textAlign: "center",
            fontSize: 15,
            color: "var(--label,#8E8E93)",
          }}
        >
          Person not found.
        </div>
      </>
    );
  }

  function handleSave() {
    updatePerson(id, {
      name: name.trim() || person!.name,
      relation: relation.trim(),
      nextMove: nextMove.trim() || undefined,
      note: note.trim() || undefined,
      lastTouchedISO: lastTouchedISO || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleMarkTouched() {
    const today = todayISO();
    setLastTouchedISO(today);
    updatePerson(id, { lastTouchedISO: today });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const inputStyle = {
    width: "100%",
    fontSize: 15,
    fontWeight: 500,
    color: "var(--ink,#000)",
    background: "var(--inset,#F2F2F7)",
    border: "none",
    outline: "none",
    borderRadius: 12,
    padding: "11px 14px",
    fontFamily: "inherit",
    letterSpacing: "-0.014em",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--label,#8E8E93)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    marginBottom: 6,
  };

  const phrase = touchPhrase(lastTouchedISO || person.lastTouchedISO);

  return (
    <>
      <Topbar name={person.name} sub={phrase} />

      <div style={{ paddingBottom: 110 }}>
        {/* Mark touched */}
        <button
          onClick={handleMarkTouched}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 16,
            background: "var(--card,#fff)",
            color: "var(--ink,#000)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.016em",
            border: "none",
            cursor: "pointer",
            marginBottom: 20,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 1px rgba(20,20,30,0.02), 0 4px 12px -8px rgba(20,20,30,0.08)",
          }}
        >
          Mark touched today
        </button>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={labelStyle}>Name</div>
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <div style={labelStyle}>Relation</div>
            <input
              style={inputStyle}
              placeholder="family, mentor, friend…"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
            />
          </div>

          <div>
            <div style={labelStyle}>Next move</div>
            <input
              style={inputStyle}
              placeholder="What to do next with this person…"
              value={nextMove}
              onChange={(e) => setNextMove(e.target.value)}
            />
          </div>

          <div>
            <div style={labelStyle}>Note</div>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 80,
                resize: "none",
                lineHeight: 1.5,
              }}
              placeholder="Anything worth remembering…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <div style={labelStyle}>Last touched</div>
            <input
              type="date"
              style={inputStyle}
              value={lastTouchedISO}
              onChange={(e) => setLastTouchedISO(e.target.value)}
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            marginTop: 24,
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
          {saved ? "Saved" : "Save"}
        </button>

        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "13px 0",
            borderRadius: 18,
            background: "transparent",
            color: "var(--label,#8E8E93)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.016em",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </>
  );
}
