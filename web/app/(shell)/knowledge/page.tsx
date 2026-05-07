"use client";

import { Suspense, useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import RightDrawer from "@/components/RightDrawer";
import type { DomainId } from "@/lib/types";

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

const SPARK_HEIGHTS = [4, 6, 9, 13, 16, 18];

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

function buildGrid(dates: string[]): string[][] {
  const cols: string[][] = [];
  for (let w = 0; w < 8; w++) cols.push(dates.slice(w * 7, w * 7 + 7));
  return cols;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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

function KnowledgeInner() {
  const { insights, blocks } = useDoIt();
  const [selectedDomain, setSelectedDomain] = useState<DomainId | "all">("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSelectedDate, setMobileSelectedDate] = useState<string | null>(
    null,
  );

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
    const theoryCount = blocks.filter(
      (b) =>
        b.scheduledFor === dateISO &&
        b.mode === "theory" &&
        (domainId == null || b.domain === domainId),
    ).length;
    return insightCount + theoryCount;
  }

  const countMap: Record<string, number> = {};
  dates.forEach((d) => {
    countMap[d] = countForDate(
      d,
      selectedDomain === "all" ? undefined : selectedDomain,
    );
  });

  const totalCaptures = dates.reduce((sum, d) => sum + (countMap[d] ?? 0), 0);

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

  // Day detail content
  function DayDetail({ date }: { date: string }) {
    const dayInsights = insights.filter(
      (ins) => new Date(ins.capturedAt).toISOString().slice(0, 10) === date,
    );
    const dayTheory = blocks.filter(
      (b) => b.scheduledFor === date && b.mode === "theory",
    );
    const count = dayInsights.length + dayTheory.length;
    return (
      <div style={{ padding: "24px 24px 40px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--label,#8E8E93)",
            marginBottom: 6,
          }}
        >
          {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--ink,#0B0B0F)",
            marginBottom: 20,
          }}
        >
          {count} capture{count !== 1 ? "s" : ""}
        </div>
        {dayInsights.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8E8E93",
                marginBottom: 8,
              }}
            >
              insights
            </div>
            {dayInsights.map((ins) => (
              <div
                key={ins.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "12px 14px",
                  marginBottom: 8,
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "#1C1C1E",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                }}
              >
                {ins.text}
                {ins.source && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8E8E93",
                      fontWeight: 600,
                      marginTop: 4,
                    }}
                  >
                    {ins.source}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {dayTheory.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8E8E93",
                marginBottom: 8,
              }}
            >
              theory blocks
            </div>
            {dayTheory.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "12px 14px",
                  marginBottom: 8,
                  boxShadow:
                    "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0B0B0F",
                  letterSpacing: "-0.01em",
                }}
              >
                {b.title}
              </div>
            ))}
          </div>
        )}
        {count === 0 && (
          <div style={{ fontSize: 14, color: "#8E8E93", fontWeight: 500 }}>
            nothing captured this day.
          </div>
        )}
      </div>
    );
  }

  // Heatmap grid (shared)
  function HeatmapGrid({
    onCellClick,
  }: {
    onCellClick: (date: string) => void;
  }) {
    return (
      <div>
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
              {grid.map((weekDates, colIdx) => {
                const date = weekDates[rowIdx];
                if (!date)
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
                const count = countMap[date] ?? 0;
                const level = hmLevel(count);
                const isToday = date === today;
                const isSelected = date === mobileSelectedDate;
                return (
                  <div
                    key={`cell-${colIdx}-${rowIdx}`}
                    onClick={() => onCellClick(date)}
                    style={{
                      gridColumn: colIdx + 2,
                      gridRow: rowIdx + 1,
                      height: 28,
                      borderRadius: 6,
                      background: HM_COLORS[level],
                      boxShadow: isSelected
                        ? "0 0 0 2px #0A84FF,0 0 0 4px rgba(10,132,255,0.2)"
                        : isToday
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
            <span style={{ fontSize: 10.5, color: "#8E8E93", fontWeight: 600 }}>
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
            <span style={{ fontSize: 10.5, color: "#8E8E93", fontWeight: 600 }}>
              more
            </span>
          </div>
        </div>
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
    );
  }

  // Domain sparklines section
  function DomainRows() {
    return (
      <div style={{ padding: "0 4px" }}>
        {domainSparklines.map((d) => {
          const [bg1, bg2] = DOMAIN_BG2[d.id];
          const ink = DOMAIN_INK[d.id];
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
                    const lv = sparkLevel(val, sparkMax);
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: SPARK_HEIGHTS[lv],
                          borderRadius: 2,
                          background:
                            lv === 0
                              ? "rgba(60,60,67,0.08)"
                              : `linear-gradient(180deg,${bg1},${bg2})`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Filter chips
  const filterChips = (
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
          {f.id !== "all" && (
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
  );

  // Single-column layout (mobile + desktop, max-width 880px on desktop)
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px" }}>
      <Topbar name="knowledge." sub="what you've absorbed over time." />
      {filterChips}
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
        <HeatmapGrid
          onCellClick={(date) => {
            setMobileSelectedDate(date);
            setDrawerOpen(true);
          }}
        />
      </div>
      <DomainRows />
      {/* Mobile day detail in drawer */}
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={mobileSelectedDate ?? ""}
      >
        {mobileSelectedDate && <DayDetail date={mobileSelectedDate} />}
      </RightDrawer>
    </div>
  );
}

export default function KnowledgePage() {
  return (
    <Suspense>
      <KnowledgeInner />
    </Suspense>
  );
}
