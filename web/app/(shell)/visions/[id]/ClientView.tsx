"use client";

import { useRouter } from "next/navigation";
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

const DOMAIN_AURA_DETAIL: Record<DomainId, string> = {
  business:
    "radial-gradient(closest-side, rgba(201,219,255,0.95), rgba(225,236,255,0.55) 50%, transparent 78%)",
  religion:
    "radial-gradient(closest-side, rgba(192,229,200,0.95), rgba(226,244,230,0.55) 50%, transparent 78%)",
  learning:
    "radial-gradient(closest-side, rgba(255,207,220,0.95), rgba(255,227,235,0.55) 50%, transparent 78%)",
  fitness:
    "radial-gradient(closest-side, rgba(255,182,197,0.95), rgba(255,208,218,0.55) 50%, transparent 78%)",
  home: "radial-gradient(closest-side, rgba(207,220,227,0.95), rgba(229,236,240,0.55) 50%, transparent 78%)",
  food: "radial-gradient(closest-side, rgba(255,224,178,0.95), rgba(255,243,224,0.55) 50%, transparent 78%)",
};

const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

function deadlineCountdown(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days < -1) return "moved";
  if (days <= 0) return "today";
  if (days < 7) return `${days}d left`;
  const weeks = Math.round(days / 7);
  return `${weeks} weeks out`;
}

const THREAD_ICONS = [
  <svg
    key="star"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4l1.6 5.2L19 11l-5.4 1.8L12 18l-1.6-5.2L5 11l5.4-1.8z" />
  </svg>,
  <svg
    key="zap"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L4 14h8l-1 8 9-12h-8l1-8z" />
  </svg>,
  <svg
    key="target"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>,
  <svg
    key="arrow"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>,
];

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { visions, blocks } = useDoIt();

  const visionId = id;
  const vision = visions.find((v) => v.id === visionId);

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
          Vision not found
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
          Go back
        </button>
      </div>
    );
  }

  const domainId = vision.domainId;
  const relatedBlocks = blocks
    .filter((b) => b.domain === domainId && b.status === "done")
    .slice(0, 3);

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
          position: "relative",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 0 0 0",
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
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
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
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: DOMAIN_BG[domainId],
              boxShadow: "inset 0 0 0 0.5px rgba(20,20,30,0.06)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {DOMAIN_NAMES[domainId]}
          </span>
        </div>
        {/* memoji */}
        <div className="me-avatar" style={{ marginLeft: "auto" }}>
          <img
            src="https://www.tapback.co/api/avatar/jay.webp?color=7"
            alt="Adam"
          />
        </div>
        {/* more */}
        <button
          onClick={() => router.push(`/visions/${visionId}/edit`)}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--inset,#F2F2F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
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
            strokeLinejoin="round"
          >
            <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>

      {/* scroll */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          overflowY: "auto",
          padding: "0 0 110px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {/* hero */}
        <div
          style={{
            position: "relative",
            padding: "30px 8px 28px",
            margin: "6px 0 22px",
            textAlign: "center",
            isolation: "isolate",
          }}
        >
          {/* aura layers */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 6,
              transform: "translateX(-50%)",
              width: 340,
              height: 260,
              borderRadius: "50%",
              filter: "blur(40px)",
              opacity: 0.85,
              zIndex: 0,
              pointerEvents: "none",
              background: DOMAIN_AURA_DETAIL[domainId],
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 54,
              transform: "translateX(-50%)",
              width: 200,
              height: 140,
              borderRadius: "50%",
              filter: "blur(28px)",
              opacity: 0.55,
              zIndex: 0,
              pointerEvents: "none",
              background: DOMAIN_AURA_DETAIL[domainId],
            }}
          />
          {/* big disc */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: 96,
              height: 96,
              borderRadius: "50%",
              margin: "0 auto 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: DOMAIN_BG[domainId],
              boxShadow:
                "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -3px 8px rgba(20,20,30,0.05), 0 8px 22px -10px rgba(40,80,180,0.28), 0 2px 4px rgba(20,20,30,0.05)",
              color: "var(--glyph,#0A0A0F)",
            }}
          >
            <DomainGlyph id={domainId} size={46} />
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: 38,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.045em",
              lineHeight: 1,
              marginBottom: 11,
            }}
          >
            {vision.title}
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontSize: 14.5,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.014em",
              lineHeight: 1.35,
              maxWidth: 300,
              margin: "0 auto",
            }}
          >
            {vision.blurb}
          </div>
          {/* Deadline + metric */}
          {(vision.deadline || vision.targetMetric) && (
            <div
              style={{
                position: "relative",
                zIndex: 2,
                marginTop: 16,
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              {vision.deadline && (
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {deadlineCountdown(vision.deadline)}
                </div>
              )}
              {vision.targetMetric && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--label-2,#6E6E73)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {vision.targetMetric}
                </div>
              )}
            </div>
          )}
        </div>

        {/* description */}
        {vision.description && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 6px",
                margin: "0 0 12px",
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Vision
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--hairline-2,rgba(60,60,67,0.06))",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                background: "var(--card,#fff)",
                borderRadius: 20,
                padding: "16px 17px",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
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
          </>
        )}

        {/* threads */}
        {vision.threads && vision.threads.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 6px",
                margin: "22px 0 12px",
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Threads
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--hairline-2,rgba(60,60,67,0.06))",
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  color: "var(--label-2,#6E6E73)",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                {vision.threads.length}
              </span>
            </div>
            <div
              style={{
                background: "var(--card,#fff)",
                borderRadius: 20,
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
                overflow: "hidden",
                position: "relative",
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
                  zIndex: 2,
                }}
              />
              {vision.threads.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 14px",
                    ...(i > 0
                      ? {
                          borderTop:
                            "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
                        }
                      : {}),
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "var(--inset,#F2F2F7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow:
                        "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                      color: "var(--ink-2,#1C1C1E)",
                    }}
                  >
                    {THREAD_ICONS[i % THREAD_ICONS.length]}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "var(--ink,#000)",
                        letterSpacing: "-0.022em",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.title}
                    </div>
                    {t.sub && (
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 500,
                          color: "var(--label-2,#6E6E73)",
                          letterSpacing: "-0.005em",
                          lineHeight: 1.2,
                        }}
                      >
                        {t.sub}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "var(--inset,#F2F2F7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow:
                        "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={8}
                      height={8}
                      fill="none"
                      stroke="var(--label-2,#6E6E73)"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* connected blocks */}
        {relatedBlocks.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 6px",
                margin: "0 0 12px",
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Recent blocks
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "var(--hairline-2,rgba(60,60,67,0.06))",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 22,
              }}
            >
              {relatedBlocks.map((b) => (
                <div
                  key={b.id}
                  style={{
                    position: "relative",
                    background: "var(--card,#fff)",
                    borderRadius: 16,
                    padding: "11px 13px 11px 11px",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    boxShadow:
                      "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 16,
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: DOMAIN_BG[domainId],
                      boxShadow:
                        "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
                      color: "var(--glyph,#0A0A0F)",
                    }}
                  >
                    <DomainGlyph id={domainId} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "var(--ink,#000)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--label-2,#6E6E73)",
                        letterSpacing: "-0.002em",
                        lineHeight: 1.15,
                      }}
                    >
                      {b.durationMin} min
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: "var(--green-soft,rgba(52,199,89,0.14))",
                      color: "var(--green-deep,#248A3D)",
                    }}
                  >
                    Done
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
