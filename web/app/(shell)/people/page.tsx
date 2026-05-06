"use client";

import { useState } from "react";
import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import RightDrawer from "@/components/RightDrawer";

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

export default function PeoplePage() {
  const { people, addPerson } = useDoIt();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [nextMove, setNextMove] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    addPerson({
      name: name.trim(),
      relation: relation.trim(),
      nextMove: nextMove.trim() || undefined,
    });
    setName("");
    setRelation("");
    setNextMove("");
    setDrawerOpen(false);
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

  return (
    <>
      <Topbar name="people." sub="the ones who matter." />

      {/* Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 14,
        }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 12,
            background: "var(--ink,#000)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="#fff"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          add person
        </button>
      </div>

      {/* List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {people.length === 0 && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label,#8E8E93)",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            no one yet. add someone worth keeping close.
          </div>
        )}
        {people.map((p) => {
          const phrase = touchPhrase(p.lastTouchedISO);
          const days = daysSince(p.lastTouchedISO);
          const isQuiet = days !== null && days >= 7;
          return (
            <Link
              key={p.id}
              href={`/people/${p.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "var(--card,#fff)",
                  borderRadius: 18,
                  padding: "16px 18px",
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -10px rgba(20,20,30,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--ink,#000)",
                          letterSpacing: "-0.022em",
                        }}
                      >
                        {p.name}
                      </span>
                      {p.relation && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--label,#8E8E93)",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          {p.relation}
                        </span>
                      )}
                    </div>
                    {p.nextMove && (
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "var(--ink-2,#1C1C1E)",
                          letterSpacing: "-0.012em",
                          marginBottom: 6,
                          lineHeight: 1.4,
                        }}
                      >
                        {p.nextMove}
                      </div>
                    )}
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    width={8}
                    height={13}
                    fill="none"
                    stroke="rgba(60,60,67,0.28)"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: 4 }}
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--label,#8E8E93)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {phrase}
                  </span>
                  {isQuiet && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#C41E3A",
                        background:
                          "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
                        padding: "2px 7px",
                        borderRadius: 999,
                        boxShadow: "inset 0 0 0 0.5px rgba(196,30,58,0.15)",
                      }}
                    >
                      reach out
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Add drawer */}
      {drawerOpen && (
        <RightDrawer onClose={() => setDrawerOpen(false)}>
          <div style={{ padding: "28px 24px" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.03em",
                marginBottom: 6,
              }}
            >
              add person.
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                marginBottom: 24,
              }}
            >
              someone worth keeping close.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                style={inputStyle}
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <input
                style={inputStyle}
                placeholder="relation (family, mentor, friend…)"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="next move (optional)"
                value={nextMove}
                onChange={(e) => setNextMove(e.target.value)}
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "14px 0",
                borderRadius: 14,
                background: name.trim()
                  ? "linear-gradient(180deg,#1A1A1F 0%, #0A0A0F 100%)"
                  : "var(--inset,#F2F2F7)",
                color: name.trim() ? "#fff" : "var(--label,#8E8E93)",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.018em",
                border: "none",
                cursor: name.trim() ? "pointer" : "default",
                transition: "background 0.15s ease",
              }}
            >
              add
            </button>
          </div>
        </RightDrawer>
      )}
    </>
  );
}
