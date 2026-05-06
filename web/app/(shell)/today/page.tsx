"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, CrescentSvg } from "@/components/icons";
import BlockSheet from "@/components/BlockSheet";
import BlockCreateSheet from "@/components/BlockCreateSheet";
import type { Anchor, Block } from "@/lib/types";

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
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const cached = readDhuhrFromCache();
    if (cached) {
      setDhuhr(cached);
      return;
    }
    import("@/lib/prayers").then(({ fetchTodayPrayers }) => {
      fetchTodayPrayers().then((anchors) => {
        if (anchors.length > 0) {
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

  const anchorPos = 2;
  const firstIdleIdx = sorted.findIndex((b) => b.status === "pending");

  // Empty state
  if (sorted.length === 0) {
    return (
      <>
        <Topbar name="Today" sub="a quiet start" />

        <div className="section-eyebrow">
          <span className="lbl">The day</span>
          <span className="rule" />
          <span className="meta">empty</span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "8px 4px 110px",
          }}
        >
          {/* orb */}
          <div
            style={{
              width: 148,
              height: 148,
              borderRadius: "50%",
              position: "relative",
              margin: "18px auto 0",
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 22%, transparent 45%), radial-gradient(circle at 50% 60%, #DCEAFC 0%, #C5DCF7 60%, #ABCAF0 100%)",
              boxShadow:
                "inset 0 -10px 30px rgba(60,90,140,0.18), inset 0 2px 0 rgba(255,255,255,0.9), 0 30px 60px -22px rgba(60,90,140,0.28), 0 10px 30px -10px rgba(60,90,140,0.16)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(20,30,50,0.42)",
                zIndex: 1,
              }}
            >
              <svg
                viewBox="0 0 48 48"
                width={54}
                height={54}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="7" />
                <path d="M24 9v3M24 36v3M9 24h3M36 24h3M13.5 13.5l2.1 2.1M32.4 32.4l2.1 2.1M13.5 34.5l2.1-2.1M32.4 15.6l2.1-2.1" />
              </svg>
            </div>
          </div>

          {/* copy */}
          <div
            style={{ textAlign: "center", marginTop: 34, padding: "0 18px" }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--ink,#000)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              Nothing scheduled
              <br />
              <span
                style={{
                  color: "var(--label,#8E8E93)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                }}
              >
                for today.
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 14.5,
                fontWeight: 500,
                color: "var(--label-2,#6E6E73)",
                letterSpacing: "-0.012em",
                lineHeight: 1.42,
              }}
            >
              Pick a routine or add a block to begin.
            </div>
          </div>

          {/* actions */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "0 6px",
            }}
          >
            <Link
              href="/routines/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "14px 22px",
                borderRadius: 999,
                background: "linear-gradient(180deg, #1A1A20 0%, #000000 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14.5,
                letterSpacing: "-0.012em",
                textDecoration: "none",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 18px 38px -18px rgba(10,10,20,0.55), 0 6px 14px -6px rgba(10,10,20,0.30)",
              }}
            >
              Pick a routine
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 12 12"
                  width={9}
                  height={9}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 6h7M6 3l3 3-3 3" />
                </svg>
              </span>
            </Link>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "14px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.7)",
                color: "var(--ink-2,#1C1C1E)",
                fontWeight: 600,
                fontSize: 14.5,
                letterSpacing: "-0.012em",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow:
                  "0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10)), 0 1px 1px rgba(20,20,30,0.03), 0 1px 0 rgba(255,255,255,0.7) inset",
                backdropFilter: "saturate(180%) blur(10px)",
                WebkitBackdropFilter: "saturate(180%) blur(10px)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
                fill="none"
                stroke="var(--ink-2,#1C1C1E)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add a block
            </button>
          </div>
        </div>

        {showCreate && (
          <BlockCreateSheet onClose={() => setShowCreate(false)} />
        )}
      </>
    );
  }

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
        {/* yesterday link */}
        <Link
          href="/yesterday"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--label-2,#6E6E73)",
            letterSpacing: "-0.005em",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Yesterday
          <svg
            viewBox="0 0 24 24"
            width={9}
            height={9}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div className="timeline-wrap">
        <div className="timeline">
          {sorted.map((b, idx) => {
            const d = domains.find((x) => x.id === b.domain);
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
                  {status === "pending" ? (
                    // Tap idle block → open BlockSheet
                    <button
                      onClick={() => setSelectedBlock(b)}
                      className={`row ${cls}`}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        padding: 0,
                      }}
                    >
                      <div className={`ddisc ${b.domain} row`}>
                        <DomainGlyph id={b.domain} />
                      </div>
                      <div className="text">
                        <div className="title">{b.title}</div>
                        <div className="meta">
                          {d?.name}
                          <span className="sep">·</span>
                          {b.durationMin + (b.adjustedMin ?? 0)} min
                        </div>
                      </div>
                      {b.adjustedMin && (
                        <span className="pill adj">+{b.adjustedMin}m</span>
                      )}
                      {!b.adjustedMin && idx === firstIdleIdx && (
                        <span className="pill up-next">Up next</span>
                      )}
                      {!b.adjustedMin && idx !== firstIdleIdx && (
                        <span className="pill later">Later</span>
                      )}
                    </button>
                  ) : (
                    // Active/paused/done → navigate to /now
                    <Link
                      href="/now"
                      onClick={() => {
                        if (status === "paused") resume(b.id);
                      }}
                      className={`row ${cls}`}
                    >
                      <div className={`ddisc ${b.domain} row`}>
                        <DomainGlyph id={b.domain} />
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
                      {(status === "active" || status === "paused") && (
                        <div
                          className="progress-line"
                          style={{ width: `${progressPct(b)}%` }}
                        />
                      )}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* + Add block FAB */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed",
          bottom: 100,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 14px 28px -10px rgba(10,10,20,0.45)",
          zIndex: 10,
        }}
        aria-label="Add block"
      >
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="#fff"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {selectedBlock && (
        <BlockSheet
          block={selectedBlock}
          onClose={() => setSelectedBlock(null)}
        />
      )}

      {showCreate && <BlockCreateSheet onClose={() => setShowCreate(false)} />}
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
