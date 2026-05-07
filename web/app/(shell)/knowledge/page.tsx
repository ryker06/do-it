"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import RightDrawer from "@/components/RightDrawer";
import type { DomainId } from "@/lib/types";

// Blue heatmap ramp — calm, NOT GitHub-green
const HM_COLORS = [
  "#F2F4F7",
  "#E2EAF6",
  "#C7D7F0",
  "#9DB9E6",
  "#5C88D4",
  "#1E5BC0",
];
const DOW_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const DOMAIN_FILTERS: { id: DomainId | "all"; name: string }[] = [
  { id: "all", name: "all" },
  { id: "business", name: "business" },
  { id: "religion", name: "religion" },
  { id: "learning", name: "learning" },
  { id: "fitness", name: "fitness" },
  { id: "home", name: "home" },
  { id: "food", name: "food" },
];

const DOMAIN_BG2: Record<DomainId, [string, string]> = {
  business: ["#E2EEFF", "#C9DBFF"],
  religion: ["#E2F4E6", "#C0E5C8"],
  learning: ["#FFE0E8", "#FFC9D6"],
  fitness: ["#FFD0DA", "#FFB6C5"],
  home: ["#EAEFF3", "#D4DCE3"],
  food: ["#FFF0DD", "#FFDFB5"],
};

const DOMAIN_INK: Record<DomainId, string> = {
  business: "#1748A8",
  religion: "#1F5C2C",
  learning: "#7A2A3C",
  fitness: "#7A2A3C",
  home: "#36475A",
  food: "#7A4A1A",
};

// Get last 56 days as ISO strings, most-recent last (so column 0 = 8 weeks ago)
function getLast56Dates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// Group into 8 weeks of 7 days, each column = one week, rows = Mon–Sun
function buildGrid(dates: string[]): string[][] {
  const cols: string[][] = [];
  for (let w = 0; w < 8; w++) {
    cols.push(dates.slice(w * 7, w * 7 + 7));
  }
  return cols;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Simple sparkline: return last 8 weeks count array per domain
function buildSparkline(
  counts: Record<string, number>,
  dates: string[],
): number[] {
  const weeks: number[] = [];
  for (let w = 0; w < 8; w++) {
    const weekDates = dates.slice(w * 7, w * 7 + 7);
    weeks.push(weekDates.reduce((sum, d) => sum + (counts[d] ?? 0), 0));
  }
  return weeks;
}

function hmLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  if (count <= 6) return 4;
  return 5;
}

function sparkLevel(val: number, max: number): number {
  if (max === 0 || val === 0) return 0;
  const ratio = val / max;
  if (ratio < 0.17) return 1;
  if (ratio < 0.34) return 2;
  if (ratio < 0.5) return 3;
  if (ratio < 0.75) return 4;
  return 5;
}

const SPARK_HEIGHTS = [4, 6, 9, 13, 16, 18];

export default function KnowledgePage() {
  const { insights, blocks, domains } = useDoIt();
  const [selectedDomain, setSelectedDomain] = useState<DomainId | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dates = getLast56Dates();
  const grid = buildGrid(dates);
  const today = todayISO();

  function countForDate(dateISO: string, domainId?: DomainId): number {
    const insightCount = insights.filter((ins) => {
      const insDate = new Date(ins.capturedAt).toISOString().slice(0, 10);
      return (
        insDate === dateISO && (domainId == null || ins.domainId === domainId)
      );
    }).length;

    const theoryCount = blocks.filter((b) => {
      const bDate = b.scheduledFor;
      return (
        bDate === dateISO &&
        b.mode === "theory" &&
        (domainId == null || b.domain === domainId)
      );
    }).length;

    return insightCount + theoryCount;
  }

  // Build count map for heatmap
  const countMap: Record<string, number> = {};
  dates.forEach((d) => {
    countMap[d] = countForDate(
      d,
      selectedDomain === "all" ? undefined : selectedDomain,
    );
  });

  // Total for summary phrase
  const totalCaptures = dates.reduce((sum, d) => sum + (countMap[d] ?? 0), 0);

  // Per-domain sparkline data
  const domainIds: DomainId[] = [
    "business",
    "religion",
    "learning",
    "fitness",
    "home",
    "food",
  ];
  const domainSparklines = domainIds.map((did) => {
    const domainCounts: Record<string, number> = {};
    dates.forEach((d) => {
      domainCounts[d] = countForDate(d, did);
    });
    const spark = buildSparkline(domainCounts, dates);
    const total = spark.reduce((a, b) => a + b, 0);
    const max = Math.max(...spark, 1);
    return { id: did, spark, total, max, domainCounts };
  });

  // Day detail for drawer
  const selectedDayInsights = selectedDate
    ? insights.filter((ins) => {
        const insDate = new Date(ins.capturedAt).toISOString().slice(0, 10);
        return insDate === selectedDate;
      })
    : [];
  const selectedDayTheory = selectedDate
    ? blocks.filter(
        (b) => b.scheduledFor === selectedDate && b.mode === "theory",
      )
    : [];

  function handleCellClick(date: string) {
    setSelectedDate(date);
    setDrawerOpen(true);
  }

  return (
    <>
      <Topbar name="knowledge." sub="what you've absorbed over time." />

      {/* Domain filter chips */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "0 4px 16px",
          scrollbarWidth: "none",
        }}
      >
        {DOMAIN_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedDomain(f.id)}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 600,
              color: selectedDomain === f.id ? "#fff" : "#6E6E73",
              background: selectedDomain === f.id ? "#0B0B0F" : "#FFFFFF",
              padding: "7px 12px",
              borderRadius: 999,
              boxShadow:
                selectedDomain === f.id
                  ? "none"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              letterSpacing: "-0.005em",
              fontFamily: "inherit",
              border: "none",
              cursor: "pointer",
            }}
          >
            {f.id !== "all" && f.id !== undefined && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    selectedDomain === f.id
                      ? "rgba(255,255,255,0.5)"
                      : DOMAIN_BG2[f.id as DomainId][1],
                }}
              />
            )}
            {f.name}
          </button>
        ))}
      </div>

      {/* heading */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "2px 6px 14px",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#0B0B0F",
          }}
        >
          knowledge
        </div>
        <div style={{ fontSize: 11.5, color: "#8E8E93", fontWeight: 600 }}>
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>{totalCaptures}</b>{" "}
          captures
        </div>
      </div>

      {/* HERO heatmap card */}
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "20px 18px 18px",
          marginBottom: 18,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18),0 36px 64px -32px rgba(20,20,30,0.18)",
        }}
      >
        {/* heatmap top row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              color: "#8E8E93",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            last 8 weeks
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#1C1C1E",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.012em",
            }}
          >
            <b style={{ color: "#0B0B0F", fontWeight: 800 }}>{totalCaptures}</b>{" "}
            captures
          </div>
        </div>

        {/* Grid: 18px DOW col + 8 week cols × 7 rows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "18px repeat(8, 1fr)",
            gridTemplateRows: "repeat(7, 28px)",
            columnGap: 4,
            rowGap: 4,
            alignItems: "center",
            padding: "2px 0",
          }}
        >
          {DOW_LABELS.map((dow, rowIdx) => (
            <>
              {/* DOW label */}
              <div
                key={`dow-${rowIdx}`}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#8E8E93",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "right",
                  paddingRight: 2,
                  gridColumn: 1,
                  gridRow: rowIdx + 1,
                }}
              >
                {dow}
              </div>
              {/* 8 week cells for this row */}
              {grid.map((weekDates, colIdx) => {
                const date = weekDates[rowIdx];
                if (!date) {
                  return (
                    <div
                      key={`cell-empty-${colIdx}-${rowIdx}`}
                      style={{
                        gridColumn: colIdx + 2,
                        gridRow: rowIdx + 1,
                        height: 28,
                        borderRadius: 6,
                        background: "#F2F4F7",
                      }}
                    />
                  );
                }
                const count = countMap[date] ?? 0;
                const level = hmLevel(count);
                const isToday = date === today;
                return (
                  <div
                    key={`cell-${colIdx}-${rowIdx}`}
                    onClick={() => handleCellClick(date)}
                    style={{
                      gridColumn: colIdx + 2,
                      gridRow: rowIdx + 1,
                      height: 28,
                      borderRadius: 6,
                      background: HM_COLORS[level],
                      boxShadow: isToday
                        ? "0 0 0 2px #0B0B0F,0 0 0 4px #FFFFFF"
                        : "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    title={`${date}: ${count} capture${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 14,
            paddingTop: 12,
            borderTop: "0.5px solid rgba(60,60,67,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              color: "#8E8E93",
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            intensity
          </div>
          <div
            style={{
              display: "flex",
              gap: 3,
              marginLeft: "auto",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 600,
                letterSpacing: "-0.005em",
              }}
            >
              less
            </span>
            {HM_COLORS.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: c,
                  boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                }}
              />
            ))}
            <span
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 600,
                letterSpacing: "-0.005em",
              }}
            >
              more
            </span>
          </div>
        </div>

        {/* Summary phrase */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "0.5px solid rgba(60,60,67,0.10)",
            fontSize: 13.5,
            color: "#1C1C1E",
            fontWeight: 500,
            lineHeight: 1.45,
            letterSpacing: "-0.005em",
          }}
        >
          <b style={{ color: "#0B0B0F", fontWeight: 700 }}>{totalCaptures}</b>{" "}
          captures across 8 weeks.{" "}
          <span style={{ color: "#0050C8", fontWeight: 700 }}>→</span> keep
          absorbing.
        </div>
      </div>

      {/* Per-domain mini-rows */}
      <div style={{ padding: "0 4px", marginBottom: 110 }}>
        {domainSparklines.map((d) => {
          const [bg1, bg2] = DOMAIN_BG2[d.id];
          const ink = DOMAIN_INK[d.id];
          const domainInfo = domains.find((dom) => dom.id === d.id);
          const sparkMax = Math.max(...d.spark, 1);
          return (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 4px",
                borderBottom: "0.5px solid rgba(60,60,67,0.10)",
                cursor: "pointer",
              }}
              onClick={() =>
                setSelectedDomain(selectedDomain === d.id ? "all" : d.id)
              }
            >
              {/* domain disc */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: `linear-gradient(180deg,${bg1},${bg2})`,
                  color: ink,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  boxShadow:
                    "inset 0 0 0 0.5px rgba(20,20,30,0.06),0 2px 4px rgba(20,20,30,0.05)",
                }}
              >
                {d.id.slice(0, 2).toUpperCase()}
              </div>

              {/* body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    color: "#0B0B0F",
                    fontWeight: 700,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {d.id}
                  <span
                    style={{
                      color: "#8E8E93",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums",
                      marginLeft: 6,
                    }}
                  >
                    {d.total}
                  </span>
                </div>

                {/* sparkline */}
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    marginTop: 6,
                    alignItems: "flex-end",
                    height: 18,
                  }}
                >
                  {d.spark.map((val, i) => {
                    const lvl = sparkLevel(val, sparkMax);
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          background: HM_COLORS[Math.max(lvl, 1)],
                          borderRadius: 1.5,
                          minWidth: 3,
                          height: SPARK_HEIGHTS[lvl],
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "#8E8E93",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                ›
              </div>
            </div>
          );
        })}
      </div>

      {/* Right drawer — day detail */}
      {drawerOpen && (
        <RightDrawer onClose={() => setDrawerOpen(false)}>
          {selectedDate && (
            <div style={{ padding: "0 0 24px" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: "#0B0B0F",
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}
              >
                {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6E6E73",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  marginBottom: 14,
                }}
              >
                {selectedDayInsights.length + selectedDayTheory.length} captures
              </div>

              {selectedDayInsights.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#8E8E93",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      margin: "14px 0 8px",
                    }}
                  >
                    insights
                  </div>
                  {selectedDayInsights.map((ins) => (
                    <div
                      key={ins.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        background: "#FBFAF8",
                        borderRadius: 12,
                        marginBottom: 6,
                        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: "#E2EEFF",
                          color: "#0050C8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        I
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#0B0B0F",
                          fontWeight: 600,
                          letterSpacing: "-0.005em",
                          lineHeight: 1.4,
                        }}
                      >
                        {ins.text}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {selectedDayTheory.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#8E8E93",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      margin: "14px 0 8px",
                    }}
                  >
                    theory blocks
                  </div>
                  {selectedDayTheory.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "10px 12px",
                        background: "#FBFAF8",
                        borderRadius: 12,
                        marginBottom: 6,
                        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: "#E2F4E6",
                          color: "#1F5C2C",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        T
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#0B0B0F",
                          fontWeight: 600,
                          letterSpacing: "-0.005em",
                          lineHeight: 1.4,
                        }}
                      >
                        {b.title}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {selectedDayInsights.length === 0 &&
                selectedDayTheory.length === 0 && (
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#8E8E93",
                      padding: "24px 0",
                      textAlign: "center",
                    }}
                  >
                    nothing captured on this day.
                  </div>
                )}
            </div>
          )}
        </RightDrawer>
      )}
    </>
  );
}
