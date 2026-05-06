"use client";

import { useEffect, useState } from "react";
import { fetchTodayPrayers, nextPrayer, minsUntilHHMM } from "@/lib/prayers";
import type { Anchor } from "@/lib/types";
import { CrescentSvg } from "./icons";

const CACHE_KEY = "do-it-prayer-cache-v1";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function loadCachedAnchors(): Anchor[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { date: string; anchors: Anchor[] };
    const today = new Date().toDateString();
    if (parsed.date !== today) return null;
    return parsed.anchors;
  } catch {
    return null;
  }
}

function saveCachedAnchors(anchors: Anchor[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ date: new Date().toDateString(), anchors }),
    );
  } catch {
    // storage quota or private mode — silent
  }
}

export function PrayerBanner() {
  const [anchors, setAnchors] = useState<Anchor[] | null>(() =>
    loadCachedAnchors(),
  );
  const [now, setNow] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState<boolean>(!loadCachedAnchors());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    fetchTodayPrayers().then((fresh) => {
      if (fresh.length > 0) {
        setAnchors(fresh);
        saveCachedAnchors(fresh);
      }
      setLoading(false);
    });
    return () => clearInterval(t);
  }, []);

  if (loading && !anchors) {
    return (
      <div className="prayer prayer-skeleton">
        <div className="disc" style={{ opacity: 0.4 }}>
          <CrescentSvg fill="#5E8A6E" />
        </div>
        <div className="name" style={{ opacity: 0.35, color: "#2F5A3E" }}>
          Next prayer
        </div>
        <div
          className="count"
          style={{
            opacity: 0.3,
            minWidth: 56,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          &nbsp;
        </div>
      </div>
    );
  }

  const next = anchors ? nextPrayer(anchors, now) : null;

  if (!next) {
    return (
      <div className="prayer">
        <div className="disc">
          <CrescentSvg />
        </div>
        <div className="name">No more prayers today</div>
        <div className="count">tomorrow</div>
      </div>
    );
  }

  const mins = minsUntilHHMM(next.hhmm, now);
  const countLabel =
    mins <= 0
      ? "now"
      : mins < 60
        ? `in ${mins}m`
        : `in ${Math.floor(mins / 60)}h ${mins % 60}m`;

  // Sort anchors by PRAYER_ORDER for the expanded list
  const sortedAnchors = anchors
    ? [...anchors].sort(
        (a, b) => PRAYER_ORDER.indexOf(a.label) - PRAYER_ORDER.indexOf(b.label),
      )
    : [];

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      style={{
        width: "100%",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "inherit",
        textAlign: "left",
        display: "block",
      }}
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse prayer times" : "Expand prayer times"}
    >
      {/* collapsed row — matches existing .prayer styles */}
      <div className="prayer" style={{ pointerEvents: "none" }}>
        <div className="disc">
          <CrescentSvg />
        </div>
        <div className="name">
          {next.label}
          <span className="at"> · {next.hhmm}</span>
        </div>
        <div className="count">{countLabel}</div>
        {/* chevron indicator */}
        <div
          style={{
            marginLeft: 4,
            color: "var(--label,#8E8E93)",
            display: "flex",
            alignItems: "center",
            transition: "transform 0.25s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={10}
            height={10}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* expanded all-prayers list */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? 220 : 0,
          transition: "max-height 0.30s ease",
        }}
      >
        <div
          style={{
            padding: "4px 14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {sortedAnchors.map((a) => {
            const minsTo = minsUntilHHMM(a.hhmm, now);
            const isPast = minsTo < -10;
            const isNext = a.label === next.label;
            return (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 10,
                  background: isNext ? "rgba(47,90,62,0.07)" : "transparent",
                  opacity: isPast ? 0.45 : 1,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: isNext ? 700 : 600,
                    color: isNext ? "#1F3A2A" : "var(--ink-2,#1C1C1E)",
                    letterSpacing: "-0.012em",
                    flex: 1,
                  }}
                >
                  {a.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: isNext ? "#2F5A3E" : "var(--label-2,#6E6E73)",
                    letterSpacing: "0.01em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {a.hhmm}
                </div>
                {isPast && (
                  <svg
                    viewBox="0 0 24 24"
                    width={11}
                    height={11}
                    fill="none"
                    stroke="#34C759"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l4 4L19 6" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
