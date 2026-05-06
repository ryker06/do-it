"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import { Topbar } from "@/components/Topbar";
import type { DomainId } from "@/lib/types";

function inferDomain(text: string): DomainId {
  const t = text.toLowerCase();
  if (/gym|workout|push|pull|run|exercise|fitness|lift|train/.test(t))
    return "fitness";
  if (
    /prayer|quran|salah|salat|fajr|dhuhr|asr|maghrib|isha|allah|dua|dhikr|religion/.test(
      t,
    )
  )
    return "religion";
  if (/read|learn|book|course|study|design|code|research|article/.test(t))
    return "learning";
  if (
    /email|client|meeting|business|webuild|lashin|freelance|invoice|sales/.test(
      t,
    )
  )
    return "business";
  if (/cook|eat|meal|food|breakfast|lunch|dinner|recipe|grocery|shop/.test(t))
    return "food";
  if (/home|clean|laundry|tidy|desk|room|house|repair/.test(t)) return "home";
  return "business";
}

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

export default function InboxPage() {
  const { blocks, addToInbox, moveBlockTo, createBlock } = useDoIt(); // addToInbox now writes a Block with scheduledFor:'inbox'
  const [text, setText] = useState("");
  const searchParams = useSearchParams();

  // PWA share target: read URL params on mount, capture to inbox, strip params
  useEffect(() => {
    const sharedTitle = searchParams.get("title");
    const sharedText = searchParams.get("text");
    const sharedUrl = searchParams.get("url");
    if (sharedTitle || sharedText || sharedUrl) {
      const parts = [sharedTitle, sharedText, sharedUrl].filter(Boolean);
      const combined = parts.join(" — ");
      addToInbox(combined, inferDomain(combined));
      // Strip params from URL without navigation
      if (typeof window !== "undefined") {
        const clean = window.location.pathname;
        window.history.replaceState({}, "", clean);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inboxBlocks = blocks
    .filter((b) => b.scheduledFor === "inbox")
    .sort((a, b) => b.order - a.order);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const domain = inferDomain(trimmed);
    // Create as a block in inbox
    createBlock({
      title: trimmed,
      domain,
      durationMin: 30,
      scheduleToday: false,
    });
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <>
      <Topbar name="Inbox" sub="what's on your mind?" />

      {/* capture strip */}
      <div
        style={{
          background: "var(--card,#fff)",
          borderRadius: 20,
          padding: "12px 14px",
          marginBottom: 22,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 8px 20px -12px rgba(20,20,30,0.10)",
          position: "relative",
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            autoFocus
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.016em",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          {text.trim() && (
            <button
              onClick={handleSubmit}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.012em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5)",
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 6px",
          marginBottom: 14,
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
          Captured
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
          {inboxBlocks.length} items
        </span>
      </div>

      {/* inbox list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingBottom: 110,
        }}
      >
        {inboxBlocks.length === 0 ? (
          <div
            style={{
              background: "var(--card,#fff)",
              borderRadius: 18,
              padding: "28px 16px",
              textAlign: "center",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                letterSpacing: "-0.012em",
              }}
            >
              Inbox is clear
            </div>
          </div>
        ) : (
          inboxBlocks.map((b) => (
            <div
              key={b.id}
              style={{
                background: "var(--card,#fff)",
                borderRadius: 18,
                padding: "13px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.08)",
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
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: DOMAIN_BG[b.domain],
                  boxShadow:
                    "inset 0 0 0 0.5px rgba(20,20,30,0.06), 0 1px 2px rgba(20,20,30,0.04)",
                  color: "var(--glyph,#0A0A0F)",
                }}
              >
                <DomainGlyph id={b.domain} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--ink,#000)",
                    letterSpacing: "-0.018em",
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
                    color: "var(--label,#8E8E93)",
                    letterSpacing: "-0.005em",
                    marginTop: 2,
                  }}
                >
                  {b.domain} · {b.durationMin} min
                </div>
              </div>
              <button
                onClick={() => moveBlockTo(b.id, "today")}
                style={{
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "linear-gradient(180deg,#E8F5E9 0%,#D4EDD6 100%)",
                  color: "#248A3D",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "-0.010em",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                  boxShadow:
                    "inset 0 0 0 0.5px rgba(52,199,89,0.20), 0 1px 2px rgba(52,199,89,0.08)",
                }}
              >
                → Today
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
