"use client";

import { useState, useRef } from "react";
import RightDrawer from "./RightDrawer";
import { SVG_LIBRARY } from "@/lib/svgLibrary";
import type { CoverImage } from "@/lib/types";

type PickerContext =
  | "goal"
  | "vision"
  | "wishlist"
  | "habit"
  | "person"
  | "routine";

const CONTEXT_EMOJIS: Record<PickerContext, string[]> = {
  goal: [
    "🎯",
    "💪",
    "📚",
    "🧘",
    "🏃",
    "🏋️",
    "⚡",
    "🔥",
    "⭐",
    "🌱",
    "🪨",
    "🏔️",
  ],
  vision: ["🌅", "🏔️", "🌟", "🦁", "⚔️", "🎯", "📖", "🧭", "🪶", "🌊"],
  wishlist: ["📦", "⌚", "📱", "💻", "🎧", "👟", "📷", "🛏️", "🪑", "☕"],
  habit: ["🔥", "⚡", "🌱", "💧", "🧘", "📖", "🏃", "✏️"],
  person: ["🤝", "❤️", "👥", "🪶", "🎁"],
  routine: ["⚡", "🌅", "🌙", "⏱️", "🪶", "⚔️"],
};

type Tab = "emoji" | "svg" | "url" | "upload";

interface CoverImagePickerProps {
  context: PickerContext;
  current: CoverImage | null | undefined;
  onConfirm: (image: CoverImage | null) => void;
  onClose: () => void;
}

function CoverImagePickerDrawer({
  context,
  current,
  onConfirm,
  onClose,
}: CoverImagePickerProps) {
  const [tab, setTab] = useState<Tab>("emoji");
  const [selected, setSelected] = useState<CoverImage | null>(current ?? null);
  const [urlInput, setUrlInput] = useState(
    current?.kind === "url" ? current.value : "",
  );
  const [urlValid, setUrlValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = CONTEXT_EMOJIS[context];

  function handleUrlChange(val: string) {
    setUrlInput(val);
    if (val.startsWith("http") || val.startsWith("data:")) {
      setSelected({ kind: "url", value: val });
      setUrlValid(true);
    } else {
      setUrlValid(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setSelected({ kind: "url", value: dataUrl });
      setUrlInput(dataUrl);
      setUrlValid(true);
    };
    reader.readAsDataURL(file);
  }

  const tabs: Tab[] = ["emoji", "svg", "url", "upload"];

  return (
    <RightDrawer onClose={onClose} width={360}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "24px 20px 0",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--ink,#0B0B0F)",
              letterSpacing: "-0.02em",
            }}
          >
            cover image
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--chip-surface,#F4F5F7)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--label,#8E8E93)",
            }}
            aria-label="close"
          >
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab pill toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "var(--chip-surface,#F4F5F7)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "7px 4px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                background: tab === t ? "#fff" : "transparent",
                color:
                  tab === t ? "var(--ink,#0B0B0F)" : "var(--label,#8E8E93)",
                boxShadow:
                  tab === t
                    ? "0 0 0 0.5px rgba(60,60,67,0.08), 0 1px 2px rgba(20,20,30,0.06)"
                    : "none",
                transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 120 }}>
          {tab === "emoji" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
              }}
            >
              {emojis.map((em) => {
                const isActive =
                  selected?.kind === "emoji" && selected.value === em;
                return (
                  <button
                    key={em}
                    onClick={() => setSelected({ kind: "emoji", value: em })}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isActive
                        ? "var(--blue-tint,#E2EEFF)"
                        : "var(--chip-surface,#F4F5F7)",
                      boxShadow: isActive
                        ? "0 0 0 1.5px var(--blue,#0A84FF)"
                        : "none",
                      transition: "all 0.12s",
                    }}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "svg" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
              }}
            >
              {SVG_LIBRARY.map((entry) => {
                const isActive =
                  selected?.kind === "svg-id" && selected.value === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() =>
                      setSelected({ kind: "svg-id", value: entry.id })
                    }
                    style={{
                      aspectRatio: "1",
                      borderRadius: 14,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      background: isActive
                        ? "var(--blue-tint,#E2EEFF)"
                        : "var(--chip-surface,#F4F5F7)",
                      color: isActive
                        ? "var(--blue,#0A84FF)"
                        : "var(--ink-3,#3A3A3C)",
                      boxShadow: isActive
                        ? "0 0 0 1.5px var(--blue,#0A84FF)"
                        : "none",
                      transition: "all 0.12s",
                      padding: "12px 8px 8px",
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: entry.svg }}
                      style={{ width: 24, height: 24, display: "block" }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: isActive
                          ? "var(--blue,#0A84FF)"
                          : "var(--label,#8E8E93)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {entry.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "url" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="paste image URL."
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "none",
                  background: "var(--chip-surface,#F4F5F7)",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: "var(--ink,#0B0B0F)",
                  outline: "none",
                  boxShadow:
                    "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                }}
              />
              {urlInput && (
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "var(--chip-surface,#F4F5F7)",
                    boxShadow:
                      "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {urlValid ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urlInput}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={() => setUrlValid(false)}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--label,#8E8E93)",
                        fontWeight: 500,
                      }}
                    >
                      enter a valid image URL
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "upload" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink,#0B0B0F)",
                  background: "var(--chip-surface,#F4F5F7)",
                  boxShadow:
                    "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                  letterSpacing: "-0.01em",
                }}
              >
                upload from device
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                style={{ display: "none" }}
                aria-label="upload image"
              />
              {selected?.kind === "url" &&
                selected.value.startsWith("data:") && (
                  <div
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 16,
                      overflow: "hidden",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selected.value}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer — fixed at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 20px 28px",
            background: "#fff",
            boxShadow: "0 -0.5px 0 var(--hairline,rgba(60,60,67,0.10))",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            onClick={() => {
              onConfirm(selected);
              onClose();
            }}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              background: "var(--ink,#0B0B0F)",
              letterSpacing: "-0.015em",
              boxShadow: "var(--shadow-press-ink)",
            }}
          >
            save.
          </button>
          {current && (
            <button
              onClick={() => {
                onConfirm(null);
                onClose();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--label,#8E8E93)",
                textAlign: "center",
                letterSpacing: "-0.005em",
              }}
            >
              remove cover
            </button>
          )}
        </div>
      </div>
    </RightDrawer>
  );
}

interface TriggerProps {
  context: PickerContext;
  current: CoverImage | null | undefined;
  onConfirm: (image: CoverImage | null) => void;
}

export function CoverImagePickerTrigger({
  context,
  current,
  onConfirm,
}: TriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="change cover image"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-frosted-disc)",
          color: "var(--ink-2,#1C1C1E)",
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={13}
          height={13}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      {open && (
        <CoverImagePickerDrawer
          context={context}
          current={current}
          onConfirm={onConfirm}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
