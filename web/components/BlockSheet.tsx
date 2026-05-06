"use client";

import { useEffect } from "react";
import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import type { Block, DomainId } from "@/lib/types";

const DOMAIN_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
  food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)",
};

const DOMAIN_NAMES: Record<DomainId, string> = {
  business: "Business",
  religion: "Religion",
  learning: "Learning",
  fitness: "Fitness",
  home: "Home",
  food: "Food",
};

interface BlockSheetProps {
  block: Block;
  onClose: () => void;
}

export default function BlockSheet({ block, onClose }: BlockSheetProps) {
  const { start, finish, moveBlockTo } = useDoIt();

  function handleStart() {
    start(block.id);
    onClose();
  }

  function handleDone() {
    finish(block.id);
    onClose();
  }

  function handleMove(target: "today" | "inbox") {
    moveBlockTo(block.id, target);
    onClose();
  }

  const effectiveMin = block.durationMin + (block.adjustedMin ?? 0);

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
          padding: "10px 22px 26px",
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
            margin: "0 auto 16px",
          }}
        />

        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            padding: "2px 4px 16px",
            borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: DOMAIN_BG[block.domain],
              boxShadow:
                "inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
              color: "var(--glyph,#0A0A0F)",
            }}
          >
            <DomainGlyph id={block.domain} size={22} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.028em",
                color: "var(--ink,#000)",
                lineHeight: 1.15,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {block.title}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--label-2,#6E6E73)",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  color: "var(--label-2,#6E6E73)",
                }}
              >
                {DOMAIN_NAMES[block.domain]}
              </span>
              <span style={{ color: "rgba(60,60,67,0.28)" }}>·</span>
              <span style={{ fontWeight: 500, color: "var(--label,#8E8E93)" }}>
                {effectiveMin} min
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              padding: "5px 9px",
              borderRadius: 999,
              background: "var(--inset,#F2F2F7)",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline-2,rgba(60,60,67,0.06))",
              alignSelf: "flex-start",
              marginTop: 2,
            }}
          >
            {block.status === "pending"
              ? "Idle"
              : block.status === "paused"
                ? "Paused"
                : block.status === "done"
                  ? "Done"
                  : "Active"}
          </div>
        </div>

        {/* 2×2 action grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {/* Start now */}
          <button
            onClick={handleStart}
            style={{
              aspectRatio: "1.35 / 1",
              borderRadius: 20,
              padding: "14px 14px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(180deg,#0A84FF 0%, #0066D6 100%)",
              boxShadow:
                "0 0 0 0.5px rgba(0,90,200,0.35), 0 10px 22px -10px rgba(0,122,255,0.55), 0 4px 10px -6px rgba(20,20,30,0.20)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 0 0 0.5px rgba(255,255,255,0.10)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.18)",
                boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.22)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5,3 19,12 5,21" fill="#fff" stroke="none" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                color: "#fff",
              }}
            >
              Start now
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.78)",
                  letterSpacing: "-0.005em",
                  marginTop: 2,
                }}
              >
                {effectiveMin} min focus
              </span>
            </div>
          </button>

          {/* Mark done */}
          <button
            onClick={handleDone}
            style={{
              aspectRatio: "1.35 / 1",
              borderRadius: 20,
              padding: "14px 14px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
              cursor: "pointer",
              border: "none",
              background: "var(--card,#fff)",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1.5px rgba(20,20,30,0.04)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="var(--ink-2,#1C1C1E)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                color: "var(--ink-2,#1C1C1E)",
              }}
            >
              Mark done
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  marginTop: 2,
                }}
              >
                Log as complete
              </span>
            </div>
          </button>

          {/* Move to tomorrow */}
          <button
            onClick={() => handleMove("inbox")}
            style={{
              aspectRatio: "1.35 / 1",
              borderRadius: 20,
              padding: "14px 14px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
              cursor: "pointer",
              border: "none",
              background: "var(--card,#fff)",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1.5px rgba(20,20,30,0.04)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="var(--ink-2,#1C1C1E)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 19l7-7-7-7" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                color: "var(--ink-2,#1C1C1E)",
              }}
            >
              Move on
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--label-2,#6E6E73)",
                  letterSpacing: "-0.005em",
                  marginTop: 2,
                }}
              >
                Push to end of list
              </span>
            </div>
          </button>

          {/* Skip */}
          <button
            onClick={onClose}
            style={{
              aspectRatio: "1.35 / 1",
              borderRadius: 20,
              padding: "14px 14px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
              cursor: "pointer",
              border: "none",
              background: "var(--card,#fff)",
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1px rgba(20,20,30,0.02), 0 6px 16px -12px rgba(20,20,30,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.7)",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(60,60,67,0.06), 0 1px 1.5px rgba(20,20,30,0.04)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke="var(--label,#8E8E93)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.018em",
                lineHeight: 1.2,
                color: "var(--label-2,#6E6E73)",
              }}
            >
              Dismiss
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--label,#8E8E93)",
                  letterSpacing: "-0.005em",
                  marginTop: 2,
                }}
              >
                Close sheet
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
