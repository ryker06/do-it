"use client";

import { useState, useEffect } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#D6F2EA 0%, #B8E6D6 100%)",
  learning: "linear-gradient(180deg,#EAE5F4 0%, #D6CCEB 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

const DOMAIN_IDS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
  "food",
];

const DURATIONS = [15, 30, 45, 60, 90];

interface BlockCreateSheetProps {
  onClose: () => void;
}

export default function BlockCreateSheet({ onClose }: BlockCreateSheetProps) {
  const { createBlock } = useDoIt();
  const [title, setTitle] = useState("");
  const [domainId, setDomainId] = useState<DomainId>("business");
  const [durationMin, setDurationMin] = useState(30);
  const [scheduleToday, setScheduleToday] = useState(true);

  function handleSave() {
    if (!title.trim()) return;
    createBlock({
      title: title.trim(),
      domain: domainId,
      durationMin,
      scheduleToday,
    });
    onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* scrim */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18,18,24,0.34)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          zIndex: 0,
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "#fff",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: "10px 22px 22px",
          boxShadow:
            "0 -1px 0 rgba(255,255,255,0.95) inset, 0 0 0 0.5px rgba(60,60,67,0.08), 0 -2px 8px rgba(20,20,30,0.04), 0 -22px 60px -10px rgba(20,20,30,0.20), 0 -40px 80px -20px rgba(20,20,30,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95)",
            pointerEvents: "none",
          }}
        />

        {/* handle */}
        <div
          style={{
            width: 38,
            height: 5,
            borderRadius: 999,
            background: "rgba(60,60,67,0.22)",
            margin: "0 auto 14px",
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          Add block
        </div>

        {/* title input */}
        <div
          style={{
            padding: "6px 4px 16px",
            borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Block title"
            style={{
              flex: 1,
              background: "transparent",
              border: 0,
              outline: 0,
              fontFamily: "inherit",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.032em",
              lineHeight: 1.1,
            }}
          />
          <span
            style={{
              width: 2,
              height: 24,
              background: "var(--blue,#007AFF)",
              borderRadius: 2,
              animation: "blink 1.05s steps(2) infinite",
              flexShrink: 0,
            }}
          />
          <style>{`@keyframes blink{50%{opacity:0;}}`}</style>
        </div>

        {/* domain label */}
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 4px",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Domain</span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: "var(--ink-3,#3A3A3C)",
              letterSpacing: "-0.012em",
              textTransform: "none",
            }}
          >
            {domainId.charAt(0).toUpperCase() + domainId.slice(1)}
          </span>
        </div>

        {/* domain picker */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            padding: "2px 2px 6px",
            marginBottom: 18,
          }}
        >
          {DOMAIN_IDS.map((id) => {
            const selected = domainId === id;
            return (
              <button
                key={id}
                onClick={() => setDomainId(id)}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: DOMAIN_BG[id],
                  boxShadow: selected
                    ? "0 0 0 2px #fff, 0 0 0 4px var(--ink-2,#1C1C1E), inset 0 0 0 0.5px rgba(20,20,30,0.06)"
                    : "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -3px 6px rgba(20,20,30,0.05), 0 1px 2px rgba(20,20,30,0.04)",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--glyph,#0A0A0F)",
                  transform: selected ? "scale(1.04)" : "scale(1)",
                  transition: "transform .12s ease",
                }}
              >
                <DomainGlyph id={id} size={24} />
              </button>
            );
          })}
        </div>

        {/* duration label */}
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0 4px",
            marginBottom: 10,
          }}
        >
          Duration
        </div>

        {/* duration segmented */}
        <div
          style={{
            display: "flex",
            gap: 5,
            background: "var(--inset,#F2F2F7)",
            borderRadius: 14,
            padding: 5,
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
            marginBottom: 18,
          }}
        >
          {DURATIONS.map((d) => {
            const active = durationMin === d;
            return (
              <button
                key={d}
                onClick={() => setDurationMin(d)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? "var(--ink,#000)" : "var(--label-2,#6E6E73)",
                  textAlign: "center",
                  letterSpacing: "-0.014em",
                  cursor: "pointer",
                  background: active ? "#fff" : "transparent",
                  boxShadow: active
                    ? "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 2px rgba(20,20,30,0.06), 0 4px 10px -6px rgba(20,20,30,0.10)"
                    : "none",
                  border: "none",
                  fontVariantNumeric: "tabular-nums",
                  transition: "all .15s ease",
                }}
              >
                {d >= 60 ? `${d / 60}` : d}
                <span
                  style={{
                    fontSize: 10.5,
                    color: active
                      ? "var(--label-2,#6E6E73)"
                      : "var(--label,#8E8E93)",
                    fontWeight: 600,
                    marginLeft: 2,
                  }}
                >
                  {d >= 60 ? "h" : "m"}
                </span>
              </button>
            );
          })}
        </div>

        {/* schedule pills */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => setScheduleToday(true)}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 16,
              background: scheduleToday ? "#fff" : "var(--inset,#F2F2F7)",
              boxShadow: scheduleToday
                ? "0 0 0 1.5px var(--ink-2,#1C1C1E), 0 8px 18px -10px rgba(20,20,30,0.20), 0 2px 6px -3px rgba(20,20,30,0.10)"
                : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: scheduleToday ? "var(--ink-2,#1C1C1E)" : "#fff",
                boxShadow: scheduleToday
                  ? "0 2px 6px -2px rgba(20,20,30,0.30)"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 1px rgba(20,20,30,0.03)",
                color: scheduleToday ? "#fff" : "var(--ink-3,#3A3A3C)",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={15}
                height={15}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.018em",
                  lineHeight: 1.1,
                }}
              >
                Today
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Add to list
              </div>
            </div>
          </button>

          <button
            onClick={() => setScheduleToday(false)}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: 16,
              background: !scheduleToday ? "#fff" : "var(--inset,#F2F2F7)",
              boxShadow: !scheduleToday
                ? "0 0 0 1.5px var(--ink-2,#1C1C1E), 0 8px 18px -10px rgba(20,20,30,0.20), 0 2px 6px -3px rgba(20,20,30,0.10)"
                : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: !scheduleToday ? "var(--ink-2,#1C1C1E)" : "#fff",
                boxShadow: !scheduleToday
                  ? "0 2px 6px -2px rgba(20,20,30,0.30)"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 1px rgba(20,20,30,0.03)",
                color: !scheduleToday ? "#fff" : "var(--ink-3,#3A3A3C)",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={15}
                height={15}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5h14M5 12h14M5 19h14" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.018em",
                  lineHeight: 1.1,
                }}
              >
                Inbox
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Schedule later
              </div>
            </div>
          </button>
        </div>

        {/* save */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 18,
            border: 0,
            cursor: "pointer",
            background: "linear-gradient(180deg,#1C1C1E 0%, #000000 100%)",
            boxShadow:
              "0 0 0 0.5px rgba(0,0,0,0.40), 0 14px 28px -12px rgba(20,20,30,0.50), 0 6px 12px -6px rgba(20,20,30,0.30)",
            color: "#fff",
            fontSize: 15.5,
            fontWeight: 700,
            letterSpacing: "-0.022em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 18,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <svg
            viewBox="0 0 24 24"
            width={14}
            height={14}
            fill="none"
            stroke="#fff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add block
        </button>

        <button
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            padding: "14px 0 2px",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "-0.018em",
            background: "none",
            border: 0,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
