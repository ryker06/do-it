"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId, InsightStatus } from "@/lib/types";

const DOMAIN_OPTIONS: { id: DomainId; name: string }[] = [
  { id: "business", name: "business" },
  { id: "religion", name: "religion" },
  { id: "learning", name: "learning" },
  { id: "fitness", name: "fitness" },
  { id: "home", name: "home" },
  { id: "food", name: "food" },
];

const STATUS_ORDER: InsightStatus[] = [
  "captured",
  "testing",
  "adopted",
  "discarded",
];

const STATUS_LABEL: Record<InsightStatus, string> = {
  captured: "captured",
  testing: "testing",
  adopted: "adopted",
  discarded: "discarded",
};

const STATUS_STYLE: Record<
  InsightStatus,
  { bg: string; color: string; shadow?: string }
> = {
  captured: {
    bg: "var(--inset,#F2F2F7)",
    color: "var(--label-2,#6E6E73)",
  },
  testing: {
    bg: "linear-gradient(180deg,#E8F0FF 0%,#D6E4FF 100%)",
    color: "#3B5BDB",
    shadow: "inset 0 0 0 0.5px rgba(59,91,219,0.15)",
  },
  adopted: {
    bg: "linear-gradient(180deg,#E3F9E5 0%,#C3EFC8 100%)",
    color: "#1F7A2B",
    shadow: "inset 0 0 0 0.5px rgba(31,122,43,0.15)",
  },
  discarded: {
    bg: "var(--inset,#F2F2F7)",
    color: "var(--label,#8E8E93)",
  },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function daysInTesting(statusChangedAt: number | undefined): number {
  if (!statusChangedAt) return 0;
  return Math.floor((Date.now() - statusChangedAt) / 86400_000);
}

export default function InsightsPage() {
  const { insights, visions, addInsight, removeInsight, updateInsightStatus } =
    useDoIt();

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [domainId, setDomainId] = useState<DomainId | "">("");
  const [visionId, setVisionId] = useState("");
  const [filterDomain, setFilterDomain] = useState<DomainId | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSave() {
    if (!text.trim()) return;
    addInsight({
      text: text.trim(),
      source: source.trim() || undefined,
      domainId: domainId || undefined,
      visionId: visionId || undefined,
      capturedAt: Date.now(),
      status: "captured",
    });
    setText("");
    setSource("");
    setDomainId("");
    setVisionId("");
  }

  function cycleStatus(insId: string, current: InsightStatus) {
    const idx = STATUS_ORDER.indexOf(current);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    updateInsightStatus(insId, next);
  }

  const sorted = [...insights].sort((a, b) => b.capturedAt - a.capturedAt);
  const filtered =
    filterDomain === "all"
      ? sorted
      : sorted.filter((i) => i.domainId === filterDomain);

  // 14-day testing insights for prompt card
  const staleTestingInsights = insights.filter(
    (i) => i.status === "testing" && daysInTesting(i.statusChangedAt) >= 14,
  );

  const chipStyle = (active: boolean) =>
    ({
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      cursor: "pointer",
      border: "none",
      background: active ? "var(--ink,#000)" : "var(--inset,#F2F2F7)",
      color: active ? "#fff" : "var(--label-2,#6E6E73)",
      boxShadow: active ? "none" : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
      transition: "background 0.12s ease, color 0.12s ease",
    }) as const;

  return (
    <>
      <Topbar name="insights." sub="what's landing on you." />

      {/* 14-day testing prompt card */}
      {staleTestingInsights.length > 0 && (
        <div
          style={{
            background: "linear-gradient(180deg,#EEF3FF 0%,#E4EDFF 100%)",
            borderRadius: 20,
            padding: "16px 18px",
            marginBottom: 14,
            boxShadow:
              "0 0 0 0.5px rgba(59,91,219,0.12), 0 8px 20px -12px rgba(59,91,219,0.15)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#3B5BDB",
              marginBottom: 6,
            }}
          >
            still testing
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#1C2A6E",
              marginBottom: 4,
            }}
          >
            did this become you?
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#3B5BDB",
              letterSpacing: "-0.01em",
              lineHeight: 1.45,
              marginBottom: 14,
            }}
          >
            {staleTestingInsights.length === 1
              ? "1 insight has been in testing for 14+ days."
              : `${staleTestingInsights.length} insights have been in testing for 14+ days.`}{" "}
            mark as adopted or discard.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {staleTestingInsights.map((ins) => (
              <div
                key={ins.id}
                style={{
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "inset 0 0 0 0.5px rgba(59,91,219,0.12)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1C2A6E",
                    letterSpacing: "-0.012em",
                    lineHeight: 1.4,
                  }}
                >
                  {ins.text}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => updateInsightStatus(ins.id, "adopted")}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#1F7A2B",
                      background:
                        "linear-gradient(180deg,#E3F9E5 0%,#C3EFC8 100%)",
                      border: "none",
                      borderRadius: 8,
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    yes
                  </button>
                  <button
                    onClick={() => updateInsightStatus(ins.id, "discarded")}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "var(--label,#8E8E93)",
                      background: "rgba(0,0,0,0.05)",
                      border: "none",
                      borderRadius: 8,
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    no
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add strip */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "16px 18px",
          marginBottom: 16,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 8px 20px -12px rgba(20,20,30,0.08)",
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="capture a quote, lesson, or line that landed…"
          style={{
            width: "100%",
            minHeight: 72,
            resize: "none",
            border: "none",
            outline: "none",
            fontSize: 15,
            fontWeight: 500,
            color: "var(--ink,#000)",
            letterSpacing: "-0.014em",
            lineHeight: 1.55,
            background: "transparent",
            fontFamily: "inherit",
            padding: 0,
            marginBottom: 10,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="source (optional)"
            style={{
              flex: 1,
              minWidth: 120,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink,#000)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "8px 12px",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
            }}
          />
          <select
            value={domainId}
            onChange={(e) => setDomainId(e.target.value as DomainId | "")}
            style={{
              flex: 1,
              minWidth: 110,
              fontSize: 13,
              fontWeight: 500,
              color: domainId ? "var(--ink,#000)" : "var(--label,#8E8E93)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "8px 12px",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
          >
            <option value="">domain (optional)</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={visionId}
            onChange={(e) => setVisionId(e.target.value)}
            style={{
              flex: 1,
              minWidth: 110,
              fontSize: 13,
              fontWeight: 500,
              color: visionId ? "var(--ink,#000)" : "var(--label,#8E8E93)",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              borderRadius: 10,
              padding: "8px 12px",
              fontFamily: "inherit",
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
          >
            <option value="">vision (optional)</option>
            {visions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 14,
            background: text.trim()
              ? "linear-gradient(180deg,#1A1A1F 0%, #0A0A0F 100%)"
              : "var(--inset,#F2F2F7)",
            color: text.trim() ? "#fff" : "var(--label,#8E8E93)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.016em",
            border: "none",
            cursor: text.trim() ? "pointer" : "default",
            fontFamily: "inherit",
            transition: "background 0.15s ease",
          }}
        >
          capture
        </button>
      </div>

      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <button
          style={chipStyle(filterDomain === "all")}
          onClick={() => setFilterDomain("all")}
        >
          all
        </button>
        {DOMAIN_OPTIONS.map((d) => (
          <button
            key={d.id}
            style={chipStyle(filterDomain === d.id)}
            onClick={() => setFilterDomain(d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label,#8E8E93)",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            nothing here yet. capture one above.
          </div>
        )}
        {filtered.map((ins) => {
          const isOpen = expanded === ins.id;
          const linkedVision = ins.visionId
            ? visions.find((v) => v.id === ins.visionId)
            : null;
          const linkedDomain = ins.domainId
            ? DOMAIN_OPTIONS.find((d) => d.id === ins.domainId)
            : null;
          const statusStyle = STATUS_STYLE[ins.status];
          const isDiscarded = ins.status === "discarded";

          return (
            <div
              key={ins.id}
              onClick={() => setExpanded(isOpen ? null : ins.id)}
              style={{
                background: "var(--card,#fff)",
                borderRadius: 18,
                padding: "14px 16px",
                cursor: "pointer",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.06), 0 6px 16px -10px rgba(20,20,30,0.08)",
                opacity: isDiscarded ? 0.55 : 1,
                transition: "opacity 0.15s ease",
              }}
            >
              {/* Top row: text + status pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: isOpen ? 12 : 0,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.014em",
                    lineHeight: 1.5,
                    textDecoration: isDiscarded ? "line-through" : "none",
                    textDecorationColor: "var(--label,#8E8E93)",
                  }}
                >
                  {ins.text}
                </div>
                {/* Status pill — tap to cycle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleStatus(ins.id, ins.status);
                  }}
                  style={{
                    flexShrink: 0,
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "4px 9px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    boxShadow:
                      statusStyle.shadow ??
                      "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                    marginTop: 2,
                  }}
                >
                  {STATUS_LABEL[ins.status]}
                </button>
              </div>

              {/* Collapsed meta row */}
              {!isOpen && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                    marginTop: 8,
                  }}
                >
                  {timeAgo(ins.capturedAt)}
                  {ins.source ? ` · ${ins.source}` : ""}
                  {linkedDomain ? ` · ${linkedDomain.name}` : ""}
                </div>
              )}

              {/* Expanded details */}
              {isOpen && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {ins.source && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--label,#8E8E93)",
                      }}
                    >
                      source: {ins.source}
                    </div>
                  )}
                  {linkedDomain && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--label,#8E8E93)",
                      }}
                    >
                      domain: {linkedDomain.name}
                    </div>
                  )}
                  {linkedVision && (
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--label,#8E8E93)",
                      }}
                    >
                      vision: {linkedVision.title}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--label,#8E8E93)",
                        fontWeight: 500,
                      }}
                    >
                      {timeAgo(ins.capturedAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeInsight(ins.id);
                      }}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--label,#8E8E93)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 0",
                        fontFamily: "inherit",
                      }}
                    >
                      remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
