"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";

// ── palette ───────────────────────────────────────────────────────────────────
const SHADOW_PAPER =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)";
const SHADOW_PRESS_INK =
  "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)";
const SHADOW_CHIP =
  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset";
const HAIRLINE = "rgba(60,60,67,0.10)";
const HAIRLINE_SOFT = "rgba(60,60,67,0.06)";

// ── prompts config ────────────────────────────────────────────────────────────
const PROMPTS = [
  {
    num: "01",
    q: ["where did you ", "fall short", " today?"],
    placeholder: "be honest. → name it to drop it.",
    field: "fellShort" as const,
  },
  {
    num: "02",
    q: ["where did you ", "act well", "?"],
    placeholder: "own it. → this is your fuel.",
    field: "actedWell" as const,
  },
  {
    num: "03",
    q: ["one specific ", "correction", " for tomorrow."],
    placeholder: "make it a verb. → this becomes your first block.",
    field: "correction" as const,
    rotatedChip: true,
  },
];

type PromptFields = {
  fellShort: string;
  actedWell: string;
  correction: string;
};

// ── helpers ───────────────────────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function fmtDate(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ── prompt card ───────────────────────────────────────────────────────────────
function PromptCard({
  num,
  q,
  placeholder,
  rotatedChip,
  value,
  onChange,
  isFocused,
  onFocus,
  onBlur,
  isSaved,
}: {
  num: string;
  q: string[];
  placeholder: string;
  rotatedChip?: boolean;
  value: string;
  onChange: (v: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isSaved: boolean;
}) {
  const wc = wordCount(value);
  const done = value.trim().length > 0;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 22,
        padding: "18px 18px 14px",
        boxShadow: isFocused
          ? `0 0 0 1.5px #0B0B0F,${SHADOW_PAPER}`
          : SHADOW_PAPER,
        position: "relative",
        marginBottom: 14,
      }}
    >
      {/* rotated chip on card 03 */}
      {rotatedChip && isSaved && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#C7F0CF",
            color: "#1F5C2C",
            padding: "5px 11px",
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: "-0.005em",
            transform: "rotate(-7deg)",
            boxShadow: SHADOW_CHIP,
          }}
        >
          → tomorrow
        </div>
      )}

      {/* eyebrow number */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.20em",
          color: done ? "#1F5C2C" : "#8E8E93",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 8,
        }}
      >
        {num}
        {done ? " · ✓" : ""}
      </div>

      {/* question — SF Pro Display, NOT serif */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.022em",
          color: "#0B0B0F",
          lineHeight: 1.28,
          marginBottom: 12,
        }}
      >
        {q[0]}
        <span style={{ fontWeight: 800 }}>{q[1]}</span>
        {q[2]}
      </div>

      {/* textarea with hairline */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          boxShadow: isFocused
            ? `inset 0 0 0 1px #0B0B0F`
            : `inset 0 0 0 0.5px ${HAIRLINE}`,
          padding: "13px 14px 32px",
          position: "relative",
          minHeight: 96,
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={3}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            fontFamily: "inherit",
            letterSpacing: "-0.005em",
            lineHeight: 1.5,
          }}
        />
        {/* word count bottom-right */}
        {wc > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 12,
              fontSize: 10.5,
              color: wc >= 20 ? "#1F5C2C" : "#8E8E93",
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.02em",
            }}
          >
            {wc}w
          </div>
        )}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function ReflectPage() {
  const { reflections, addReflection, addMorningBrief } = useDoIt();
  const today = todayISO();

  const [fields, setFields] = useState<PromptFields>({
    fellShort: "",
    actedWell: "",
    correction: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const existing = reflections.find((r) => r.dateISO === today);

  const past = [...reflections]
    .filter((r) => r.dateISO !== today && r.correction)
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
    .slice(0, 3);

  function setField(key: keyof PromptFields, val: string) {
    setFields((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    addReflection({
      dateISO: today,
      fellShort: fields.fellShort,
      actedWell: fields.actedWell,
      correction: fields.correction,
    });
    if (fields.correction.trim()) {
      addMorningBrief({
        dateISO: tomorrowISO(),
        friction: fields.correction.trim(),
      });
    }
    setSaved(true);
  }

  const totalWords =
    wordCount(fields.fellShort) +
    wordCount(fields.actedWell) +
    wordCount(fields.correction);
  const allFilled =
    fields.fellShort.trim() &&
    fields.actedWell.trim() &&
    fields.correction.trim();

  return (
    <>
      <Topbar
        name="write the truth."
        sub={saved ? "saved. → tomorrow sharper." : "evening audit."}
      />

      {/* heading */}
      <div style={{ padding: "2px 6px 18px" }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
            lineHeight: 1,
          }}
        >
          reflect.
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: "#8E8E93",
            fontWeight: 600,
            letterSpacing: "0.04em",
            marginTop: 6,
            textTransform: "lowercase",
          }}
        >
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>
            {new Date()
              .toLocaleDateString("en-US", { weekday: "long" })
              .toLowerCase()}
          </b>
          {totalWords > 0 && <> · {totalWords}w written</>}
        </div>
      </div>

      {/* show saved state if already done today */}
      {saved || existing ? (
        <>
          {/* saved recap card */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 22,
              padding: 18,
              boxShadow: SHADOW_PAPER,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#C7F0CF",
                  color: "#1F5C2C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0B0B0F",
                  letterSpacing: "-0.012em",
                }}
              >
                reflected.{" "}
                <span style={{ color: "#6E6E73", fontWeight: 600 }}>
                  → closed.
                </span>
              </div>
            </div>

            <div
              style={{
                background: "#FBFAF8",
                borderRadius: 14,
                padding: 14,
                boxShadow: `inset 0 0 0 0.5px ${HAIRLINE}`,
              }}
            >
              {[
                {
                  label: "fell short",
                  text: fields.fellShort || existing?.fellShort,
                },
                {
                  label: "acted well",
                  text: fields.actedWell || existing?.actedWell,
                },
                {
                  label: "correction",
                  text: fields.correction || existing?.correction,
                },
              ]
                .filter((row) => row.text)
                .map((row, i) => (
                  <div
                    key={row.label}
                    style={{
                      padding: "8px 0",
                      borderTop:
                        i > 0 ? `0.5px solid ${HAIRLINE_SOFT}` : "none",
                      fontSize: 12.5,
                      color: "#1C1C1E",
                      lineHeight: 1.45,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    <b
                      style={{
                        color: "#8E8E93",
                        fontWeight: 700,
                        fontSize: 10.5,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 3,
                      }}
                    >
                      {row.label}
                    </b>
                    {row.text}
                  </div>
                ))}
            </div>
          </div>

          {/* tomorrow brief card */}
          {(fields.correction || existing?.correction) && (
            <div
              style={{
                background: "linear-gradient(180deg,#FFF6E8 0%,#FFE9CC 100%)",
                borderRadius: 22,
                padding: 18,
                boxShadow: `${SHADOW_PAPER},inset 0 0 0 0.5px rgba(122,80,20,0.08)`,
                marginBottom: 14,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#7A4A1A",
                }}
              >
                tomorrow brief
              </div>
              <div
                style={{
                  fontSize: 16.5,
                  fontWeight: 700,
                  letterSpacing: "-0.018em",
                  color: "#3A2410",
                  marginTop: 8,
                  lineHeight: 1.32,
                }}
              >
                first block:{" "}
                <b style={{ fontWeight: 800, color: "#1F1305" }}>
                  {fields.correction || existing?.correction}
                </b>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "#7A4A1A",
                  fontWeight: 600,
                  marginTop: 10,
                  letterSpacing: "-0.005em",
                }}
              >
                → seeded from tonight's correction
              </div>
            </div>
          )}

          {/* re-edit link */}
          <div
            style={{
              textAlign: "center",
              fontSize: 12.5,
              color: "#6E6E73",
              fontWeight: 600,
              padding: "10px 0",
              cursor: "pointer",
              letterSpacing: "-0.005em",
            }}
            onClick={() => setSaved(false)}
          >
            edit tonight's entry
          </div>
        </>
      ) : (
        <>
          {/* prompt cards */}
          {PROMPTS.map((p) => (
            <PromptCard
              key={p.num}
              num={p.num}
              q={p.q}
              placeholder={p.placeholder}
              rotatedChip={p.rotatedChip}
              value={fields[p.field]}
              onChange={(v) => setField(p.field, v)}
              isFocused={focusedField === p.field}
              onFocus={() => setFocusedField(p.field)}
              onBlur={() => setFocusedField(null)}
              isSaved={false}
            />
          ))}

          {/* action zone */}
          <div
            style={{
              margin: "18px 4px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 10,
            }}
          >
            <button
              onClick={handleSave}
              disabled={!allFilled}
              style={{
                background: allFilled
                  ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
                  : "#F4F5F7",
                color: allFilled ? "#fff" : "#8E8E93",
                border: "none",
                borderRadius: 999,
                padding: "16px 22px",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.012em",
                boxShadow: allFilled ? SHADOW_PRESS_INK : "none",
                fontFamily: "inherit",
                cursor: allFilled ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              save
              <span
                style={{
                  fontWeight: 600,
                  color: allFilled ? "#A8A8AC" : "#8E8E93",
                  fontSize: 13.5,
                }}
              >
                → tomorrow sharper.
              </span>
            </button>

            <div
              style={{
                textAlign: "center",
                fontSize: 12.5,
                color: "#6E6E73",
                fontWeight: 600,
                padding: "10px 0",
                cursor: "pointer",
                letterSpacing: "-0.005em",
                borderTop: `0.5px solid ${HAIRLINE_SOFT}`,
              }}
            >
              skip for tonight
            </div>
          </div>
        </>
      )}

      {/* past corrections */}
      {past.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#8E8E93",
              marginBottom: 10,
              padding: "0 4px",
            }}
          >
            recent corrections
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {past.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  padding: "14px 16px",
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "#8E8E93",
                  }}
                >
                  {fmtDate(r.dateISO)}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: "#0B0B0F",
                    fontWeight: 700,
                    letterSpacing: "-0.012em",
                    marginTop: 6,
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

      <div style={{ height: 110 }} />
    </>
  );
}
