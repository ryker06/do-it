"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, CrescentSvg } from "@/components/icons";
import type { Anchor } from "@/lib/types";

const PRAYER_CACHE_KEY = "do-it-prayer-cache-v1";

function readDhuhrFromCache(): { label: string; hhmm: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { date: string; anchors: Anchor[] };
    if (parsed.date !== new Date().toDateString()) return null;
    const dhuhr = parsed.anchors.find((a) => a.label.toLowerCase() === "dhuhr");
    return dhuhr ? { label: dhuhr.label, hhmm: dhuhr.hhmm } : null;
  } catch {
    return null;
  }
}

export default function TodayPage() {
  const { blocks, domains, start, resume } = useDoIt();
  const [dhuhr, setDhuhr] = useState<{ label: string; hhmm: string } | null>(
    null,
  );

  useEffect(() => {
    // Read from the shared prayer cache (populated by PrayerBanner on /now).
    // Avoids a duplicate network fetch — same cache key, same day-string check.
    const cached = readDhuhrFromCache();
    if (cached) {
      setDhuhr(cached);
      return;
    }
    // Cache miss (cold load or different day): fetch fresh and cache.
    import("@/lib/prayers").then(({ fetchTodayPrayers }) => {
      fetchTodayPrayers().then((anchors) => {
        if (anchors.length > 0) {
          // Write shared cache so PrayerBanner also benefits.
          try {
            localStorage.setItem(
              PRAYER_CACHE_KEY,
              JSON.stringify({ date: new Date().toDateString(), anchors }),
            );
          } catch {
            // storage quota or private mode — silent
          }
          const d = anchors.find((a) => a.label.toLowerCase() === "dhuhr");
          if (d) setDhuhr({ label: d.label, hhmm: d.hhmm });
        }
      });
    });
  }, []);

  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const totalMin = sorted.reduce(
    (acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0),
    0,
  );
  const doneMin = sorted
    .filter((b) => b.status === "done")
    .reduce((acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0), 0);
  const aheadMin = totalMin - doneMin;
  const pct = totalMin > 0 ? Math.round((doneMin / totalMin) * 100) : 0;

  const anchorPos = 2; // Dhuhr inserts after the 2nd block, mid-morning
  const firstIdleIdx = sorted.findIndex((b) => b.status === "idle");

  return (
    <>
      <Topbar name="Today" sub="calmly on track" />

      <div className="summary">
        <div className="sum-stat">
          <div className="sum-num">
            {hToHM(doneMin).h > 0 && (
              <>
                {hToHM(doneMin).h}
                <span className="unit">h</span>
              </>
            )}
            {hToHM(doneMin).m.toString().padStart(2, "0")}
            <span className="unit">m</span>
          </div>
          <div className="sum-lbl">Done</div>
        </div>
        <div className="sum-divider" />
        <div className="sum-stat">
          <div className="sum-num">
            {hToHM(aheadMin).h > 0 && (
              <>
                {hToHM(aheadMin).h}
                <span className="unit">h</span>
              </>
            )}
            {hToHM(aheadMin).m.toString().padStart(2, "0")}
            <span className="unit">m</span>
          </div>
          <div className="sum-lbl">Ahead</div>
        </div>
        <div className="sum-track">
          <div className="line">
            <span className="dot" />
            {sorted.length} blocks · 1 anchor
          </div>
          <div className="bar">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="section-eyebrow">
        <span className="lbl">The day</span>
        <span className="rule" />
      </div>

      <div className="timeline-wrap">
        <div className="timeline">
          {sorted.map((b, idx) => {
            const d = domains.find((x) => x.id === b.domainId);
            const status = b.status;
            const cls =
              status === "done"
                ? "done"
                : status === "active" || status === "paused"
                  ? "flow"
                  : "";

            return (
              <div key={b.id}>
                {idx === anchorPos && (
                  <div className="tl-block anchor">
                    <div className="row anchor">
                      <div className="ddisc religion sm">
                        <CrescentSvg size={16} />
                      </div>
                      <div className="text">
                        <div className="title" style={{ color: "#1F3A2A" }}>
                          {dhuhr
                            ? `${dhuhr.label} · ${dhuhr.hhmm}`
                            : "Dhuhr · loading"}
                        </div>
                      </div>
                      <span className="pill anchor">Anchor</span>
                    </div>
                  </div>
                )}
                <div className={`tl-block ${cls}`}>
                  <Link
                    href="/now"
                    onClick={() => {
                      if (status === "idle") start(b.id);
                      else if (status === "paused") resume(b.id);
                    }}
                    className={`row ${cls}`}
                  >
                    <div className={`ddisc ${b.domainId} row`}>
                      <DomainGlyph id={b.domainId} />
                    </div>
                    <div className="text">
                      <div className="title">{b.title}</div>
                      <div className="meta">
                        {d?.name}
                        <span className="sep">·</span>
                        {b.durationMin + (b.adjustedMin ?? 0)} min
                      </div>
                    </div>
                    {status === "done" && (
                      <span className="pill done">Done</span>
                    )}
                    {status === "active" && (
                      <span className="pill flow">
                        <span className="ldot" />
                        In flow
                      </span>
                    )}
                    {status === "paused" && (
                      <span className="pill flow">Paused</span>
                    )}
                    {b.adjustedMin && status === "idle" && (
                      <span className="pill adj">+{b.adjustedMin}m</span>
                    )}
                    {status === "idle" &&
                      !b.adjustedMin &&
                      idx === firstIdleIdx && (
                        <span className="pill up-next">Up next</span>
                      )}
                    {status === "idle" &&
                      !b.adjustedMin &&
                      idx !== firstIdleIdx && (
                        <span className="pill later">Later</span>
                      )}
                    {(status === "active" || status === "paused") && (
                      <div
                        className="progress-line"
                        style={{ width: `${progressPct(b)}%` }}
                      />
                    )}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function hToHM(min: number): { h: number; m: number } {
  return { h: Math.floor(min / 60), m: min % 60 };
}

function progressPct(b: {
  durationMin: number;
  adjustedMin?: number;
  accumulatedMs: number;
  startedAt?: number;
  status: string;
}) {
  const total = (b.durationMin + (b.adjustedMin ?? 0)) * 60_000;
  let elapsed = b.accumulatedMs;
  if (b.status === "active" && b.startedAt) elapsed += Date.now() - b.startedAt;
  return Math.min(100, Math.round((elapsed / total) * 100));
}
