"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

const DOMAIN_OPTIONS: { id: DomainId; name: string }[] = [
  { id: "business", name: "Business" },
  { id: "religion", name: "Religion" },
  { id: "learning", name: "Learning" },
  { id: "fitness", name: "Fitness" },
  { id: "home", name: "Home" },
  { id: "food", name: "Food" },
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function InsightsPage() {
  const { insights, visions, addInsight, removeInsight } = useDoIt();

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

  const sorted = [...insights].sort((a, b) => b.capturedAt - a.capturedAt);
  const filtered =
    filterDomain === "all"
      ? sorted
      : sorted.filter((i) => i.domainId === filterDomain);

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
      <Topbar name="Insights" sub="what you're learning" />

      {/* Add strip */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "16px 18px",
          marginBottom: 16,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.08)",
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Capture a quote, lesson, or line that landed…"
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
            placeholder="Source (optional)"
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
            <option value="">Domain (optional)</option>
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
            <option value="">Vision (optional)</option>
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
            transition: "background 0.15s ease",
          }}
        >
          Save insight
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
          All
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
            Nothing captured yet. Start above.
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
          return (
            <div
              key={ins.id}
              onClick={() => setExpanded(isOpen ? null : ins.id)}
              style={{
                background: "var(--card,#fff)",
                borderRadius: 18,
                padding: "16px 18px",
                cursor: "pointer",
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -10px rgba(20,20,30,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--ink,#000)",
                  letterSpacing: "-0.014em",
                  lineHeight: 1.5,
                  marginBottom: isOpen ? 12 : 0,
                }}
              >
                {ins.text}
              </div>
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
                      Source: {ins.source}
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
                      Domain: {linkedDomain.name}
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
                      Vision: {linkedVision.title}
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
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              {!isOpen && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--label,#8E8E93)",
                    marginTop: 6,
                  }}
                >
                  {timeAgo(ins.capturedAt)}
                  {ins.source ? ` · ${ins.source}` : ""}
                  {linkedDomain ? ` · ${linkedDomain.name}` : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
