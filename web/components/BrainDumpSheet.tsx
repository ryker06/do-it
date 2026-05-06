"use client";

import { useState, useEffect } from "react";
import { useDoIt } from "@/lib/store";
import type { DomainId } from "@/lib/types";

const DOMAIN_IDS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
];
const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
};

interface BrainDumpSheetProps {
  onClose: () => void;
}

export default function BrainDumpSheet({ onClose }: BrainDumpSheetProps) {
  const { addToInbox } = useDoIt();
  const [text, setText] = useState("");
  const [domainId, setDomainId] = useState<DomainId | undefined>(undefined);

  function handleSave() {
    if (!text.trim()) return;
    addToInbox(text.trim(), domainId);
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
          background: "rgba(18,18,24,0.36)",
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
          padding: "10px 22px 24px",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            fontSize: 11,
            fontWeight: 700,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "var(--label,#8E8E93)",
            }}
          />
          <span style={{ color: "var(--label-2,#6E6E73)" }}>Thought</span>
          <span>·</span>
          <span>Brain dump</span>
        </div>

        {/* mic visual */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 160,
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* rings */}
            <div
              style={{
                position: "absolute",
                inset: 18,
                borderRadius: "50%",
                border: "1px solid rgba(0,122,255,0.18)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 4,
                borderRadius: "50%",
                border: "1px solid rgba(0,122,255,0.10)",
                pointerEvents: "none",
              }}
            />
            {/* mic button */}
            <button
              type="button"
              aria-label="Record voice note (coming soon)"
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background:
                  "linear-gradient(180deg,#3FA0FF 0%,#0A78FF 55%,#0062D6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 0 0 0.5px rgba(0,90,200,0.30), 0 18px 38px -12px rgba(0,122,255,0.45), 0 8px 18px -8px rgba(20,20,30,0.18), inset 0 1px 0 rgba(255,255,255,0.30)",
                border: "none",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 6,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(60% 50% at 50% 28%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 60%)",
                  pointerEvents: "none",
                }}
              />
              <svg
                viewBox="0 0 24 24"
                width={34}
                height={34}
                fill="none"
                stroke="#fff"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "relative", zIndex: 2 }}
              >
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0014 0" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="8" y1="21" x2="16" y2="21" />
              </svg>
            </button>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
            }}
          >
            Tap to record · or type below
          </span>
        </div>

        {/* transcript / text area */}
        <div
          style={{
            background: "var(--inset,#F2F2F7)",
            borderRadius: 18,
            padding: "14px 16px",
            boxShadow:
              "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06)), inset 0 1px 1px rgba(20,20,30,0.02)",
            marginBottom: 16,
            minHeight: 80,
          }}
        >
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            style={{
              width: "100%",
              fontSize: 14.5,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.014em",
              lineHeight: 1.5,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* domain tag row */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setDomainId(undefined)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 11px",
              borderRadius: 999,
              background:
                domainId === undefined ? "#0A0A0F" : "var(--inset,#F2F2F7)",
              color: domainId === undefined ? "#fff" : "var(--label-2,#6E6E73)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "-0.008em",
              border: "none",
              cursor: "pointer",
              boxShadow:
                domainId === undefined
                  ? "none"
                  : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
            }}
          >
            No domain
          </button>
          {DOMAIN_IDS.map((id) => {
            const active = domainId === id;
            return (
              <button
                key={id}
                onClick={() => setDomainId(active ? undefined : id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 11px",
                  borderRadius: 999,
                  background: active ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                  color: active ? "#fff" : "var(--label-2,#6E6E73)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "-0.008em",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: active
                    ? "none"
                    : "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
                }}
              >
                {DOMAIN_NAMES[id]}
              </button>
            );
          })}
        </div>

        {/* save */}
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: 999,
            border: 0,
            cursor: text.trim() ? "pointer" : "default",
            background: text.trim()
              ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
              : "var(--inset,#F2F2F7)",
            boxShadow: text.trim()
              ? "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 18px 38px -18px rgba(10,10,20,0.55)"
              : "none",
            color: text.trim() ? "#fff" : "var(--label,#8E8E93)",
            fontSize: 15.5,
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
          Save thought
        </button>
      </div>
    </div>
  );
}
