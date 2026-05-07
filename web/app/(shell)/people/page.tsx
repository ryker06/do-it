"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { PersonRole } from "@/lib/types";

const ROLE_TINT: Record<
  PersonRole,
  { bg: string; color: string; label: string }
> = {
  family: { bg: "#FFE7EC", color: "#7A2A3C", label: "family" },
  mentor: { bg: "#E2EEFF", color: "#1748A8", label: "mentor" },
  training: { bg: "#FFD9E0", color: "#7A2A3C", label: "training" },
  team: { bg: "#E2F4E6", color: "#1F5C2C", label: "team" },
  friend: { bg: "#FFF0DD", color: "#7A4A1A", label: "friend" },
};

// Quiet thresholds in days
const QUIET_THRESHOLD: Record<PersonRole, number> = {
  family: 7,
  mentor: 30,
  training: 3,
  team: 7,
  friend: 14,
};

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

function isPastThreshold(role?: PersonRole, lastTouchedISO?: string): boolean {
  if (!role) return false;
  const days = daysSince(lastTouchedISO);
  if (days === null) return true;
  return days >= QUIET_THRESHOLD[role];
}

// Simple initials avatar for people without cover image
function InitialsAvatar({
  name,
  size = 54,
  role,
}: {
  name: string;
  size?: number;
  role?: PersonRole;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = role ? ROLE_TINT[role].bg : "#E2EEFF";
  const color = role ? ROLE_TINT[role].color : "#0050C8";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.3,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        flexShrink: 0,
        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
      }}
    >
      {initials}
    </div>
  );
}

export default function PeoplePage() {
  const { people, addPerson, updatePerson } = useDoIt();
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [role, setRole] = useState<PersonRole>("friend");
  const [nextMove, setNextMove] = useState("");
  const pillStripRef = useRef<HTMLDivElement>(null);

  function handleAdd() {
    if (!name.trim()) return;
    addPerson({
      name: name.trim(),
      relation: relation.trim() || role,
      role,
      nextMove: nextMove.trim() || undefined,
    });
    setName("");
    setRelation("");
    setRole("friend");
    setNextMove("");
    setAddOpen(false);
  }

  // Sort: warm (recently touched) first, quiet last
  const sorted = [...people].sort((a, b) => {
    const da = daysSince(a.lastTouchedISO) ?? 999;
    const db = daysSince(b.lastTouchedISO) ?? 999;
    return da - db;
  });

  const warmPeople = sorted.filter(
    (p) => !isPastThreshold(p.role, p.lastTouchedISO),
  );
  const quietPeople = sorted.filter((p) =>
    isPastThreshold(p.role, p.lastTouchedISO),
  );

  return (
    <>
      <Topbar name="people." sub="the ones who matter." />

      {/* heading + count + add button */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "4px 0 4px",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
            lineHeight: 1,
          }}
        >
          people
        </div>
        <div style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>
          {people.length} people
        </div>
      </div>

      {/* + person pill */}
      <button
        onClick={() => setAddOpen(!addOpen)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "#0B0B0F",
          color: "#fff",
          borderRadius: 999,
          padding: "10px 14px 10px 12px",
          fontSize: 13.5,
          fontWeight: 700,
          letterSpacing: "-0.012em",
          border: "none",
          cursor: "pointer",
          marginBottom: 14,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          +
        </div>
        add person
      </button>

      {/* Inline add form */}
      {addOpen && (
        <div
          style={{
            background: "#FBFAF8",
            borderRadius: 20,
            padding: 16,
            marginBottom: 14,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: 600,
              color: "#0B0B0F",
              background: "#FFFFFF",
              border: "none",
              outline: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "inherit",
              letterSpacing: "-0.012em",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {(Object.keys(ROLE_TINT) as PersonRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "6px 4px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background:
                    role === r ? ROLE_TINT[r].bg : "rgba(60,60,67,0.05)",
                  color: role === r ? ROLE_TINT[r].color : "#8E8E93",
                  fontFamily: "inherit",
                }}
              >
                {ROLE_TINT[r].label}
              </button>
            ))}
          </div>
          <input
            value={nextMove}
            onChange={(e) => setNextMove(e.target.value)}
            placeholder="next move (optional)"
            style={{
              width: "100%",
              fontSize: 13.5,
              fontWeight: 500,
              color: "#0B0B0F",
              background: "#FFFFFF",
              border: "none",
              outline: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "inherit",
              letterSpacing: "-0.005em",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            style={{
              background: name.trim()
                ? "linear-gradient(180deg,#1A1A20,#000)"
                : "#F4F5F7",
              color: name.trim() ? "#fff" : "#8E8E93",
              border: "none",
              borderRadius: 14,
              padding: "12px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: name.trim() ? "pointer" : "default",
              letterSpacing: "-0.005em",
              boxShadow: name.trim()
                ? "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)"
                : "none",
            }}
          >
            save
          </button>
        </div>
      )}

      {/* Avatar pill strip — horizontal scroll */}
      {people.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#8E8E93",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0 2px",
              marginBottom: 4,
            }}
          >
            <span>warm</span>
            <span>quiet</span>
          </div>
          <div
            ref={pillStripRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              overflowX: "auto",
              padding: "14px 4px 16px",
              scrollbarWidth: "none",
            }}
          >
            {sorted.map((p) => {
              const isQuiet = isPastThreshold(p.role, p.lastTouchedISO);
              const days = daysSince(p.lastTouchedISO);
              const showDot =
                p.role && isPastThreshold(p.role, p.lastTouchedISO);
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                    cursor: "pointer",
                    position: "relative",
                    opacity: isQuiet ? 0.65 : 1,
                  }}
                  onClick={() => {
                    const el = document.getElementById(`person-${p.id}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <InitialsAvatar name={p.name} size={46} role={p.role} />
                    {showDot && (
                      <div
                        style={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#FFD9E0",
                          boxShadow: "0 0 0 1.5px #FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 8,
                          color: "#7A2A3C",
                          fontWeight: 800,
                        }}
                      >
                        !
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: isQuiet ? "#8E8E93" : "#1C1C1E",
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      maxWidth: 60,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Person rows list */}
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
              color: "#8E8E93",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            nothing yet · add someone worth keeping close
          </div>
        )}

        {sorted.map((p) => {
          const phrase = touchPhrase(p.lastTouchedISO);
          const isPast = isPastThreshold(p.role, p.lastTouchedISO);
          const roleTint = p.role ? ROLE_TINT[p.role] : null;

          return (
            <Link
              key={p.id}
              href={`/people/${p.id}`}
              id={`person-${p.id}`}
              style={{
                background: isPast ? "#FBFAF8" : "#FFFFFF",
                borderRadius: 20,
                padding: "14px 14px",
                display: "grid",
                gridTemplateColumns: "54px 1fr auto",
                gap: 14,
                alignItems: "start",
                boxShadow: isPast
                  ? "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12),inset 0 0 0 1px rgba(255,217,224,0.5)"
                  : "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                position: "relative",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {/* avatar */}
              <InitialsAvatar name={p.name} size={54} role={p.role} />

              {/* body */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: "-0.022em",
                      color: "#0B0B0F",
                      lineHeight: 1.1,
                    }}
                  >
                    {p.name}
                  </div>
                  {roleTint && (
                    <div
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: roleTint.bg,
                        color: roleTint.color,
                      }}
                    >
                      {roleTint.label}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 11.5,
                    color: isPast ? "#1C1C1E" : "#8E8E93",
                    fontWeight: isPast ? 700 : 600,
                    marginTop: 4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {phrase}
                </div>

                {p.nextMove && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#1C1C1E",
                      fontWeight: 600,
                      lineHeight: 1.4,
                      letterSpacing: "-0.005em",
                      marginTop: 8,
                    }}
                  >
                    {p.nextMove}
                  </div>
                )}
              </div>

              {/* right: reach-out chip if past threshold */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                {isPast && p.role && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#FFD9E0",
                      color: "#7A2A3C",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 800,
                      letterSpacing: "-0.005em",
                      transform: "rotate(-7deg)",
                      boxShadow:
                        "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset",
                      whiteSpace: "nowrap",
                    }}
                  >
                    reach out
                  </div>
                )}
                <div
                  style={{ color: "#8E8E93", fontSize: 14, fontWeight: 600 }}
                >
                  ›
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
