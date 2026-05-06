"use client";

import { useEffect, useState } from "react";
import { fetchTodayPrayers, nextPrayer, minsUntilHHMM } from "@/lib/prayers";
import type { Anchor } from "@/lib/types";
import { CrescentSvg } from "./icons";

export function PrayerBanner() {
  const [anchors, setAnchors] = useState<Anchor[] | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    fetchTodayPrayers().then(setAnchors);
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;
  const next = anchors ? nextPrayer(anchors, now) : null;
  if (!anchors) {
    return (
      <div className="prayer">
        <div className="disc">
          <CrescentSvg />
        </div>
        <div className="name" style={{ opacity: 0.5 }}>
          Loading prayer times…
        </div>
      </div>
    );
  }
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
