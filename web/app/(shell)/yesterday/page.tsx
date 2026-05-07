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

const DOMAIN_DOT: Record<DomainId, string> = {
  business: "#A8C2F0",
  religion: "#9CD0AB",
  learning: "#F0AEC0",
  fitness: "#F09AAE",
  home: "#B5C4CD",
  food: "#FFD08A",
};

const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

const ALL_DOMAIN_IDS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
];

export default function YesterdayPage() {
  const router = useRouter();
  const { blocks, domains } = useDoIt();

  // "Yesterday" — only blocks completed yesterday
  const yesterdayISO = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const doneBlocks = blocks.filter(
    (b) =>
      b.status === "done" &&
      b.startedAt !== undefined &&
      new Date(b.startedAt).toISOString().slice(0, 10) === yesterdayISO,
  );
  const timelineItems = [...doneBlocks].sort((a, b) => a.order - b.order);

  const totalBlocks = doneBlocks.length;
  const totalMin = doneBlocks.reduce(
    (acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0),
    0,
  );
  const movedCount = 0;

  // Per-domain minutes
  const domainMins: Partial<Record<DomainId, number>> = {};
  for (const b of doneBlocks) {
    const id = b.domain;
    domainMins[id] =
      (domainMins[id] ?? 0) + b.durationMin + (b.adjustedMin ?? 0);
  }

  const touchedDomains = ALL_DOMAIN_IDS.filter(
    (id) => (domainMins[id] ?? 0) > 0,
  );

  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;

  // Yesterday's date label
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayName = yesterday.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = yesterday.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "54px 20px 0",
        background:
          "radial-gradient(120% 50% at 50% 0%, rgba(238,243,248,0.7) 0%, rgba(255,255,255,0) 55%), #FFFFFF",
      }}
    >
      {/* topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 4px",
          marginBottom: 18,
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
          aria-label="Back"
        >
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="var(--ink-2,#1C1C1E)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label-3,#A8A8AE)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Yesterday
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.024em",
              lineHeight: 1.1,
            }}
          >
            {dayName}{" "}
            <span style={{ color: "var(--label,#8E8E93)", fontWeight: 500 }}>
              · {monthDay}
            </span>
          </div>
        </div>
      </div>

      {/* hero strip */}
      <div
        style={{
          margin: "0 4px 18px",
          padding: "16px 18px",
          background: "linear-gradient(180deg, #EEF3F8 0%, #E3EAF1 100%)",
          borderRadius: 20,
          position: "relative",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 0.5px rgba(74,90,106,0.14), 0 1px 2px rgba(20,30,45,0.03), 0 8px 22px -14px rgba(20,30,45,0.10)",
        }}
      >
        {/* dusk mark */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 0 0.5px rgba(74,90,106,0.14)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={11}
            height={11}
            fill="none"
            stroke="#4A5A6A"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v16M4 12h16" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#4A5A6A",
            letterSpacing: "-0.012em",
            lineHeight: 1.35,
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <span
            style={{
              color: "var(--ink-2,#1C1C1E)",
              fontWeight: 700,
              letterSpacing: "-0.018em",
            }}
          >
            {totalBlocks}
          </span>
          <span>blocks</span>
          {totalMin > 0 && (
            <>
              <span style={{ color: "#6E7E8E" }}>·</span>
              {hh > 0 && (
                <span
                  style={{ color: "var(--ink-2,#1C1C1E)", fontWeight: 700 }}
                >
                  {hh}
                  <span
                    style={{ fontWeight: 600, color: "#6E7E8E", fontSize: 11 }}
                  >
                    h
                  </span>{" "}
                  {mm}
                  <span
                    style={{ fontWeight: 600, color: "#6E7E8E", fontSize: 11 }}
                  >
                    m
                  </span>
                </span>
              )}
              {hh === 0 && (
                <span
                  style={{ color: "var(--ink-2,#1C1C1E)", fontWeight: 700 }}
                >
                  {mm}
                  <span
                    style={{ fontWeight: 600, color: "#6E7E8E", fontSize: 11 }}
                  >
                    m
                  </span>
                </span>
              )}
              <span>focused.</span>
            </>
          )}
        </div>
        {movedCount > 0 && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              fontWeight: 500,
              color: "#6E7E8E",
              letterSpacing: "-0.005em",
            }}
          >
            {movedCount} paused,{" "}
            <span style={{ color: "#2F5A3E", fontWeight: 600 }}>
              picked up today
            </span>
            .
          </div>
        )}
        {totalBlocks === 0 && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              fontWeight: 500,
              color: "#6E7E8E",
            }}
          >
            A quiet day. Rest counts too.
          </div>
        )}
      </div>

      {/* scrollable timeline */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2px 4px 130px",
          margin: "0 -4px",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
        }}
      >
        {timelineItems.length > 0 && (
          <>
            {/* section eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 6px",
                margin: "2px 0 14px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--label-3,#A8A8AE)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                How yesterday breathed
              </span>
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(60,60,67,0.06)",
                }}
              />
            </div>

            {/* timeline */}
            <div style={{ position: "relative", paddingLeft: 30 }}>
              {/* vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 8,
                  bottom: 8,
                  width: 1.5,
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(60,60,67,0.10) 6%, rgba(60,60,67,0.10) 94%, transparent 100%)",
                  borderRadius: 2,
                }}
              />

              {timelineItems.map((b) => {
                const d = domains.find((x) => x.id === b.domain);
                const isDone = b.status === "done";
                const isMoved = false;

                return (
                  <div
                    key={b.id}
                    style={{ position: "relative", marginBottom: 14 }}
                  >
                    {/* timeline dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: -19,
                        top: "calc(30px - 5px)",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: isDone ? "#248A3D" : "#fff",
                        boxShadow: isDone
                          ? "0 0 0 1.5px #248A3D, 0 0 0 3px #fff"
                          : "0 0 0 1.5px #6E7E8E, 0 0 0 3px #fff",
                        opacity: isDone ? 0.8 : 1,
                      }}
                    />

                    {/* row */}
                    <div
                      style={{
                        height: 60,
                        background: isDone
                          ? "transparent"
                          : "linear-gradient(180deg,#FAFCFE 0%,#F4F7FB 100%)",
                        borderRadius: 18,
                        padding: "0 12px 0 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        boxShadow: isDone
                          ? "inset 0 0 0 0.5px rgba(60,60,67,0.06)"
                          : "inset 0 0 0 0.5px rgba(74,90,106,0.14), 0 1px 1px rgba(20,30,45,0.02)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {!isDone && (
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
                      )}

                      {/* domain disc */}
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          background: DOMAIN_BG[b.domain],
                          filter: "saturate(0.55)",
                          opacity: 0.78,
                          boxShadow:
                            "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
                        }}
                      >
                        <DomainGlyph id={b.domain} size={17} />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: isMoved
                              ? "#4A5A6A"
                              : "var(--label-2,#6E6E73)",
                            letterSpacing: "-0.018em",
                            lineHeight: 1.18,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {b.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: "var(--label-3,#A8A8AE)",
                            letterSpacing: "0.005em",
                            lineHeight: 1.1,
                          }}
                        >
                          <span
                            style={{
                              color: "var(--label,#8E8E93)",
                              fontWeight: 700,
                              letterSpacing: "0.02em",
                            }}
                          >
                            {d?.name ?? b.domain}
                          </span>
                          <span style={{ color: "rgba(60,60,67,0.22)" }}>
                            ·
                          </span>
                          <span>
                            {b.durationMin + (b.adjustedMin ?? 0)} min
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                          marginLeft: 6,
                        }}
                      >
                        {isDone ? (
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              background: "rgba(52,199,89,0.14)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow:
                                "inset 0 0 0 0.5px rgba(52,199,89,0.18)",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width={11}
                              height={11}
                              fill="none"
                            >
                              <path
                                d="M5 12l4 4L19 6"
                                stroke="#248A3D"
                                strokeWidth={3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 9.5,
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              padding: "5px 9px 5px 7px",
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.7)",
                              color: "#4A5A6A",
                              boxShadow:
                                "inset 0 0 0 0.5px rgba(74,90,106,0.14)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width={9}
                              height={9}
                              fill="none"
                              stroke="#4A5A6A"
                              strokeWidth={2.2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                            Picked up today
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {timelineItems.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0 20px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label,#8E8E93)",
              letterSpacing: "-0.012em",
            }}
          >
            No activity recorded for yesterday.
          </div>
        )}

        {/* domain dot strip */}
        <div
          style={{
            margin: "18px 4px 14px",
            padding: "14px 16px",
            background: "#fff",
            borderRadius: 18,
            position: "relative",
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
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--label-3,#A8A8AE)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Domains touched
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {ALL_DOMAIN_IDS.map((id) => {
              const mins = domainMins[id] ?? 0;
              const touched = mins > 0;
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: touched ? DOMAIN_DOT[id] : "transparent",
                      boxShadow: touched
                        ? "inset 0 0 0 0.5px rgba(20,20,30,0.08)"
                        : "inset 0 0 0 1px rgba(60,60,67,0.18)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: touched
                        ? "var(--label-2,#6E6E73)"
                        : "var(--label-3,#A8A8AE)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {DOMAIN_NAMES[id]}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: touched ? 600 : 500,
                      color: touched
                        ? "var(--label,#8E8E93)"
                        : "var(--label-3,#A8A8AE)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {touched ? `${mins}m` : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* reflection card */}
        <div
          style={{
            margin: "0 4px 18px",
            padding: "14px",
            background: "#fff",
            borderRadius: 18,
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
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
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(180deg,#F7F8FB 0%, #ECEFF4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={15}
              height={15}
              fill="none"
              stroke="#4A5A6A"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
              <path d="M14 7l3 3" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--ink-2,#1C1C1E)",
                letterSpacing: "-0.018em",
              }}
            >
              Add a reflection
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                letterSpacing: "-0.005em",
              }}
            >
              One line on how yesterday felt.
            </div>
          </div>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--inset,#F2F2F7)",
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
              stroke="var(--label-2,#6E6E73)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        </div>

        {/* back to today */}
        <div style={{ textAlign: "center", margin: "6px 4px 22px" }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.005em",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: 999,
              fontFamily: "inherit",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={10}
              height={10}
              fill="none"
              stroke="var(--label-2,#6E6E73)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            Back to today
          </button>
        </div>
      </div>
    </div>
  );
}
