"use client";

import { useState, useEffect, useRef } from "react";
import { useDoIt } from "@/lib/store";
import type { DomainId } from "@/lib/types";

const DOMAIN_IDS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
  "food",
];
const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

interface BrainDumpSheetProps {
  onClose: () => void;
}

export default function BrainDumpSheet({ onClose }: BrainDumpSheetProps) {
  const { addToInbox } = useDoIt();
  const [text, setText] = useState("");
  const [domainId, setDomainId] = useState<DomainId | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSave() {
    if (!text.trim()) return;
    addToInbox(text.trim(), domainId);
    onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, domainId]);

  useEffect(() => {
    // Focus on mount after a brief tick so animation doesn't jank
    const t = setTimeout(() => textareaRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Backdrop — tap to close */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(18,18,24,0.18)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Inline strip — slides down from top of content area */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#fff",
          boxShadow:
            "0 1px 0 rgba(60,60,67,0.08), 0 4px 20px rgba(20,20,30,0.10), 0 12px 40px -10px rgba(20,20,30,0.14)",
          animation: "slideDown 0.20s cubic-bezier(0.32,0.72,0,1)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        {/* top strip header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px 10px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--label,#8E8E93)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Thought
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
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
              width={10}
              height={10}
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

        {/* textarea */}
        <div style={{ padding: "0 18px 10px" }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.014em",
              lineHeight: 1.5,
              background: "var(--inset,#F2F2F7)",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              borderRadius: 14,
              padding: "12px 14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* domain pills */}
        <div
          style={{
            display: "flex",
            gap: 5,
            padding: "0 18px 10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setDomainId(undefined)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              borderRadius: 999,
              background:
                domainId === undefined ? "#0A0A0F" : "var(--inset,#F2F2F7)",
              color: domainId === undefined ? "#fff" : "var(--label-2,#6E6E73)",
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "-0.008em",
              border: "none",
              cursor: "pointer",
            }}
          >
            Any
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
                  gap: 4,
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: active ? "#0A0A0F" : "var(--inset,#F2F2F7)",
                  color: active ? "#fff" : "var(--label-2,#6E6E73)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "-0.008em",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {DOMAIN_NAMES[id]}
              </button>
            );
          })}
        </div>

        {/* save row */}
        <div style={{ padding: "0 18px 18px", display: "flex", gap: 8 }}>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 999,
              border: 0,
              cursor: text.trim() ? "pointer" : "default",
              background: text.trim()
                ? "linear-gradient(180deg,#1A1A20 0%,#000 100%)"
                : "var(--inset,#F2F2F7)",
              color: text.trim() ? "#fff" : "var(--label,#8E8E93)",
              fontSize: 14.5,
              fontWeight: 600,
              letterSpacing: "-0.014em",
              fontFamily: "inherit",
              transition: "background .15s ease",
            }}
          >
            Save thought
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "12px 16px",
              borderRadius: 999,
              border: 0,
              cursor: "pointer",
              background: "var(--inset,#F2F2F7)",
              color: "var(--label-2,#6E6E73)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.012em",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0.6; }
          to   { transform: translateY(0);     opacity: 1; }
        }
      `}</style>
    </>
  );
}
