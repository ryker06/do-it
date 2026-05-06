"use client";

import { useState, useRef, useEffect } from "react";
import { useDoIt } from "@/lib/store";
import type { DomainId } from "@/lib/types";

// Keyword → domain auto-tagger
function inferDomain(text: string): DomainId {
  const t = text.toLowerCase();
  if (/gym|workout|push|pull|run|exercise|fitness|lift|train/.test(t))
    return "fitness";
  if (
    /prayer|quran|salah|salat|fajr|dhuhr|asr|maghrib|isha|allah|dua|religion/.test(
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
  return "home";
}

export function VoiceCaptureButton() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToInbox } = useDoIt();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setText("");
      }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const domain = inferDomain(trimmed);
    addToInbox(trimmed, domain);
    setText("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
  }

  return (
    <>
      {/* Inline capture strip — shown when open */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 55,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "saturate(180%) blur(20px)",
            WebkitBackdropFilter: "saturate(180%) blur(20px)",
            borderBottom: "0.5px solid rgba(60,60,67,0.10)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 12px rgba(20,20,30,0.06)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(180deg,#3FA0FF 0%,#0A78FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow:
                "0 0 0 0.5px rgba(0,90,200,0.30), 0 4px 10px -4px rgba(0,122,255,0.40)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0014 0" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="8" y1="21" x2="16" y2="21" />
            </svg>
          </div>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: 500,
              color: "var(--ink-2,#1C1C1E)",
              letterSpacing: "-0.014em",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          {text.trim() ? (
            <button
              onClick={handleSave}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.012em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5)",
                flexShrink: 0,
              }}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                setText("");
              }}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                background: "var(--inset,#F2F2F7)",
                color: "var(--label-2,#6E6E73)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "-0.012em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
              }}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* FAB — fixed bottom-right */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Capture a thought"
          style={{
            position: "fixed",
            bottom: 90,
            right: 18,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background:
              "linear-gradient(180deg,#3FA0FF 0%,#0A78FF 55%,#0062D6 100%)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 0 0.5px rgba(0,90,200,0.30), 0 18px 38px -12px rgba(0,122,255,0.45), 0 8px 18px -8px rgba(20,20,30,0.18), inset 0 1px 0 rgba(255,255,255,0.30)",
            zIndex: 40,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0014 0" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
        </button>
      )}
    </>
  );
}
