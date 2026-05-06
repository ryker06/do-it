"use client";

import { useState } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import RightDrawer from "@/components/RightDrawer";
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

  return (
    <RightDrawer onClose={onClose}>
      <div
        style={{
          padding: "24px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Add block
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--inset,#F2F2F7)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill="none"
              stroke="var(--ink-2,#1C1C1E)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* title input */}
        <div
          style={{
            padding: "6px 4px 16px",
            borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            marginBottom: 22,
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
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.030em",
              lineHeight: 1.1,
            }}
          />
        </div>

        {/* domain label */}
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Domain
        </div>

        {/* domain picker */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 6,
            marginBottom: 22,
          }}
        >
          {DOMAIN_IDS.map((id) => {
            const selected = domainId === id;
            return (
              <button
                key={id}
                onClick={() => setDomainId(id)}
                style={{
                  width: 46,
                  height: 46,
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
                  transform: selected ? "scale(1.06)" : "scale(1)",
                  transition: "transform .12s ease",
                }}
              >
                <DomainGlyph id={id} size={20} />
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
            marginBottom: 22,
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
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <button
            onClick={() => setScheduleToday(true)}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: 16,
              background: scheduleToday ? "#fff" : "var(--inset,#F2F2F7)",
              boxShadow: scheduleToday
                ? "0 0 0 1.5px var(--ink-2,#1C1C1E), 0 8px 18px -10px rgba(20,20,30,0.20)"
                : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: scheduleToday ? "var(--ink-2,#1C1C1E)" : "#fff",
                color: scheduleToday ? "#fff" : "var(--ink-3,#3A3A3C)",
                flexShrink: 0,
                boxShadow: scheduleToday
                  ? "0 2px 6px -2px rgba(20,20,30,0.30)"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
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
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.016em",
                  lineHeight: 1.1,
                }}
              >
                Today
              </div>
              <div
                style={{
                  fontSize: 10,
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
              padding: "13px",
              borderRadius: 16,
              background: !scheduleToday ? "#fff" : "var(--inset,#F2F2F7)",
              boxShadow: !scheduleToday
                ? "0 0 0 1.5px var(--ink-2,#1C1C1E), 0 8px 18px -10px rgba(20,20,30,0.20)"
                : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: !scheduleToday ? "var(--ink-2,#1C1C1E)" : "#fff",
                color: !scheduleToday ? "#fff" : "var(--ink-3,#3A3A3C)",
                flexShrink: 0,
                boxShadow: !scheduleToday
                  ? "0 2px 6px -2px rgba(20,20,30,0.30)"
                  : "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
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
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-2,#1C1C1E)",
                  letterSpacing: "-0.016em",
                  lineHeight: 1.1,
                }}
              >
                Inbox
              </div>
              <div
                style={{
                  fontSize: 10,
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
          disabled={!title.trim()}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: 999,
            border: 0,
            cursor: title.trim() ? "pointer" : "default",
            background: title.trim()
              ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
              : "var(--inset,#F2F2F7)",
            boxShadow: title.trim()
              ? "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 18px 38px -18px rgba(10,10,20,0.55)"
              : "none",
            color: title.trim() ? "#fff" : "var(--label,#8E8E93)",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.014em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: "inherit",
            transition: "background .15s ease",
          }}
        >
          Add block
        </button>
      </div>
    </RightDrawer>
  );
}
