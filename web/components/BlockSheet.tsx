"use client";

import { useDoIt } from "@/lib/store";
import { DomainGlyph } from "@/components/icons";
import RightDrawer from "@/components/RightDrawer";
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
        {/* close row */}
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
            Block
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

        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            padding: "0 0 18px",
            borderBottom: "0.5px solid var(--hairline-2,rgba(60,60,67,0.06))",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
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
          <div style={{ flex: 1, minWidth: 0 }}>
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
                marginTop: 4,
              }}
            >
              <span
                style={{ fontWeight: 700, color: "var(--label-2,#6E6E73)" }}
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

        {/* Step preview */}
        {block.step && (
          <div
            style={{
              background: "var(--inset,#F2F2F7)",
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 7,
              }}
            >
              Step {(block.step.current ?? 0) + 1} of {block.step.items.length}
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "var(--ink,#000)",
                letterSpacing: "-0.016em",
                lineHeight: 1.3,
              }}
            >
              {block.step.items[block.step.current ?? 0]}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={handleStart}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "linear-gradient(180deg,#0A84FF 0%, #0066D6 100%)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.016em",
              display: "flex",
              alignItems: "center",
              gap: 9,
              boxShadow:
                "0 0 0 0.5px rgba(0,90,200,0.35), 0 10px 22px -10px rgba(0,122,255,0.55)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={15}
              height={15}
              fill="none"
              stroke="none"
            >
              <polygon points="5,3 19,12 5,21" fill="#fff" />
            </svg>
            Start now
            <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.78 }}>
              {effectiveMin} min focus
            </span>
          </button>

          <button
            onClick={handleDone}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "var(--card,#fff)",
              color: "var(--ink-2,#1C1C1E)",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.016em",
              display: "flex",
              alignItems: "center",
              gap: 9,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 2px rgba(20,20,30,0.04)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={15}
              height={15}
              fill="none"
              stroke="var(--ink-2,#1C1C1E)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l4 4L19 6" />
            </svg>
            Mark done
          </button>

          <button
            onClick={() => handleMove("inbox")}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "var(--card,#fff)",
              color: "var(--ink-2,#1C1C1E)",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.016em",
              display: "flex",
              alignItems: "center",
              gap: 9,
              boxShadow:
                "0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 2px rgba(20,20,30,0.04)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={15}
              height={15}
              fill="none"
              stroke="var(--ink-2,#1C1C1E)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 19l7-7-7-7" />
            </svg>
            Move to inbox
          </button>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              background: "none",
              color: "var(--label-2,#6E6E73)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.012em",
              textAlign: "center",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </RightDrawer>
  );
}
