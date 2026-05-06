"use client";

import { useEffect, useState } from "react";
import { fetchTodayPrayers, nextPrayer, minsUntilHHMM } from "@/lib/prayers";
import type { Anchor } from "@/lib/types";
import { CrescentSvg } from "./icons";

const CACHE_KEY = "do-it-prayer-cache-v1";

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
  // Seed from cache immediately so no flash of loading state on repeat visits
  const [anchors, setAnchors] = useState<Anchor[] | null>(() =>
    loadCachedAnchors(),
  );
  const [now, setNow] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState<boolean>(!loadCachedAnchors());

  useEffect(() => {
    // Tick every 30s
    const t = setInterval(() => setNow(new Date()), 30_000);

    // Fetch fresh times — even if cache hit, refresh in background
    fetchTodayPrayers().then((fresh) => {
      if (fresh.length > 0) {
        setAnchors(fresh);
        saveCachedAnchors(fresh);
      }
      setLoading(false);
    });

    return () => clearInterval(t);
  }, []);

  // Skeleton — shown only on first load with no cache
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

  return (
    <div className="prayer">
      <div className="disc">
        <CrescentSvg />
      </div>
      <div className="name">
        {next.label}
        <span className="at"> · {next.hhmm}</span>
      </div>
      <div className="count">{countLabel}</div>
    </div>
  );
}
