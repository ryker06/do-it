"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import {
  activeBlock,
  formatRemaining,
  nextBlock,
  pickFocus,
  remainingMs,
} from "@/lib/engine";
import { PrayerBanner } from "@/components/PrayerBanner";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, ClockSvg, CheckSvg } from "@/components/icons";
import BrainDumpSheet from "@/components/BrainDumpSheet";
import { fetchTodayPrayers, minsUntilHHMM } from "@/lib/prayers";
import type { Anchor } from "@/lib/types";

const PRAYER_CACHE_KEY = "do-it-prayer-cache-v1";

function loadCachedAnchors(): Anchor[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { date: string; anchors: Anchor[] };
    if (parsed.date !== new Date().toDateString()) return null;
    return parsed.anchors;
  } catch {
    return null;
  }
}

const DOMAIN_BG: Record<string, string> = {
  business: "linear-gradient(180deg,#E1ECFF 0%, #C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%, #C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE3EB 0%, #FFCFDC 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%, #FFB6C5 100%)",
  home: "linear-gradient(180deg,#E5ECF0 0%, #CFDCE3 100%)",
};

export default function NowPage() {
  const router = useRouter();
  const { blocks, domains, start, pause, resume, finish, extend } = useDoIt();
  const [now, setNow] = useState<number>(() => Date.now());
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [anchors, setAnchors] = useState<Anchor[] | null>(() =>
    loadCachedAnchors(),
  );

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Load prayer times for anchor-interrupt detection
    const cached = loadCachedAnchors();
    if (cached) {
      setAnchors(cached);
      return;
    }
    fetchTodayPrayers().then((fresh) => {
      if (fresh.length > 0) {
        try {
          localStorage.setItem(
            PRAYER_CACHE_KEY,
            JSON.stringify({ date: new Date().toDateString(), anchors: fresh }),
          );
        } catch {
          // silent
        }
        setAnchors(fresh);
      }
    });
  }, []);

  const focus = pickFocus(blocks);
  const next = focus ? nextBlock(blocks, focus.id) : null;
  const nextDomain = next ? domains.find((d) => d.id === next.domain) : null;
  const domain = focus ? domains.find((d) => d.id === focus.domain) : null;
  const remaining = focus ? remainingMs(focus, now) : 0;
  const totalMs = focus
    ? (focus.durationMin + (focus.adjustedMin ?? 0)) * 60_000
    : 0;
  const elapsed = focus ? totalMs - remaining : 0;
  const pctDone =
    totalMs > 0 ? Math.min(100, Math.round((elapsed / totalMs) * 100)) : 0;
  const live = focus?.status === "active";
  const paused = focus?.status === "paused";

  // Anchor-interrupt: find next prayer ≤ 5 min away
  const nowDate = new Date(now);
  const prayerWarning = anchors
    ? anchors
        .map((a) => ({ a, mins: minsUntilHHMM(a.hhmm, nowDate) }))
        .find((x) => x.mins >= 0 && x.mins <= 5)
    : null;
  // Prayer-time mode: prayer is at 0 min (or negative, meaning right now)
  const prayerNow = anchors
    ? anchors
        .map((a) => ({ a, mins: minsUntilHHMM(a.hhmm, nowDate) }))
        .find((x) => x.mins >= -10 && x.mins <= 0)
    : null;

  // Day-complete state
  if (!focus) {
    const doneBlocks = blocks.filter((b) => b.status === "done");
    const totalDoneMin = doneBlocks.reduce(
      (acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0),
      0,
    );
    const hh = Math.floor(totalDoneMin / 60);
    const mm = totalDoneMin % 60;
    const todayDow = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    const todayTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return (
      <>
        {/* dusk halo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 520,
            background:
              "radial-gradient(110% 70% at 50% -10%, rgba(120,150,180,0.10) 0%, rgba(120,150,180,0.03) 38%, transparent 68%), radial-gradient(80% 60% at 85% 0%, rgba(180,200,220,0.18) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        <Topbar name={`Evening, Adam`} sub="that's the day" />

        {/* Hero */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: 40,
            padding: "6px 8px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              fontWeight: 700,
              color: "#5C6B79",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#5C6B79",
                opacity: 0.6,
              }}
            />
            Day complete
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.05em",
              lineHeight: 0.96,
            }}
          >
            That&apos;s it
            <br />
            <span style={{ color: "var(--label,#8E8E93)", fontWeight: 600 }}>
              for today.
            </span>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 14.5,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
            }}
          >
            <b style={{ color: "var(--ink-2,#1C1C1E)", fontWeight: 700 }}>
              {doneBlocks.length} block{doneBlocks.length !== 1 ? "s" : ""}.
            </b>{" "}
            {hh > 0 ? `${hh}h ${mm}m` : `${mm}m`}. Calm execution.
          </div>
        </div>

        {/* Domain recap discs */}
        {doneBlocks.length > 0 && (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              margin: "30px 8px 0",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--label,#8E8E93)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginRight: 4,
              }}
            >
              Today
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {Array.from(new Set(doneBlocks.map((b) => b.domain))).map(
                (id, i) => (
                  <div
                    key={id}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: DOMAIN_BG[id] ?? "var(--inset,#F2F2F7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: i > 0 ? -8 : 0,
                      boxShadow:
                        "0 0 0 2px #fff, inset 0 0 0 0.5px rgba(20,20,30,0.06), inset 0 -2px 4px rgba(20,20,30,0.04), 0 1px 2px rgba(20,20,30,0.04)",
                    }}
                  >
                    <DomainGlyph id={id} size={17} />
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* divider */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            margin: "30px 8px 0",
            height: 0.5,
            background: "var(--hairline,rgba(60,60,67,0.10))",
          }}
        />

        {/* Actions */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: 22,
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          <button
            className="cta"
            style={{ fontFamily: "inherit" }}
            onClick={() => router.push("/today")}
          >
            Preview tomorrow
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="#fff"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            style={{
              width: "100%",
              background: "transparent",
              color: "var(--label-2,#6E6E73)",
              border: "none",
              borderRadius: 999,
              padding: "13px 20px",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "-0.012em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Just rest
          </button>
        </div>

        {showBrainDump && (
          <BrainDumpSheet onClose={() => setShowBrainDump(false)} />
        )}
      </>
    );
  }

  // ── Anchor-interrupt: prayer now (State B — mint hero) ──
  if (prayerNow && focus) {
    const blockedMin = Math.floor(
      (focus.accumulatedMs +
        (focus.status === "active" && focus.startedAt
          ? now - focus.startedAt
          : 0)) /
        60_000,
    );
    const blockedSec = Math.floor(
      ((focus.accumulatedMs +
        (focus.status === "active" && focus.startedAt
          ? now - focus.startedAt
          : 0)) %
        60_000) /
        1000,
    );
    const pausedTimeStr = `${blockedMin}:${blockedSec.toString().padStart(2, "0")}`;

    return (
      <>
        {/* mint halo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 340,
            background:
              "radial-gradient(120% 80% at 50% -10%, rgba(47,90,62,0.10) 0%, rgba(47,90,62,0.03) 35%, transparent 65%), radial-gradient(80% 60% at 85% 0%, rgba(140,200,160,0.18) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <Topbar name="A moment" sub="for prayer" />

        {/* Status pill */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginBottom: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px 6px 8px",
            background: "rgba(255,255,255,0.55)",
            boxShadow:
              "inset 0 0 0 0.5px rgba(47,90,62,0.10), 0 1px 1px rgba(47,90,62,0.04)",
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#2F5A3E",
              boxShadow: "0 0 0 3px rgba(47,90,62,0.08)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1F3A2A",
              letterSpacing: "-0.008em",
            }}
          >
            In prayer{" "}
            <span style={{ color: "#5E8A6E", fontWeight: 500 }}>
              · {prayerNow.a.hhmm}
            </span>
          </span>
        </div>

        {/* Mint hero card */}
        <div
          className="hero"
          style={{
            background: "linear-gradient(180deg, #F0F8F2 0%, #E2F0E6 100%)",
            boxShadow:
              "0 0 0 0.5px rgba(47,90,62,0.10), 0 1px 1px rgba(47,90,62,0.03), 0 12px 28px -14px rgba(47,90,62,0.16), 0 26px 50px -28px rgba(47,90,62,0.20)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 30,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(47,90,62,0.16)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              fontWeight: 600,
              color: "#2F5A3E",
              letterSpacing: "-0.012em",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#2F5A3E",
                boxShadow: "0 0 0 3px rgba(47,90,62,0.08)",
              }}
            />
            In prayer
            <span style={{ color: "#5E8A6E", fontWeight: 500 }}>· no rush</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(180deg,#FFFFFF 0%, #F0F8F3 100%)",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(47,90,62,0.16), inset 0 -2px 4px rgba(47,90,62,0.05), 0 1px 3px rgba(47,90,62,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                fill="none"
                stroke="#1F3A2A"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16.5 14.8a6.4 6.4 0 11-7.3-9.6 5.2 5.2 0 007.3 9.6z" />
                <path d="M17.5 5l.7 1.6 1.7.3-1.3 1.1.4 1.7L17.5 9l-1.5.7.4-1.7-1.3-1.1 1.7-.3z" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1F3A2A",
                  letterSpacing: "-0.012em",
                }}
              >
                Religion · Anchor
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#5E8A6E",
                  fontWeight: 500,
                  letterSpacing: "-0.008em",
                }}
              >
                Pray when ready · no countdown
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--label-2,#6E6E73)",
                background: "var(--inset,#F2F2F7)",
                padding: "5px 10px 5px 8px",
                borderRadius: 999,
                boxShadow:
                  "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
              }}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 2 }}
              >
                <i
                  style={{
                    display: "block",
                    width: 2,
                    height: 8,
                    background: "var(--label-2,#6E6E73)",
                    borderRadius: 1,
                  }}
                />
                <i
                  style={{
                    display: "block",
                    width: 2,
                    height: 8,
                    background: "var(--label-2,#6E6E73)",
                    borderRadius: 1,
                  }}
                />
              </span>
              Paused
            </div>
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#1F3A2A",
              letterSpacing: "-0.038em",
              lineHeight: 1.02,
              marginBottom: 6,
            }}
          >
            {prayerNow.a.label}{" "}
            <span style={{ color: "#5E8A6E", fontWeight: 600 }}>
              · {prayerNow.a.hhmm}
            </span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#5E8A6E",
              fontWeight: 500,
              letterSpacing: "-0.008em",
              lineHeight: 1.35,
              marginBottom: 18,
            }}
          >
            Pray when you&apos;re ready. The day waits with you.
          </div>

          <button
            onClick={() => finish(focus.id)}
            className="cta"
            style={{
              background: "linear-gradient(180deg, #2E7B5E 0%, #1F5A45 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.30) inset, 0 0 0 0.5px rgba(31,90,68,0.40), 0 18px 38px -18px rgba(31,90,68,0.45), 0 6px 14px -6px rgba(31,90,68,0.25)",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.20)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={11}
                height={11}
                fill="none"
                stroke="#fff"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>
            </span>
            Marked prayed
          </button>

          {/* Paused block status */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.55)",
              boxShadow: "inset 0 0 0 0.5px rgba(47,90,62,0.10)",
              fontSize: 12,
              color: "#5E8A6E",
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#fff",
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                boxShadow: "0 0 0 0.5px rgba(47,90,62,0.10)",
              }}
            >
              <i
                style={{
                  display: "block",
                  width: 2,
                  height: 8,
                  background: "#5E8A6E",
                  borderRadius: 1,
                }}
              />
              <i
                style={{
                  display: "block",
                  width: 2,
                  height: 8,
                  background: "#5E8A6E",
                  borderRadius: 1,
                }}
              />
            </span>
            {focus.title} paused at{" "}
            <b style={{ color: "#1F3A2A", fontWeight: 700, marginLeft: 3 }}>
              {pausedTimeStr}
            </b>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11.5,
                color: "#5E8A6E",
                fontWeight: 600,
              }}
            >
              · resume after
            </span>
          </div>
        </div>

        {/* Then section */}
        {next && (
          <div className="then-wrap">
            <div className="then-head">
              <div className="then-title">
                Then <span className="when">· after prayer</span>
              </div>
              <div className="then-count">
                <b>{nextCount(blocks, focus.id)}</b> more today
              </div>
            </div>
            <div className="then-stack">
              <div className="peek p2" />
              <div className="peek p1" />
              <div className="then-row">
                <div className={`ddisc ${next.domain} sm`}>
                  <DomainGlyph id={next.domain} />
                </div>
                <div className="text">
                  <div className="domain-tag">{nextDomain?.name}</div>
                  <div className="name">{next.title}</div>
                </div>
                <div className="when-pill">
                  <ClockSvg stroke="#6E6E73" size={10} />
                  {next.durationMin} min
                </div>
              </div>
            </div>
          </div>
        )}

        {showBrainDump && (
          <BrainDumpSheet onClose={() => setShowBrainDump(false)} />
        )}
      </>
    );
  }

  const onPrimary = () => {
    if (focus.status === "pending") start(focus.id);
    else if (focus.status === "active") pause(focus.id);
    else if (focus.status === "paused") resume(focus.id);
  };

  const remainingMin = Math.ceil(remaining / 60_000);
  const blockMin = focus.durationMin + (focus.adjustedMin ?? 0);
  const anyMomentum = !!focus.adjustedMin;

  const topbarName = live ? "In flow" : paused ? "Paused" : "Morning, Adam";
  const topbarSub = live
    ? "stay with it"
    : paused
      ? "ready when you are"
      : "let's start";

  return (
    <>
      <Topbar name={topbarName} sub={topbarSub} live={live} />

      {/* Anchor-interrupt: 5-min warning banner above hero */}
      {prayerWarning && !prayerNow && (
        <div
          className="prayer warn"
          style={{
            background: "linear-gradient(180deg, #E2F2E8 0%, #CFE7D9 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(47,90,62,0.16), 0 1px 2px rgba(47,90,62,0.06), 0 8px 22px -10px rgba(47,90,62,0.24)",
          }}
        >
          <div className="disc">
            <svg viewBox="0 0 24 24" width={17} height={17} fill="none">
              <path
                d="M16.5 14.5a6.5 6.5 0 11-7-9.5 5.5 5.5 0 007 9.5z"
                fill="#2F5A3E"
              />
            </svg>
          </div>
          <div className="pmsg">
            <div className="name">
              {prayerWarning.a.label}
              <span className="at"> · {prayerWarning.a.hhmm}</span>
            </div>
            <div className="hint">Pause when you&apos;re ready</div>
          </div>
          <div className="count pulse">in {prayerWarning.mins} min</div>
        </div>
      )}

      {!prayerWarning && <PrayerBanner />}

      <div className="hero">
        <div className={`card-eyebrow${live ? " live" : ""}`}>
          <span className="pip" />
          {live ? "Now in flow" : paused ? "On hold" : "Up next"}
          <span className="at">
            ·{" "}
            {live
              ? "stay with it"
              : paused
                ? "pick up when ready"
                : "in a moment"}
          </span>
        </div>

        <div className="badge-row">
          <div
            className={`ddisc ${focus.domain}`}
            aria-label={domain?.name ?? ""}
          >
            <DomainGlyph id={focus.domain} />
          </div>
          <div className="domain-meta">
            <div className="domain-name">
              {domain?.name}
              {domain?.streakLabel && (
                <span className="streak">{domain.streakLabel}</span>
              )}
            </div>
            <div className="domain-sub">
              {live || paused ? (
                <>
                  {focus.step
                    ? `Step ${(focus.step.current ?? 0) + 1} of ${focus.step.items.length}`
                    : domain?.name}
                </>
              ) : focus.step ? (
                `Step ${(focus.step.current ?? 0) + 1} of ${focus.step.items.length} today`
              ) : anyMomentum ? (
                `adjusted ${(focus.adjustedMin ?? 0) > 0 ? "+" : ""}${focus.adjustedMin ?? 0} min`
              ) : (
                `${blockMin} min planned`
              )}
            </div>
          </div>
          {live && (
            <div className="live-pill">
              <span className="ldot" /> Live
            </div>
          )}
        </div>

        {live || paused ? (
          <>
            <div
              className="task-title"
              style={{ fontSize: 22, marginBottom: 14 }}
            >
              {focus.title}
            </div>
            <div className="timer-block">
              <div className="timer">
                {formatTimer(remaining).main}
                <span className="ms">:{formatTimer(remaining).ms}</span>
              </div>
              <div className="timer-sub">
                of {blockMin} min · <b>{pctDone}%</b> done
              </div>
            </div>
            <div className="progress">
              <span style={{ width: `${pctDone}%` }} />
            </div>

            {/* 5-min prayer warning: show option pair above primary CTA */}
            {prayerWarning && (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <button
                  onClick={() => pause(focus.id)}
                  style={{
                    flex: 1,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "11px 12px",
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background:
                      "linear-gradient(180deg,#E0F2E5 0%, #CCE6D4 100%)",
                    color: "#1F3A2A",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(47,90,62,0.16), 0 1px 2px rgba(47,90,62,0.06)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={13}
                    height={13}
                    fill="none"
                    stroke="#1F3A2A"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16.5 14.5a6.5 6.5 0 11-7-9.5 5.5 5.5 0 007 9.5z" />
                  </svg>
                  Pause for prayer
                </button>
                <button
                  type="button"
                  aria-label="Keep going — dismiss prayer warning and continue"
                  style={{
                    flex: 1,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "11px 12px",
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.012em",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background: "#fff",
                    color: "var(--ink-2,#1C1C1E)",
                    boxShadow:
                      "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10)), 0 1px 1px rgba(20,20,30,0.03)",
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
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                  Keep going
                </button>
              </div>
            )}

            <button className="cta" onClick={onPrimary}>
              {live ? (
                <>
                  <span className="pause">
                    <i />
                    <i />
                  </span>
                  Pause
                  <span className="dur">· hold time</span>
                </>
              ) : (
                <>
                  <span className="play">
                    <svg viewBox="0 0 12 12" width="8" height="8">
                      <path d="M2 1.5v9l8-4.5z" fill="#fff" />
                    </svg>
                  </span>
                  Resume
                  <span className="dur">· {remainingMin} min left</span>
                </>
              )}
            </button>
            <div className="secondary-actions">
              <button
                className="sec-btn green"
                onClick={() => finish(focus.id)}
              >
                <CheckSvg stroke="#248A3D" weight={2.6} size={13} />
                Done early
              </button>
              <TimeSlider onCommit={(min) => extend(focus.id, min)} />
            </div>
          </>
        ) : (
          <>
            <div className="task-title">{focus.title}</div>
            <div className="meta-row">
              <span className="chip">
                <ClockSvg />
                {blockMin} min
              </span>
              {focus.step && (
                <span className="chip step">
                  <CheckSvg size={12} />
                  Step {(focus.step.current ?? 0) + 1} of{" "}
                  {focus.step.items.length}
                </span>
              )}
              {anyMomentum && !focus.step && (
                <span className="chip">
                  adjusted {(focus.adjustedMin ?? 0) > 0 ? "+" : ""}
                  {focus.adjustedMin ?? 0}m
                </span>
              )}
            </div>
            <button className="cta" onClick={onPrimary}>
              <span className="play">
                <svg viewBox="0 0 12 12" width="8" height="8">
                  <path d="M2 1.5v9l8-4.5z" fill="#fff" />
                </svg>
              </span>
              Start
              <span className="dur">· {blockMin} min</span>
            </button>
          </>
        )}
      </div>

      {next && (
        <div className="then-wrap">
          <div className="then-head">
            <div className="then-title">
              Then <span className="when">· after this</span>
            </div>
            <div className="then-count">
              <b>{nextCount(blocks, focus.id)}</b> more today
            </div>
          </div>
          <div className="then-stack">
            <div className="peek p2" />
            <div className="peek p1" />
            <div className="then-row">
              <div className={`ddisc ${next.domain} sm`}>
                <DomainGlyph id={next.domain} />
              </div>
              <div className="text">
                <div className="domain-tag">{nextDomain?.name}</div>
                <div className="name">{next.title}</div>
              </div>
              <div className="when-pill">
                <ClockSvg stroke="#6E6E73" size={10} />
                {next.durationMin} min
              </div>
            </div>
          </div>
        </div>
      )}

      {/* + thought pill */}
      <button
        onClick={() => setShowBrainDump(true)}
        style={{
          position: "fixed",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 16px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.82)",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--label-2,#6E6E73)",
          letterSpacing: "-0.008em",
          backdropFilter: "saturate(180%) blur(14px)",
          WebkitBackdropFilter: "saturate(180%) blur(14px)",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.10), 0 1px 2px rgba(20,20,30,0.06), 0 4px 12px -4px rgba(20,20,30,0.08)",
          zIndex: 10,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={12}
          height={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        thought
      </button>

      {showBrainDump && (
        <BrainDumpSheet onClose={() => setShowBrainDump(false)} />
      )}
    </>
  );
}

function TimeSlider({ onCommit }: { onCommit: (min: number) => void }) {
  const [draft, setDraft] = useState(0);
  const [active, setActive] = useState(false);

  const label = draft === 0 ? "±0m" : draft > 0 ? `+${draft}m` : `${draft}m`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(Number(e.target.value));
  };

  const handleCommit = () => {
    if (draft !== 0) {
      onCommit(draft);
      setDraft(0);
    }
    setActive(false);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        padding: "8px 10px",
        borderRadius: 14,
        background: active
          ? "var(--inset,#EBEBF0)"
          : "var(--surface,rgba(255,255,255,0.60))",
        boxShadow:
          "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.12)), 0 1px 2px rgba(20,20,30,0.04)",
        cursor: "pointer",
        transition: "background 0.15s",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color:
            draft === 0
              ? "var(--label,#8E8E93)"
              : draft > 0
                ? "#248A3D"
                : "#FF3B30",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {label}
      </span>
      <input
        type="range"
        min={-30}
        max={60}
        step={5}
        value={draft}
        onChange={handleChange}
        onMouseDown={() => setActive(true)}
        onTouchStart={() => setActive(true)}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        style={{
          width: "100%",
          accentColor: draft < 0 ? "#FF3B30" : "#248A3D",
          cursor: "pointer",
          margin: 0,
        }}
        aria-label="Adjust block time"
      />
    </div>
  );
}

function formatTimer(ms: number): { main: string; ms: string } {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return { main: m.toString(), ms: s.toString().padStart(2, "0") };
}

function nextCount(
  blocks: ReturnType<typeof useDoIt.getState>["blocks"],
  currentId: string,
): number {
  return blocks.filter((b) => b.id !== currentId && b.status !== "done").length;
}
