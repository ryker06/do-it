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
};

const DOMAIN_AURA: Record<DomainId, string> = {
  business:
    "radial-gradient(closest-side, #C9DBFF, #E1ECFF 55%, transparent 78%)",
  religion:
    "radial-gradient(closest-side, #C0E5C8, #E2F4E6 55%, transparent 78%)",
  learning:
    "radial-gradient(closest-side, #FFCFDC, #FFE3EB 55%, transparent 78%)",
  fitness:
    "radial-gradient(closest-side, #FFB6C5, #FFD0DA 55%, transparent 78%)",
  home: "radial-gradient(closest-side, #CFDCE3, #E5ECF0 55%, transparent 78%)",
};

const MOMENTUM_LABEL: Record<string, string> = {
  strong: "Strong rhythm",
  stable: "Stable rhythm",
  weak: "Weak rhythm",
  inactive: "Inactive",
};

const DIRECTION_LABEL: Record<string, string> = {
  improving: "improving",
  stable: "holding steady",
  declining: "needs attention",
};

export function ClientView({ id }: { id: string }) {
  const router = useRouter();
  const { domains, visions, blocks } = useDoIt();

  const domainId = id as DomainId;
  const domain = domains.find((d) => d.id === domainId);

  if (!domain) {
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
          Domain not found
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

  const domainVisions = visions.filter((v) => v.domainId === domainId);
  const domainBlocks = blocks.filter(
    (b) => b.domainId === domainId && b.status === "done",
  );

  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "short" });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

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
      {/* topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px",
          marginBottom: 18,
          gap: 10,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow:
              "0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10)), 0 1px 2px rgba(20,20,30,0.04)",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={13}
            height={13}
            fill="none"
            stroke="var(--ink-2,#1C1C1E)"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.04em",
            }}
          >
            {dayName} · {timeStr}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              marginTop: 3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {domain.name}{" "}
            <span
              style={{
                color: "var(--label,#8E8E93)",
                fontWeight: 500,
                letterSpacing: "-0.022em",
              }}
            >
              · how it&apos;s moving
            </span>
          </div>
        </div>
        {/* domain disc */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: DOMAIN_BG[domainId],
            boxShadow:
              "0 0 0 2px #fff, 0 0 0 3px rgba(60,60,67,0.10), inset 0 -2px 4px rgba(20,20,30,0.04), 0 2px 6px rgba(20,20,30,0.10)",
            color: "var(--glyph,#0A0A0F)",
          }}
        >
          <DomainGlyph id={domainId} size={24} />
        </div>
      </div>

      {/* eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 6px",
          margin: "4px 0 14px",
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
          Rhythm
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
          active today
        </span>
      </div>

      {/* scroll */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2px 4px 110px",
          margin: "0 -4px",
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
            background: "var(--card,#fff)",
            borderRadius: 24,
            padding: "18px 18px 16px",
            marginBottom: 20,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 12px 28px -14px rgba(20,20,30,0.10), 0 26px 50px -28px rgba(20,20,30,0.14)",
            overflow: "hidden",
            isolation: "isolate",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* aura */}
          <div
            style={{
              position: "absolute",
              right: -70,
              top: -70,
              width: 280,
              height: 220,
              borderRadius: "50%",
              filter: "blur(34px)",
              opacity: 0.7,
              zIndex: 0,
              pointerEvents: "none",
              background: DOMAIN_AURA[domainId],
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "var(--green,#34C759)",
                boxShadow: "0 0 0 3px var(--green-soft,rgba(52,199,89,0.14))",
              }}
            />
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--green-deep,#248A3D)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              In motion
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              last 7 days
            </span>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 3,
              fontSize: 34,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.040em",
              lineHeight: 1.02,
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span>{MOMENTUM_LABEL[domain.momentum]}</span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--green-soft,rgba(52,199,89,0.14))",
                flexShrink: 0,
                marginBottom: 4,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
                fill="none"
                stroke="var(--green-deep,#248A3D)"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 17L12 9l3 3 5-6" />
                <path d="M14 7h6v6" />
              </svg>
            </span>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 3,
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
            }}
          >
            <span style={{ color: "var(--ink-2,#1C1C1E)", fontWeight: 600 }}>
              {DIRECTION_LABEL[domain.direction]}
            </span>
            <span style={{ color: "rgba(60,60,67,0.28)", fontWeight: 600 }}>
              ·
            </span>
            <span>active today</span>
          </div>
        </div>

        {/* stat strip */}
        <div
          style={{
            position: "relative",
            background: "var(--card,#fff)",
            borderRadius: 18,
            padding: "13px 16px",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.030em",
                lineHeight: 1,
              }}
            >
              {domainBlocks.length}{" "}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  marginLeft: 1,
                }}
              >
                blocks
              </span>
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              this week
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 26,
              background: "var(--hairline,rgba(60,60,67,0.10))",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink,#000)",
                letterSpacing: "-0.030em",
                lineHeight: 1,
              }}
            >
              {Math.round(
                domainBlocks.reduce((s, b) => s + b.durationMin, 0) / 60,
              )}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  margin: "0 2px",
                }}
              >
                h
              </span>
              {domainBlocks.reduce((s, b) => s + b.durationMin, 0) % 60}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  marginLeft: 1,
                }}
              >
                m
              </span>
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              focused
            </div>
          </div>
        </div>

        {/* recent activity eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 6px",
            margin: "-4px 0 14px",
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
            Recent
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
            {domainBlocks.length} blocks
          </span>
        </div>

        {/* recent activity */}
        {domainBlocks.length > 0 ? (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "4px 0",
              marginBottom: 22,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
              position: "relative",
              overflow: "hidden",
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
            {domainBlocks.slice(0, 4).map((b, i) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  position: "relative",
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
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--green-soft,rgba(52,199,89,0.14))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={9}
                    height={9}
                    fill="none"
                    stroke="var(--green-deep,#248A3D)"
                    strokeWidth={2.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5 9-11" />
                  </svg>
                </div>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink-2,#1C1C1E)",
                      letterSpacing: "-0.018em",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--label,#8E8E93)",
                      letterSpacing: "-0.005em",
                      lineHeight: 1.2,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--label-2,#6E6E73)",
                        fontWeight: 600,
                      }}
                    >
                      {b.durationMin} min
                    </span>
                    <span
                      style={{
                        color: "rgba(60,60,67,0.28)",
                        fontWeight: 600,
                        margin: "0 4px",
                      }}
                    >
                      ·
                    </span>
                    today
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 20,
              padding: "24px 16px",
              marginBottom: 22,
              textAlign: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
              }}
            >
              No completed blocks yet
            </div>
          </div>
        )}

        {/* visions eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 6px",
            margin: "0 0 14px",
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
            Visions in this domain
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
            {domainVisions.length} threads
          </span>
        </div>

        {/* vision rail */}
        {domainVisions.length > 0 ? (
          <div
            style={{
              margin: "0 -20px 22px",
              padding: "0 16px 4px",
              display: "flex",
              gap: 12,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
              maskImage:
                "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
            }}
          >
            {domainVisions.map((v) => (
              <button
                key={v.id}
                onClick={() => router.push(`/visions/${v.id}`)}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: 168,
                  background: "var(--card,#fff)",
                  borderRadius: 18,
                  padding: 13,
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 8px 18px -14px rgba(20,20,30,0.10)",
                  overflow: "hidden",
                  isolation: "isolate",
                  minHeight: 118,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  scrollSnapAlign: "start",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: -30,
                    top: -26,
                    width: 140,
                    height: 110,
                    borderRadius: "50%",
                    filter: "blur(22px)",
                    opacity: 0.65,
                    zIndex: 0,
                    pointerEvents: "none",
                    background: DOMAIN_AURA[domainId],
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 3,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: DOMAIN_BG[domainId],
                    boxShadow:
                      "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
                    color: "var(--glyph,#0A0A0F)",
                  }}
                >
                  <DomainGlyph id={domainId} size={16} />
                </div>
                <div
                  style={{
                    position: "relative",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    marginTop: "auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.026em",
                      lineHeight: 1.15,
                    }}
                  >
                    {v.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--label-2,#6E6E73)",
                      letterSpacing: "-0.008em",
                      lineHeight: 1.2,
                    }}
                  >
                    {v.blurb}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 18,
              padding: "20px 16px",
              marginBottom: 22,
              textAlign: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
              }}
            >
              No visions in this domain yet
            </div>
          </div>
        )}

        {/* next action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 6px",
            margin: "0 0 14px",
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
            Next
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
            suggested
          </span>
        </div>

        <div
          style={{
            position: "relative",
            background: "var(--card,#fff)",
            borderRadius: 18,
            padding: "13px 8px 13px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.05)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Do
          </span>
          <span
            style={{
              width: 1,
              height: 13,
              background: "var(--hairline,rgba(60,60,67,0.10))",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.018em",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {domain.nextAction}
          </span>
          <span
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 11px 7px 9px",
              borderRadius: 999,
              background: "var(--ink,#000)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "-0.005em",
              boxShadow: "0 1px 2px rgba(20,20,30,0.18)",
              cursor: "pointer",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={9}
              height={9}
              fill="none"
              stroke="#fff"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add as block
          </span>
        </div>
      </div>
    </div>
  );
}
