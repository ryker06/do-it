"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

function deadlineCountdown(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days < -1) return "moved";
  if (days <= 0) return "today";
  if (days < 7) return `${days}d left`;
  const weeks = Math.round(days / 7);
  if (weeks < 52) return `${weeks} weeks out`;
  return `${Math.round(weeks / 52)} yr out`;
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
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
          }}
        >
          vision not found.
        </div>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 14,
            color: "var(--blue,#007AFF)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          go back
        </button>
      </div>
    );
  }

  const domainId = vision.domainId;
  const visionId = vision.id;
  const vGoals = goals.filter((g) => g.visionId === visionId);
  const deadline = vision.deadline ? deadlineCountdown(vision.deadline) : null;

  function handleSaveNextMove() {
    if (nextMoveDraft.trim()) {
      updateVision(visionId, { nextMove: nextMoveDraft.trim() });
    }
    setEditingNextMove(false);
  }

  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* nav row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
          height: 36,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--inset,#F2F2F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={11}
            height={11}
            fill="none"
            stroke="var(--ink-2,#1C1C1E)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        {/* domain tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px 5px 7px",
            background: "var(--inset,#F2F2F7)",
            borderRadius: 999,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
          }}
        >
          <div
            className={`ddisc ${domainId}`}
            style={{ width: 14, height: 14 }}
          >
            <DomainGlyph id={domainId} size={9} />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {domainId}
          </span>
        </div>

        <div className="me-avatar" style={{ marginLeft: "auto" }}>
          <img
            src="https://www.tapback.co/api/avatar/jay.webp?color=7"
            alt="Adam"
          />
        </div>

        <button
          onClick={() => router.push(`/visions/${id}/edit`)}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--inset,#F2F2F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="var(--label-2,#6E6E73)"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>

      {/* scroll body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 0 110px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* Vision card — identity BIG at top per v2 canon */}
        <div
          style={{
            position: "relative",
            background: "var(--card,#fff)",
            borderRadius: 24,
            padding: "28px 28px 24px",
            boxShadow: "var(--shadow-card)",
            marginBottom: 18,
          }}
        >
          {/* inset highlight */}
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

          {/* deadline pill top-right */}
          {deadline && (
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label-2,#6E6E73)",
                background: "var(--inset,#F2F2F7)",
                padding: "4px 10px",
                borderRadius: 999,
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {deadline}
            </div>
          )}

          {/* identity line — display weight, BIG */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--ink,#000)",
              marginBottom: 8,
              paddingRight: deadline ? 120 : 0,
            }}
          >
            {vision.identity ?? vision.title}
          </div>

          {/* aim */}
          <div
            style={{
              fontSize: 15,
              color: "var(--label-2,#6E6E73)",
              fontWeight: 500,
              letterSpacing: "-0.012em",
              lineHeight: 1.4,
              marginBottom: 18,
            }}
          >
            {vision.blurb}
          </div>

          {/* targetMetric */}
          {vision.targetMetric && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.005em",
                marginBottom: 14,
              }}
            >
              {vision.targetMetric}
            </div>
          )}

          {/* next move — editable inline */}
          <div
            style={{
              borderTop: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
              paddingTop: 14,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--label,#8E8E93)",
                marginBottom: 6,
              }}
            >
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
                    flex: 1,
                    background: "var(--inset,#F2F2F7)",
                    border: "none",
                    outline: "none",
                    borderRadius: 10,
                    padding: "9px 12px",
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: "var(--ink,#000)",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    boxShadow: "inset 0 0 0 1.5px var(--blue,#007AFF)",
                  }}
                />
                <button
                  onClick={handleSaveNextMove}
                  style={{
                    background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "9px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  set
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNextMoveDraft(vision.nextMove ?? "");
                  setEditingNextMove(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  width: "100%",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: vision.nextMove
                      ? "var(--ink-2,#1C1C1E)"
                      : "var(--label,#8E8E93)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.4,
                  }}
                >
                  {vision.nextMove ?? "tap to set next move →"}
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Goals nested under this vision */}
        {vGoals.length > 0 && (
          <>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--label,#8E8E93)",
                marginBottom: 10,
                padding: "0 2px",
              }}
            >
              goals nested under this vision
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 22,
              }}
            >
              {vGoals.map((g) => {
                const pct = Math.min(
                  1,
                  g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
                );
                const diff = new Date(g.deadlineISO).getTime() - Date.now();
                const daysLeft = Math.max(0, Math.round(diff / 86_400_000));
                const weeksLeft = Math.round(daysLeft / 7);
                const deadlineStr =
                  daysLeft <= 0
                    ? "due"
                    : daysLeft < 7
                      ? `${daysLeft}d`
                      : `${weeksLeft}w`;

                return (
                  <Link
                    key={g.id}
                    href={`/goals/detail?id=${g.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        background: "var(--card,#fff)",
                        borderRadius: 18,
                        boxShadow: "var(--shadow-stack)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 18,
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                          pointerEvents: "none",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--ink,#000)",
                            letterSpacing: "-0.012em",
                            marginBottom: 2,
                          }}
                        >
                          {g.identityLine ?? g.unit}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--label-2,#6E6E73)",
                            fontWeight: 600,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {g.currentValue} → {g.targetValue}
                          {g.unit} · {deadlineStr}
                        </div>
                      </div>
                      {/* hairline track with dot */}
                      <div
                        style={{
                          width: 120,
                          height: 3,
                          background: "var(--inset-2,#EAEAEF)",
                          borderRadius: 999,
                          position: "relative",
                          flexShrink: 0,
                          boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--ink,#000)",
                            position: "absolute",
                            top: -2,
                            left: `calc(${pct * 100}% - 3.5px)`,
                            boxShadow: "0 0 0 0.5px rgba(60,60,67,0.10)",
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* + add goal */}
              <Link
                href={`/goals/new?visionId=${vision.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 16px",
                    background: "var(--card,#fff)",
                    borderRadius: 18,
                    boxShadow:
                      "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--label-2,#6E6E73)",
                  }}
                >
                  + add goal
                </div>
              </Link>
            </div>
          </>
        )}

        {/* description */}
        {vision.description && (
          <div
            style={{
              position: "relative",
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "16px 17px",
              boxShadow: "var(--shadow-stack)",
              fontSize: 14.5,
              lineHeight: 1.5,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.012em",
              fontWeight: 450,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                pointerEvents: "none",
              }}
            />
            {vision.description}
          </div>
        )}
      </div>
    </div>
  );
}
