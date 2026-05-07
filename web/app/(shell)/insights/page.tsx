"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { useIsDesktop } from "@/lib/useIsDesktop";
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

type StatusFilter = InsightStatus | "all";
const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "all", value: "all" },
  { label: "captured", value: "captured" },
  { label: "testing", value: "testing" },
  { label: "adopted", value: "adopted" },
  { label: "discarded", value: "discarded" },
];

const STATUS_PILL: Record<
  InsightStatus,
  { bg: string; color: string; shadow: string }
> = {
  captured: {
    bg: "#FFFFFF",
    color: "#1C1C1E",
    shadow:
      "inset 0 0 0 0.5px rgba(60,60,67,0.18),0 2px 4px rgba(20,20,30,0.06)",
  },
  testing: {
    bg: "#E2EEFF",
    color: "#0050C8",
    shadow:
      "inset 0 0 0 0.5px rgba(0,80,200,0.12),0 2px 4px rgba(20,20,30,0.06)",
  },
  adopted: {
    bg: "#C7F0CF",
    color: "#1F5C2C",
    shadow:
      "inset 0 0 0 0.5px rgba(31,92,44,0.18),0 2px 4px rgba(20,20,30,0.06)",
  },
  discarded: {
    bg: "#F4F5F7",
    color: "#8E8E93",
    shadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
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

function InsightsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const isDesktop = useIsDesktop();

  const { insights, visions, addInsight, removeInsight, updateInsightStatus } =
    useDoIt();

  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [domainId, setDomainId] = useState<DomainId | "">("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");

  function handleSave() {
    if (!text.trim()) return;
    addInsight({
      text: text.trim(),
      source: source.trim() || undefined,
      domainId: domainId || undefined,
      capturedAt: Date.now(),
      status: "captured",
      statusChangedAt: Date.now(),
    });
    setText("");
    setSource("");
    setDomainId("");
  }

  function cycleStatus(id: string, current: InsightStatus) {
    const order: InsightStatus[] = [
      "captured",
      "testing",
      "adopted",
      "discarded",
    ];
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateInsightStatus(id, next);
  }

  const sorted = [...insights].sort((a, b) => b.capturedAt - a.capturedAt);
  const filtered =
    filterStatus === "all"
      ? sorted
      : sorted.filter((i) => i.status === filterStatus);
  const staleTestingInsights = insights.filter(
    (i) => i.status === "testing" && daysInTesting(i.statusChangedAt) >= 14,
  );

  const selectedInsight = insights.find((i) => i.id === selectedId) ?? null;
  const linkedVision = selectedInsight?.visionId
    ? visions.find((v) => v.id === selectedInsight.visionId)
    : null;
  const linkedDomain = selectedInsight?.domainId
    ? DOMAIN_OPTIONS.find((d) => d.id === selectedInsight.domainId)
    : null;

  // ── Capture strip (shared) ──
  const captureStrip = (
    <div
      style={{
        background: "#FBFAF8",
        borderRadius: 18,
        padding: 14,
        marginBottom: 18,
        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#0B0B0F",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) handleSave();
          }}
          placeholder="capture a lesson that landed…"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14,
            color: text ? "#0B0B0F" : "#8E8E93",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            fontFamily: "inherit",
          }}
        />
      </div>
      {text && (
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "0.5px solid rgba(60,60,67,0.10)",
          }}
        >
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="source"
            style={{
              flex: 1,
              fontSize: 11,
              fontWeight: 600,
              color: "#1C1C1E",
              background: "#FFFFFF",
              border: "none",
              outline: "none",
              borderRadius: 999,
              padding: "5px 10px",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              fontFamily: "inherit",
            }}
          />
          <select
            value={domainId}
            onChange={(e) => setDomainId(e.target.value as DomainId | "")}
            style={{
              flex: 1,
              fontSize: 11,
              fontWeight: 600,
              color: domainId ? "#1C1C1E" : "#8E8E93",
              background: "#FFFFFF",
              border: "none",
              outline: "none",
              borderRadius: 999,
              padding: "5px 10px",
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              fontFamily: "inherit",
            }}
          >
            <option value="">domain</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            style={{
              background: "#0B0B0F",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5)",
            }}
          >
            capture
          </button>
        </div>
      )}
    </div>
  );

  // ── Stale testing prompt card ──
  function StalePrompt({ ins }: { ins: (typeof insights)[number] }) {
    return (
      <div
        style={{
          position: "relative",
          background: "#FFFFFF",
          borderRadius: 22,
          padding: "20px 20px 18px",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 2px 3px rgba(20,20,30,0.04),0 18px 38px -18px rgba(20,20,30,0.18)",
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg,#E2EEFF 0%,#0A84FF 50%,#E2EEFF 100%)",
            opacity: 0.45,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "#E2EEFF",
            color: "#0050C8",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 2px rgba(20,20,30,0.04),0 1px 0 rgba(255,255,255,0.7) inset",
            transform: "rotate(-7deg)",
          }}
        >
          testing
        </div>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "#8E8E93",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          check in
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#0B0B0F",
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          did this become you?
        </div>
        <div
          style={{
            fontSize: 15,
            lineHeight: 1.4,
            color: "#5A5A5E",
            fontWeight: 500,
            letterSpacing: "-0.012em",
            borderLeft: "2px solid #0A84FF",
            paddingLeft: 12,
            marginBottom: 14,
          }}
        >
          {ins.text}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#8E8E93",
            fontWeight: 600,
            letterSpacing: "0.04em",
            marginBottom: 14,
          }}
        >
          {daysInTesting(ins.statusChangedAt)} days in testing
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <button
            onClick={() => updateInsightStatus(ins.id, "adopted")}
            style={{
              background: "linear-gradient(180deg,#1A1A20,#000)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "13px 14px",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "-0.005em",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            yes, became me
          </button>
          <button
            onClick={() => updateInsightStatus(ins.id, "discarded")}
            style={{
              background: "#FFFFFF",
              color: "#1C1C1E",
              border: "none",
              borderRadius: 14,
              padding: "13px 14px",
              fontSize: 13.5,
              fontWeight: 700,
              boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.18)",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            no, discard
          </button>
        </div>
        <button
          onClick={() =>
            updateInsightStatus(ins.id, "testing", ins.testedNotes)
          }
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 12,
            color: "#6E6E73",
            fontWeight: 600,
            padding: 8,
            letterSpacing: "-0.005em",
            background: "none",
            border: "none",
            width: "100%",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          still testing
        </button>
      </div>
    );
  }

  // ── Single insight row for list pane ──
  function InsightRow({
    ins,
    selected,
  }: {
    ins: (typeof insights)[number];
    selected: boolean;
  }) {
    const st = STATUS_PILL[ins.status];
    return (
      <button
        onClick={() =>
          router.push(`/insights?selected=${ins.id}`, { scroll: false })
        }
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          padding: "12px 14px",
          background: selected ? "var(--ink,#0B0B0F)" : "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
          transition: "background 160ms",
          borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: 999,
              background: selected ? "rgba(255,255,255,0.15)" : st.bg,
              color: selected ? "#fff" : st.color,
            }}
          >
            {ins.status}
          </span>
          <span
            style={{
              fontSize: 10,
              color: selected
                ? "rgba(255,255,255,0.5)"
                : "var(--label,#8E8E93)",
              fontWeight: 600,
            }}
          >
            {timeAgo(ins.capturedAt)}
          </span>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: selected ? "#fff" : "var(--ink-2,#1C1C1E)",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {ins.text}
        </div>
      </button>
    );
  }

  // ── Full insight detail (for desktop right pane + mobile cards) ──
  function InsightFull({ ins }: { ins: (typeof insights)[number] }) {
    const st = STATUS_PILL[ins.status];
    const lv = ins.visionId ? visions.find((v) => v.id === ins.visionId) : null;
    const ld = ins.domainId
      ? DOMAIN_OPTIONS.find((d) => d.id === ins.domainId)
      : null;
    const isDiscarded = ins.status === "discarded";
    const isStale =
      ins.status === "testing" && daysInTesting(ins.statusChangedAt) >= 14;

    return (
      <div>
        {isStale && <StalePrompt ins={ins} />}
        <div
          style={{
            position: "relative",
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "18px 18px 14px",
            boxShadow:
              "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
            opacity: isDiscarded ? 0.55 : 1,
          }}
        >
          <button
            onClick={() => cycleStatus(ins.id, ins.status)}
            style={{
              position: "absolute",
              top: -8,
              right: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transform: "rotate(-7deg)",
              background: st.bg,
              color: st.color,
              boxShadow: st.shadow,
              fontFamily: "inherit",
              border: "none",
              cursor: "pointer",
            }}
          >
            {ins.status}
          </button>
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.32,
              letterSpacing: "-0.02em",
              color: "#5A5A5E",
              fontWeight: 500,
              textDecoration: isDiscarded ? "line-through" : "none",
              textDecorationColor: "rgba(60,60,67,0.30)",
              paddingRight: 60,
            }}
          >
            {ins.text}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              paddingTop: 10,
              borderTop: "0.5px solid rgba(60,60,67,0.10)",
            }}
          >
            <div
              style={{
                fontSize: 10.5,
                color: "#8E8E93",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {timeAgo(ins.capturedAt)}
              {ins.source && (
                <>
                  {" "}
                  ·{" "}
                  <b
                    style={{
                      color: "#1C1C1E",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "none",
                      fontSize: 11.5,
                    }}
                  >
                    {ins.source}
                  </b>
                </>
              )}
            </div>
            {ld && (
              <>
                <div
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#8E8E93",
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{ fontSize: 11, color: "#6E6E73", fontWeight: 600 }}
                >
                  {ld.name}
                </div>
              </>
            )}
            {lv && (
              <>
                <div
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#8E8E93",
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{ fontSize: 11, color: "#6E6E73", fontWeight: 600 }}
                >
                  {lv.title}
                </div>
              </>
            )}
            <button
              onClick={() => removeInsight(ins.id)}
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 600,
                color: "#8E8E93",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop master/detail ──
  if (isDesktop) {
    return (
      <div className="md-layout">
        {/* LEFT — 280px filter + list */}
        <div className="md-list" style={{ width: 280 }}>
          {/* Header */}
          <div
            style={{
              padding: "16px 14px 10px",
              borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--label,#8E8E93)",
                marginBottom: 10,
              }}
            >
              {insights.length} insights
            </div>
            {/* Filter chips */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: filterStatus === f.value ? "#fff" : "#6E6E73",
                    background:
                      filterStatus === f.value ? "#0B0B0F" : "#F4F5F7",
                    padding: "5px 10px",
                    borderRadius: 999,
                    boxShadow:
                      filterStatus === f.value
                        ? "none"
                        : "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
                    fontFamily: "inherit",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {/* Capture strip */}
          <div style={{ padding: "12px 10px" }}>{captureStrip}</div>
          {/* Insight rows */}
          {filtered.map((ins) => (
            <InsightRow
              key={ins.id}
              ins={ins}
              selected={selectedId === ins.id}
            />
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#8E8E93",
                textAlign: "center",
                padding: "24px 0",
              }}
            >
              nothing here yet
            </div>
          )}
        </div>

        {/* RIGHT — detail pane */}
        <div className="md-detail">
          {selectedInsight ? (
            <div style={{ padding: "32px 32px 40px", maxWidth: 560 }}>
              {/* "did this become you?" prompt persists at top if stale */}
              {selectedInsight.status === "testing" &&
                daysInTesting(selectedInsight.statusChangedAt) >= 14 && (
                  <StalePrompt ins={selectedInsight} />
                )}
              <InsightFull ins={selectedInsight} />
            </div>
          ) : (
            <div className="md-empty">
              {staleTestingInsights.length > 0 && (
                <div
                  style={{ maxWidth: 440, width: "100%", padding: "0 24px" }}
                >
                  <StalePrompt ins={staleTestingInsights[0]} />
                </div>
              )}
              {staleTestingInsights.length === 0 && (
                <>
                  <span className="md-empty-icon">◎</span>
                  <span>select an insight to read the detail</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Mobile single-column ──
  return (
    <>
      <Topbar name="insights." sub="what's landing on you." />

      {staleTestingInsights.length > 0 && (
        <StalePrompt ins={staleTestingInsights[0]} />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "4px 6px 14px",
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
          insights
        </div>
        <div style={{ fontSize: 11.5, color: "#8E8E93", fontWeight: 600 }}>
          <b style={{ color: "#1C1C1E", fontWeight: 700 }}>{insights.length}</b>{" "}
          captured
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "0 4px 14px",
          scrollbarWidth: "none",
        }}
      >
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            style={{
              flexShrink: 0,
              fontSize: 12.5,
              fontWeight: 600,
              color: filterStatus === f.value ? "#fff" : "#6E6E73",
              background: filterStatus === f.value ? "#0B0B0F" : "#FFFFFF",
              padding: "7px 13px",
              borderRadius: 999,
              boxShadow:
                filterStatus === f.value
                  ? "none"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
              letterSpacing: "-0.005em",
              fontFamily: "inherit",
              border: "none",
              cursor: "pointer",
            }}
          >
            {f.label}
            <span
              style={{
                fontVariantNumeric: "tabular-nums",
                fontWeight: 600,
                marginLeft: 4,
                fontSize: 11,
                color:
                  filterStatus === f.value
                    ? "rgba(255,255,255,0.55)"
                    : "#8E8E93",
              }}
            >
              {f.value === "all"
                ? insights.length
                : insights.filter((i) => i.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {captureStrip}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingBottom: 110,
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#8E8E93",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            nothing here yet · capture something
          </div>
        )}
        {filtered.map((ins) => (
          <InsightFull key={ins.id} ins={ins} />
        ))}
      </div>
    </>
  );
}

export default function InsightsPage() {
  return (
    <Suspense>
      <InsightsInner />
    </Suspense>
  );
}
