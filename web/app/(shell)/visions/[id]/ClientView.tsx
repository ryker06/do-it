"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(135deg,#E2EEFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(135deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(135deg,#FFE0E8 0%,#FFC9D6 100%)",
  fitness: "linear-gradient(135deg,#FFD0DA 0%,#FFB6C5 100%)",
  home: "linear-gradient(135deg,#EAEFF3 0%,#D4DCE3 100%)",
  food: "linear-gradient(135deg,#FFF0DD 0%,#FFDFB5 100%)",
};

const DOMAIN_INK: Record<DomainId, string> = {
  business: "#1748A8",
  religion: "#1F5C2C",
  learning: "#7A2A3C",
  fitness: "#7A2A3C",
  home: "#36475A",
  food: "#7A4A1A",
};

function deadlineCountdown(deadline: string): { label: string; tint: "green" | "warm" | "cool" } {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days < -1) return { label: "moved", tint: "warm" };
  if (days <= 0) return { label: "today", tint: "warm" };
  if (days < 7) return { label: `${days}d left`, tint: "warm" };
  const weeks = Math.round(days / 7);
  if (weeks < 52) return { label: `${weeks}w out`, tint: "cool" };
  return { label: `${Math.round(weeks / 52)} yr`, tint: "green" };
}

function resolveDeadlineNumerals(deadline: string): { num: string; unit: string } {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days <= 0) return { num: "0", unit: "days" };
  if (days < 7) return { num: String(days), unit: days === 1 ? "day" : "days" };
  const weeks = Math.round(days / 7);
  if (weeks < 52) return { num: String(weeks), unit: weeks === 1 ? "week" : "weeks" };
  const yrs = Math.round(weeks / 52);
  return { num: String(yrs), unit: yrs === 1 ? "year" : "years" };
}

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { visions, goals, updateVision } = useDoIt();
  const [editingNextMove, setEditingNextMove] = useState(false);
  const [nextMoveDraft, setNextMoveDraft] = useState("");

  const vision = visions.find((v) => v.id === id);

  if (!vision) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--label,#8E8E93)" }}>
          vision not found.
        </div>
        <button
          onClick={() => router.back()}
          style={{ fontSize: 14, color: "#0A84FF", background: "none", border: "none", cursor: "pointer" }}
        >
          go back
        </button>
      </div>
    );
  }

  const domainId = vision.domainId;
  const visionId = vision.id;
  const vGoals = goals.filter((g) => g.visionId === visionId);
  const deadlineInfo = vision.deadline ? deadlineCountdown(vision.deadline) : null;
  const deadlineNums = vision.deadline ? resolveDeadlineNumerals(vision.deadline) : null;

  // Deadline chip tint styles
  const CHIP_TINT: Record<"green" | "warm" | "cool", { bg: string; color: string }> = {
    green: { bg: "#C7F0CF", color: "#1F5C2C" },
    warm: { bg: "#FFE7EC", color: "#7A2A3C" },
    cool: { bg: "#E2EEFF", color: "#0050C8" },
  };

  function handleSaveNextMove() {
    if (nextMoveDraft.trim()) {
      updateVision(visionId, { nextMove: nextMoveDraft.trim() });
    }
    setEditingNextMove(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF" }}>
      {/* back row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px 6px", flexShrink: 0 }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#F4F5F7",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            border: "none", cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" width={11} height={11} fill="none"
            stroke="#1C1C1E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E8E93" }}>
          {domainId}
        </span>
      </div>

      {/* scroll body */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 110 }}>

        {/* Full-bleed cover */}
        <div style={{
          position: "relative", height: 220,
          background: DOMAIN_BG[domainId],
          overflow: "hidden",
          marginBottom: 0,
        }}>
          {/* dot texture */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 18% 22%,rgba(255,255,255,0.55) 1.5px,transparent 2px),radial-gradient(circle at 70% 70%,rgba(255,255,255,0.45) 1.5px,transparent 2px)",
            backgroundSize: "18px 18px", opacity: 0.6, pointerEvents: "none",
          }} />

          {/* domain glyph center */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,255,255,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 0.5px rgba(20,20,30,0.06)",
            }}>
              <DomainGlyph id={domainId} size={32} />
            </div>
          </div>

          {/* deadline chip — rotated -7deg, top-right */}
          {deadlineInfo && (
            <div style={{
              position: "absolute", top: 14, right: 14,
              display: "inline-flex", alignItems: "center", gap: 6,
              background: CHIP_TINT[deadlineInfo.tint].bg,
              color: CHIP_TINT[deadlineInfo.tint].color,
              padding: "6px 12px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, letterSpacing: "-0.005em",
              transform: "rotate(-7deg)",
              boxShadow: "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset",
              fontVariantNumeric: "tabular-nums",
            }}>
              {deadlineInfo.label}
            </div>
          )}
        </div>

        {/* Detail body */}
        <div style={{ padding: "22px 22px 28px" }}>
          {/* eyebrow */}
          <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {domainId}
          </div>

          {/* identity BIG */}
          <div style={{
            fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em",
            color: "#0B0B0F", lineHeight: 1.1, marginTop: 6,
          }}>
            {vision.identity ?? vision.title}
          </div>

          {/* aim */}
          {vision.blurb && (
            <div style={{
              fontSize: 14.5, color: "#3A3A3C", fontWeight: 500,
              letterSpacing: "-0.005em", lineHeight: 1.5, marginTop: 10,
            }}>
              {vision.blurb}
            </div>
          )}

          {/* targetMetric */}
          {vision.targetMetric && (
            <div style={{
              fontSize: 13, fontWeight: 600, color: "#6E6E73",
              letterSpacing: "-0.005em", marginTop: 8,
            }}>
              {vision.targetMetric}
            </div>
          )}

          {/* deadline countdown big */}
          {deadlineNums && (
            <div style={{
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              marginTop: 18, padding: "14px 16px",
              background: "#F4F5F7", borderRadius: 16,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#8E8E93", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                deadline
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", color: "#0B0B0F", fontVariantNumeric: "tabular-nums" }}>
                {deadlineNums.num}
                <small style={{ fontSize: 11, fontWeight: 600, color: "#8E8E93", marginLeft: 4, letterSpacing: 0 }}>
                  {deadlineNums.unit}
                </small>
              </div>
            </div>
          )}

          {/* next move — editable inline */}
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8E8E93", marginBottom: 8 }}>
              next move
            </div>
            {editingNextMove ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  autoFocus
                  type="text"
                  value={nextMoveDraft}
                  onChange={(e) => setNextMoveDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNextMove();
                    if (e.key === "Escape") setEditingNextMove(false);
                  }}
                  placeholder="one concrete next move..."
                  style={{
                    flex: 1, background: "#F4F5F7", border: "none", outline: "none",
                    borderRadius: 10, padding: "9px 12px",
                    fontSize: 13.5, fontWeight: 500, color: "#0B0B0F",
                    fontFamily: "inherit", letterSpacing: "-0.01em",
                    boxShadow: "inset 0 0 0 1.5px #0A84FF",
                  }}
                />
                <button
                  onClick={handleSaveNextMove}
                  style={{
                    background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                    color: "#fff", border: "none", borderRadius: 10,
                    padding: "9px 14px", fontSize: 13, fontWeight: 600,
                    fontFamily: "inherit", cursor: "pointer",
                  }}
                >
                  set
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setNextMoveDraft(vision.nextMove ?? ""); setEditingNextMove(true); }}
                style={{
                  background: "#F4F5F7", border: "none", cursor: "pointer",
                  fontFamily: "inherit", textAlign: "left", width: "100%",
                  padding: "11px 14px", borderRadius: 14,
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                }}
              >
                <div style={{
                  fontSize: 13.5, fontWeight: 600,
                  color: vision.nextMove ? "#1C1C1E" : "#8E8E93",
                  letterSpacing: "-0.01em", lineHeight: 1.4,
                }}>
                  {vision.nextMove ?? "tap to set next move →"}
                </div>
              </button>
            )}
          </div>

          {/* Goals nested */}
          <div style={{ marginTop: 22 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 10.5, fontWeight: 700, color: "#8E8E93",
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10,
            }}>
              <span>goals</span>
              <Link
                href={`/goals/new?visionId=${vision.id}`}
                style={{ color: "#0A84FF", letterSpacing: "-0.005em", textTransform: "none", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              >
                + goal
              </Link>
            </div>

            {vGoals.length === 0 && (
              <div style={{
                padding: "14px 16px",
                background: "#FFFFFF",
                borderRadius: 14,
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                fontSize: 13, fontWeight: 500, color: "#8E8E93",
              }}>
                no goals yet · add one above
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {vGoals.map((g) => {
                const diff = new Date(g.deadlineISO).getTime() - Date.now();
                const daysLeft = Math.max(0, Math.round(diff / 86_400_000));
                const weeksLeft = Math.round(daysLeft / 7);
                const deadlineStr = daysLeft <= 0 ? "due" : daysLeft < 7 ? `${daysLeft}d` : `${weeksLeft}w`;
                const pct = Math.min(1, g.targetValue > 0 ? g.currentValue / g.targetValue : 0);

                return (
                  <Link key={g.id} href={`/goals/detail?id=${g.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px",
                      background: "#FFFFFF", borderRadius: 14,
                      boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                      position: "relative",
                    }}>
                      {/* progress check */}
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: pct >= 1 ? "#C7F0CF" : "#F4F5F7",
                        boxShadow: pct >= 1 ? "inset 0 0 0 0.5px rgba(31,92,44,0.28)" : "inset 0 0 0 1.5px rgba(60,60,67,0.10)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 10, fontWeight: 800, color: "#1F5C2C",
                      }}>
                        {pct >= 1 && "✓"}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", letterSpacing: "-0.005em" }}>
                          {g.identityLine ?? g.unit}
                        </div>
                        <div style={{ fontSize: 12, color: "#6E6E73", fontWeight: 600, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
                          {g.currentValue} → {g.targetValue}{g.unit} · {deadlineStr}
                        </div>
                      </div>

                      {/* hairline track with dot */}
                      <div style={{
                        width: 80, height: 2,
                        background: "rgba(60,60,67,0.10)",
                        borderRadius: 999, position: "relative", flexShrink: 0,
                      }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: "#0B0B0F",
                          position: "absolute", top: -2.5,
                          left: `calc(${pct * 100}% - 3.5px)`,
                        }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* description if any */}
          {vision.description && (
            <div style={{
              marginTop: 18, padding: "16px 17px",
              background: "#FBFAF8", borderRadius: 16,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
              fontSize: 14.5, lineHeight: 1.5, color: "#1C1C1E",
              letterSpacing: "-0.012em", fontWeight: 450,
            }}>
              {vision.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
