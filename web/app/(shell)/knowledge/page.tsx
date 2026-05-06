"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

const DOMAIN_COLORS: Record<DomainId, string> = {
  business: "#C9DBFF",
  religion: "#C0E5C8",
  learning: "#FFCFDC",
  fitness: "#FFB6C5",
  home: "#CFDCE3",
  food: "#FFE0B2",
};

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

function getWeekRows(dates: string[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    rows.push(dates.slice(i, i + 7));
  }
  return rows;
}

export default function KnowledgePage() {
  const { insights, blocks, domains } = useDoIt();
  const [selectedDomain, setSelectedDomain] = useState<DomainId | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dates = getLast56Dates();
  const weeks = getWeekRows(dates);

  // Count: insights captured + theory-mode blocks per day per domain
  function countForDate(dateISO: string, domainId?: DomainId): number {
    const insightCount = insights.filter((ins) => {
      const insDate = new Date(ins.capturedAt).toISOString().slice(0, 10);
      return (
        insDate === dateISO && (domainId == null || ins.domainId === domainId)
      );
    }).length;

    const blockCount = blocks.filter((b) => {
      return (
        b.mode === "theory" &&
        b.scheduledFor === dateISO &&
        (domainId == null || b.domain === domainId)
      );
    }).length;

    return insightCount + blockCount;
  }

  function intensity(count: number): string {
    if (count === 0) return "var(--inset-2)";
    if (count === 1) return "rgba(0,122,255,0.15)";
    if (count === 2) return "rgba(0,122,255,0.30)";
    if (count === 3) return "rgba(0,122,255,0.50)";
    return "rgba(0,122,255,0.70)";
  }

  // Items for selected date drawer
  const selectedInsights = selectedDate
    ? insights.filter((ins) => {
        const d = new Date(ins.capturedAt).toISOString().slice(0, 10);
        return d === selectedDate;
      })
    : [];

  const selectedBlocks = selectedDate
    ? blocks.filter(
        (b) => b.mode === "theory" && b.scheduledFor === selectedDate,
      )
    : [];

  const domainFilter = selectedDomain === "all" ? undefined : selectedDomain;

  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="shell-content">
      <Topbar name="knowledge." sub="what you've absorbed." />

      {/* Domain filter chips */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}
      >
        <button
          onClick={() => setSelectedDomain("all")}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: "none",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background:
              selectedDomain === "all" ? "var(--ink)" : "var(--inset)",
            color: selectedDomain === "all" ? "#fff" : "var(--label-2)",
            boxShadow:
              selectedDomain === "all"
                ? "var(--shadow-press)"
                : "inset 0 0 0 0.5px var(--hairline)",
          }}
        >
          all
        </button>
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDomain(d.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background:
                selectedDomain === d.id ? DOMAIN_COLORS[d.id] : "var(--inset)",
              color:
                selectedDomain === d.id ? "var(--ink-2)" : "var(--label-2)",
              boxShadow:
                selectedDomain === d.id
                  ? `inset 0 0 0 0.5px rgba(0,0,0,0.08)`
                  : "inset 0 0 0 0.5px var(--hairline)",
            }}
          >
            {d.name.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Heatmap */}
      <div
        style={{
          background: "var(--card)",
          borderRadius: 20,
          padding: "16px",
          boxShadow: "var(--shadow-stack)",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--label)",
            marginBottom: 10,
          }}
        >
          last 8 weeks · insights + theory blocks
        </div>

        {/* Day labels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {DAY_LABELS.map((l, i) => (
            <div
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--label)",
                textAlign: "center",
                letterSpacing: "0.06em",
              }}
            >
              {l}
            </div>
          ))}
        </div>

        {/* Grid rows (8 weeks) */}
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 4,
            }}
          >
            {week.map((dateISO) => {
              const count = countForDate(dateISO, domainFilter);
              const isSelected = dateISO === selectedDate;
              const today = new Date().toISOString().slice(0, 10);
              const isFuture = dateISO > today;
              return (
                <div
                  key={dateISO}
                  onClick={() => setSelectedDate(isSelected ? null : dateISO)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 4,
                    background: isFuture ? "transparent" : intensity(count),
                    cursor: count > 0 ? "pointer" : "default",
                    boxShadow: isSelected
                      ? "0 0 0 2px var(--blue)"
                      : isFuture
                        ? "inset 0 0 0 0.5px var(--hairline-2)"
                        : count === 0
                          ? "inset 0 0 0 0.5px var(--hairline-2)"
                          : "none",
                    transition: "transform 240ms cubic-bezier(.32,.72,0,1)",
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 10,
            justifyContent: "flex-end",
          }}
        >
          <span style={{ fontSize: 9, color: "var(--label)", fontWeight: 600 }}>
            less
          </span>
          {[0, 1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: intensity(n),
                boxShadow:
                  n === 0 ? "inset 0 0 0 0.5px var(--hairline-2)" : "none",
              }}
            />
          ))}
          <span style={{ fontSize: 9, color: "var(--label)", fontWeight: 600 }}>
            more
          </span>
        </div>
      </div>

      {/* Selected date detail */}
      {selectedDate &&
        (selectedInsights.length > 0 || selectedBlocks.length > 0) && (
          <div
            style={{
              background: "var(--card)",
              borderRadius: 20,
              padding: "16px",
              boxShadow: "var(--shadow-stack)",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--label)",
                marginBottom: 12,
              }}
            >
              {new Date(selectedDate).toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
            {selectedInsights.map((ins) => (
              <div
                key={ins.id}
                style={{
                  padding: "9px 0",
                  borderBottom: "0.5px solid var(--hairline-2)",
                  fontSize: 13.5,
                  color: "var(--ink-2)",
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.45,
                }}
              >
                {ins.text}
              </div>
            ))}
            {selectedBlocks.map((b) => (
              <div
                key={b.id}
                style={{
                  padding: "9px 0",
                  borderBottom: "0.5px solid var(--hairline-2)",
                  fontSize: 13.5,
                  color: "var(--label-2)",
                  fontWeight: 600,
                  letterSpacing: "-0.012em",
                }}
              >
                📖 {b.title}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
