"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function ReflectPage() {
  const { reflections, addReflection, addMorningBrief } = useDoIt();
  const today = todayISO();

  const [fellShort, setFellShort] = useState("");
  const [actedWell, setActedWell] = useState("");
  const [correction, setCorrection] = useState("");
  const [echo, setEcho] = useState<string | null>(null);

  const existing = reflections.find((r) => r.dateISO === today);

  function handleSave() {
    addReflection({ dateISO: today, fellShort, actedWell, correction });
    if (correction.trim()) {
      addMorningBrief({ dateISO: tomorrowISO(), friction: correction.trim() });
    }
    setEcho("saved. → tomorrow sharper.");
    setTimeout(() => setEcho(null), 2600);
  }

  const past = [...reflections]
    .filter((r) => r.dateISO !== today && r.correction)
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    .slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--ink-2)",
        margin: "-16px -16px 0",
        padding: "16px 16px 0",
      }}
    >
      <Topbar name="reflect." sub="evening audit." />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          paddingBottom: 100,
        }}
      >
        {/* Prompt 1 */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "16px 18px",
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 10,
            }}
          >
            where did you fall short today?
          </div>
          <textarea
            value={fellShort}
            onChange={(e) => setFellShort(e.target.value)}
            placeholder="be honest."
            rows={3}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "inherit",
              letterSpacing: "-0.014em",
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Prompt 2 */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "16px 18px",
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 10,
            }}
          >
            where did you act well?
          </div>
          <textarea
            value={actedWell}
            onChange={(e) => setActedWell(e.target.value)}
            placeholder="own it."
            rows={3}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "inherit",
              letterSpacing: "-0.014em",
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Prompt 3 */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "16px 18px",
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 10,
            }}
          >
            one specific correction for tomorrow.
          </div>
          <textarea
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder="make it a verb."
            rows={2}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "inherit",
              letterSpacing: "-0.014em",
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.80)",
            border: "none",
            borderRadius: 18,
            padding: "15px 0",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            letterSpacing: "-0.018em",
            boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.12)",
            width: "100%",
          }}
        >
          close the day.
        </button>

        {echo && (
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              marginTop: -4,
            }}
          >
            {echo}
          </div>
        )}

        {/* Past corrections */}
        {past.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 10,
              }}
            >
              recent corrections
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {past.map((r) => (
                <div
                  key={r.id}
                  style={{
                    padding: "11px 14px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 14,
                    boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.28)",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {new Date(r.dateISO).toLocaleDateString("en", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.60)",
                      fontWeight: 500,
                      letterSpacing: "-0.012em",
                      lineHeight: 1.4,
                    }}
                  >
                    {r.correction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's saved entry */}
        {existing && (
          <div style={{ marginTop: 4 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 10,
              }}
            >
              today&apos;s log
            </div>
            {existing.actedWell && (
              <div
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.55)",
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.45,
                  marginBottom: 8,
                }}
              >
                {existing.actedWell}
              </div>
            )}
            {existing.correction && (
              <div
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.40)",
                  fontWeight: 600,
                  letterSpacing: "-0.012em",
                  fontStyle: "italic",
                }}
              >
                → {existing.correction}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
