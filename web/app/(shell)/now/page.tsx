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
  const { blocks, domains, start, pause, resume, finish, extend, advanceStep } =
    useDoIt();
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

  const nowDate = new Date(now);
  const prayerWarning = anchors
    ? anchors
        .map((a) => ({ a, mins: minsUntilHHMM(a.hhmm, nowDate) }))
        .find((x) => x.mins >= 0 && x.mins <= 5)
    : null;
  const prayerNow = anchors
    ? anchors
        .map((a) => ({ a, mins: minsUntilHHMM(a.hhmm, nowDate) }))
        .find((x) => x.mins >= -10 && x.mins <= 0)
    : null;

  // ── Day complete ──
  if (!focus) {
    const doneBlocks = blocks.filter((b) => b.status === "done");
    const totalDoneMin = doneBlocks.reduce(
      (acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0),
      0,
    );
    const hh = Math.floor(totalDoneMin / 60);
    const mm = totalDoneMin % 60;

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Topbar name="adam." sub="that's the day." />

        {/* centered hero for day-complete */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 0 80px",
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.05em",
              lineHeight: 0.96,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            that&apos;s it
            <br />
            <span style={{ color: "var(--label,#8E8E93)", fontWeight: 600 }}>
              for today.
            </span>
          </div>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
              textAlign: "center",
              marginBottom: 36,
            }}
          >
            <b style={{ color: "var(--ink-2,#1C1C1E)", fontWeight: 700 }}>
              {doneBlocks.length} block{doneBlocks.length !== 1 ? "s" : ""}.
            </b>{" "}
            {hh > 0 ? `${hh}h ${mm}m` : `${mm}m`}. calm execution.
          </div>

          {doneBlocks.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: -8,
                marginBottom: 40,
              }}
            >
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
                        "0 0 0 2px #fff, inset 0 0 0 0.5px rgba(20,20,30,0.06)",
                    }}
                  >
                    <DomainGlyph id={id} size={17} />
                  </div>
                ),
              )}
            </div>
          )}

          <button
            className="cta"
            style={{ fontFamily: "inherit", maxWidth: 340, width: "100%" }}
            onClick={() => router.push("/today")}
          >
            preview tomorrow
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
        </div>

        {showBrainDump && (
          <BrainDumpSheet onClose={() => setShowBrainDump(false)} />
        )}
      </div>
    );
  }

  // ── Prayer-now state ──
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
              "radial-gradient(120% 80% at 50% -10%, rgba(47,90,62,0.10) 0%, rgba(47,90,62,0.03) 35%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <Topbar name="a moment" sub="for prayer." />

        <div
          className="hero"
          style={{
            background: "linear-gradient(180deg, #F0F8F2 0%, #E2F0E6 100%)",
            boxShadow:
              "0 0 0 0.5px rgba(47,90,62,0.10), 0 12px 28px -14px rgba(47,90,62,0.16)",
          }}
        >
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
            in prayer
            <span style={{ color: "#5E8A6E", fontWeight: 500 }}>· no rush</span>
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
            pray when you&apos;re ready. the day waits with you.
          </div>

          <button
            onClick={() => finish(focus.id)}
            className="cta"
            style={{
              background: "linear-gradient(180deg, #2E7B5E 0%, #1F5A45 100%)",
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
            marked prayed
          </button>

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
            }}
          >
            {focus.title} paused at{" "}
            <b style={{ color: "#1F3A2A", fontWeight: 700, marginLeft: 3 }}>
              {pausedTimeStr}
            </b>
            <span
              style={{ marginLeft: "auto", fontSize: 11.5, color: "#5E8A6E" }}
            >
              · resume after
            </span>
          </div>
        </div>

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

  const topbarName = live ? "in flow." : paused ? "paused." : "adam.";
  const topbarSub = live
    ? "stay with it."
    : paused
      ? "ready when you are."
      : "ready when you are.";

  // ── Main NOW state ──
  return (
    <>
      <Topbar name={topbarName} sub={topbarSub} live={live} />

      {/* 5-min prayer warning banner */}
      {prayerWarning && !prayerNow && (
        <div
          className="prayer warn"
          style={{
            background: "linear-gradient(180deg, #E2F2E8 0%, #CFE7D9 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(47,90,62,0.16)",
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
            <div className="hint">pause when you&apos;re ready</div>
          </div>
          <div className="count pulse">in {prayerWarning.mins} min</div>
        </div>
      )}

      {!prayerWarning && <PrayerBanner />}

      {/* ── HERO focal card ── */}
      <div className="hero">
        {/* dot-noise texture overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1.2px)",
            backgroundSize: "13px 13px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* embedded flame illustration — bottom-right */}
        {!live && !paused && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 18,
              right: 18,
              width: 110,
              height: 110,
              transform: "rotate(-8deg)",
              filter: "drop-shadow(0 8px 18px rgba(255,80,60,0.18))",
              pointerEvents: "none",
              zIndex: 0,
              opacity: 0.72,
            }}
          >
            <svg
              viewBox="0 0 110 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="110"
              height="110"
            >
              <defs>
                <linearGradient
                  id="flameGrad"
                  x1="55"
                  y1="10"
                  x2="55"
                  y2="100"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#C7F0CF" />
                  <stop offset="100%" stopColor="#FFD9E0" />
                </linearGradient>
              </defs>
              {/* outer teardrop */}
              <path
                d="M55 10 C55 10 25 42 25 65 C25 82 38.5 97 55 97 C71.5 97 85 82 85 65 C85 42 55 10 55 10Z"
                fill="url(#flameGrad)"
                opacity="0.9"
              />
              {/* inner core */}
              <path
                d="M55 38 C55 38 40 56 40 68 C40 77 47 84 55 84 C63 84 70 77 70 68 C70 56 55 38 55 38Z"
                fill="white"
                opacity="0.55"
              />
            </svg>
          </div>
        )}

        {/* eyebrow */}
        <div
          className={`card-eyebrow${live ? " live" : ""}`}
          style={{ position: "relative", zIndex: 1 }}
        >
          <span className="pip" />
          {live ? "now in flow" : paused ? "on hold" : "up next"}
          <span className="at">
            ·{" "}
            {live
              ? "stay with it"
              : paused
                ? "pick up when ready"
                : "in a moment"}
          </span>
        </div>

        {/* domain badge row */}
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
                    ? `step ${(focus.step.current ?? 0) + 1} of ${focus.step.items.length}`
                    : domain?.name}
                </>
              ) : focus.step ? (
                `step ${(focus.step.current ?? 0) + 1} of ${focus.step.items.length} today`
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

        {/* Title — MASSIVE */}
        <div
          className="task-title"
          style={live || paused ? { fontSize: 28, marginBottom: 10 } : {}}
        >
          {focus.title}
        </div>

        {/* Intention line — idle state only */}
        {!live && !paused && focus.intention && (
          <div className="intention">
            <span className="lbl">intention</span>
            {focus.intention}
          </div>
        )}

        {/* Step card */}
        {focus.step && (
          <StepCard
            step={focus.step}
            onAdvance={() => advanceStep(focus.id)}
            onComplete={() => finish(focus.id)}
          />
        )}

        {/* Active/Paused: timer */}
        {(live || paused) && (
          <>
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

            {/* Prayer 5-min option pair */}
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background:
                      "linear-gradient(180deg,#E0F2E5 0%,#CCE6D4 100%)",
                    color: "#1F3A2A",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 0.5px rgba(47,90,62,0.16)",
                  }}
                >
                  pause for prayer
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: "11px 12px",
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    background: "#fff",
                    color: "var(--ink-2,#1C1C1E)",
                    boxShadow:
                      "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
                  }}
                >
                  keep going
                </button>
              </div>
            )}

            <button
              className="cta"
              onClick={onPrimary}
              style={{ fontFamily: "inherit" }}
            >
              {live ? (
                <>
                  <span className="pause">
                    <i />
                    <i />
                  </span>
                  pause
                  <span className="dur">· hold time</span>
                </>
              ) : (
                <>
                  <span className="play">
                    <svg viewBox="0 0 12 12" width="8" height="8">
                      <path d="M2 1.5v9l8-4.5z" fill="#fff" />
                    </svg>
                  </span>
                  resume
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
                done early
              </button>
              <TimeSlider onCommit={(min) => extend(focus.id, min)} />
            </div>
          </>
        )}

        {/* Idle state CTA */}
        {!live && !paused && (
          <>
            <div className="meta-row">
              <span className="chip">
                <ClockSvg />
                {blockMin} min
              </span>
              {focus.step && (
                <span className="chip step">
                  <CheckSvg size={12} />
                  step {(focus.step.current ?? 0) + 1} of{" "}
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
            <button
              className="cta"
              onClick={onPrimary}
              style={{ fontFamily: "inherit" }}
            >
              <span className="play">
                <svg viewBox="0 0 12 12" width="8" height="8">
                  <path d="M2 1.5v9l8-4.5z" fill="#fff" />
                </svg>
              </span>
              start
              <span className="dur">· {blockMin} min</span>
            </button>
          </>
        )}
      </div>

      {/* "shift forward" — subtle text link below the card */}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <button
          onClick={() => finish(focus.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--label,#8E8E93)",
            fontSize: 12.5,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            fontFamily: "inherit",
            cursor: "pointer",
            padding: "6px 12px",
          }}
        >
          shift forward
        </button>
      </div>

      {/* Then — next block preview */}
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

      {showBrainDump && (
        <BrainDumpSheet onClose={() => setShowBrainDump(false)} />
      )}
    </>
  );
}

// ── StepCard ──────────────────────────────────────────────────────────────────

function StepCard({
  step,
  onAdvance,
  onComplete,
}: {
  step: { kind: string; items: string[]; current?: number };
  onAdvance: () => void;
  onComplete: () => void;
}) {
  const current = step.current ?? 0;
  const total = step.items.length;
  const currentItem = step.items[current] ?? "";
  const isLast = current >= total - 1;

  return (
    <div
      style={{
        background: "var(--inset,#F2F2F7)",
        borderRadius: 18,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 14,
        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
      }}
    >
      {/* step number disc */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--ink,#000)",
          boxShadow:
            "0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10)), 0 1px 2px rgba(20,20,30,0.04)",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {current + 1}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--label,#8E8E93)",
          }}
        >
          {isLast ? "last step" : "next step"}
        </div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--ink,#000)",
            letterSpacing: "-0.012em",
          }}
        >
          {currentItem}
        </div>
      </div>
      <button
        onClick={isLast ? onComplete : onAdvance}
        style={{
          flexShrink: 0,
          background: isLast
            ? "linear-gradient(180deg,#2E7B5E 0%,#1F5A45 100%)"
            : "#fff",
          color: isLast ? "#fff" : "var(--green-deep,#248A3D)",
          border: "none",
          borderRadius: 10,
          padding: "7px 12px",
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          boxShadow: isLast
            ? "0 6px 14px -8px rgba(31,90,68,0.35)"
            : "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
        }}
      >
        {isLast ? (
          <>
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill="none"
              stroke="#fff"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l4 4L19 6" />
            </svg>
            complete
          </>
        ) : (
          <>
            done · next
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
          </>
        )}
      </button>
    </div>
  );
}

// ── TimeSlider ────────────────────────────────────────────────────────────────

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
        background: active ? "var(--inset,#F2F2F7)" : "rgba(255,255,255,0.60)",
        boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.12)",
        cursor: "pointer",
        transition: "background 0.15s",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
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
