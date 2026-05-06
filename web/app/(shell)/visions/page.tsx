"use client";

import Link from "next/link";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
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

function deadlineCountdown(deadline: string | undefined): string | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days < -1) return "moved";
  if (days <= 0) return "today";
  if (days < 7) return `${days}d left`;
  if (days < 60) return `${Math.round(days / 7)} weeks out`;
  return `${Math.round(days / 30)} months out`;
}

export default function VisionsPage() {
  const { visions, goals } = useDoIt();

  if (visions.length === 0) {
    return (
      <>
        <Topbar name="visions." sub="what you're becoming." />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px 110px",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            nothing yet.
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
              lineHeight: 1.42,
              textAlign: "center",
            }}
          >
            visions are the big threads that pull you forward.
          </div>
        </div>
      </>
    );
  }

  // Group visions by domain
  const byDomain = new Map<DomainId, typeof visions>();
  for (const v of visions) {
    const list = byDomain.get(v.domainId) ?? [];
    list.push(v);
    byDomain.set(v.domainId, list);
  }
  const domainOrder: DomainId[] = [
    "fitness",
    "business",
    "religion",
    "learning",
    "home",
    "food",
  ];

  return (
    <>
      <Topbar name="visions." sub="what you're becoming." />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          paddingBottom: 110,
        }}
      >
        {domainOrder.map((domId) => {
          const list = byDomain.get(domId);
          if (!list || list.length === 0) return null;
          return (
            <div key={domId}>
              {/* Domain group label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 6px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--label,#8E8E93)",
                }}
              >
                <div
                  className={`ddisc ${domId}`}
                  style={{ width: 18, height: 18, flexShrink: 0 }}
                >
                  <DomainGlyph id={domId} size={11} />
                </div>
                {domId}
              </div>

              {list.map((v) => {
                const deadline = deadlineCountdown(v.deadline);
                const vGoals = goals.filter((g) => g.visionId === v.id);

                return (
                  <Link
                    key={v.id}
                    href={`/visions/${v.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        background: "var(--card,#fff)",
                        borderRadius: 24,
                        padding: "18px 18px 16px",
                        boxShadow:
                          "0 0 0 0.5px rgba(60,60,67,0.05),0 8px 22px -14px rgba(20,20,30,0.12)",
                        overflow: "hidden",
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

                      {/* Deadline pill */}
                      {deadline && (
                        <div
                          style={{
                            position: "absolute",
                            top: 14,
                            right: 14,
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

                      {/* Identity line — BIG */}
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                          lineHeight: 1.05,
                          color: "var(--ink,#000)",
                          marginBottom: 4,
                          paddingRight: deadline ? 80 : 0,
                        }}
                      >
                        {v.identity ?? v.title}
                      </div>

                      {/* Aim sentence */}
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--label-2,#6E6E73)",
                          fontWeight: 500,
                          letterSpacing: "-0.012em",
                          lineHeight: 1.4,
                          marginBottom: vGoals.length > 0 ? 14 : 0,
                        }}
                      >
                        {v.blurb}
                      </div>

                      {/* Goals mini-chips */}
                      {vGoals.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            paddingTop: 12,
                            borderTop:
                              "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
                          }}
                        >
                          {vGoals.map((g) => {
                            const pct = Math.min(
                              1,
                              g.targetValue > 0
                                ? g.currentValue / g.targetValue
                                : 0,
                            );
                            return (
                              <div
                                key={g.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  background: "var(--inset,#F2F2F7)",
                                  borderRadius: 14,
                                  boxShadow:
                                    "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--ink,#000)",
                                    letterSpacing: "-0.012em",
                                    flex: 1,
                                  }}
                                >
                                  {g.identityLine ?? g.unit}
                                </div>
                                {/* hairline track */}
                                <div
                                  style={{
                                    width: 50,
                                    height: 3,
                                    background: "var(--inset-2,#EAEAEF)",
                                    borderRadius: 999,
                                    position: "relative",
                                    flexShrink: 0,
                                    boxShadow:
                                      "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
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
                                      boxShadow:
                                        "0 0 0 0.5px rgba(60,60,67,0.10)",
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    fontSize: 11.5,
                                    color: "var(--label-2,#6E6E73)",
                                    fontWeight: 600,
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {g.currentValue} / {g.targetValue}
                                  {g.unit}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
