"use client";

import { useEffect, useState } from "react";
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
import { DomainGlyph, ClockSvg, CheckSvg, PlusSvg } from "@/components/icons";

export default function NowPage() {
  const { blocks, domains, start, pause, resume, finish, extend } = useDoIt();
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const focus = pickFocus(blocks);
  const next = focus ? nextBlock(blocks, focus.id) : null;
  const nextDomain = next ? domains.find((d) => d.id === next.domainId) : null;
  const domain = focus ? domains.find((d) => d.id === focus.domainId) : null;
  const remaining = focus ? remainingMs(focus, now) : 0;
  const totalMs = focus
    ? (focus.durationMin + (focus.adjustedMin ?? 0)) * 60_000
    : 0;
  const elapsed = focus ? totalMs - remaining : 0;
  const pctDone =
    totalMs > 0 ? Math.min(100, Math.round((elapsed / totalMs) * 100)) : 0;
  const live = focus?.status === "active";
  const paused = focus?.status === "paused";

  if (!focus) {
    return (
      <>
        <Topbar name="Done for today" sub="rest" />
        <PrayerBanner />
        <div className="hero">
          <div className="task-title" style={{ marginBottom: 8 }}>
            That&apos;s it for today.
          </div>
          <div className="domain-sub" style={{ marginBottom: 16 }}>
            Calm execution. Tomorrow, again.
          </div>
        </div>
      </>
    );
  }

  const onPrimary = () => {
    if (focus.status === "idle") start(focus.id);
    else if (focus.status === "active") pause(focus.id);
    else if (focus.status === "paused") resume(focus.id);
  };

  const remainingMin = Math.ceil(remaining / 60_000);
  const blockMin = focus.durationMin + (focus.adjustedMin ?? 0);
  const anyMomentum = !!focus.adjustedMin;

  // Topbar props — paused state uses compact single-line treatment
  const topbarName = live ? "In flow" : paused ? "Paused" : "Morning, Adam";
  const topbarSub = live
    ? "stay with it"
    : paused
      ? "ready when you are"
      : "let's start";

  return (
    <>
      <Topbar name={topbarName} sub={topbarSub} live={live} />
      <PrayerBanner />

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
            className={`ddisc ${focus.domainId}`}
            aria-label={domain?.name ?? ""}
          >
            <DomainGlyph id={focus.domainId} />
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
                    ? `Step ${focus.step.current} of ${focus.step.total}`
                    : domain?.name}
                  {focus.focusType && ` · ${focus.focusType}`}
                </>
              ) : focus.step ? (
                `Step ${focus.step.current} of ${focus.step.total} today`
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
              <button className="sec-btn" onClick={() => extend(focus.id, 15)}>
                <PlusSvg size={13} />
                +15 min
              </button>
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
                  Step {focus.step.current} of {focus.step.total}
                </span>
              )}
              {focus.focusType && (
                <span className="chip">
                  <span className="focus-tag">{focus.focusType}</span>
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
              <div className={`ddisc ${next.domainId} sm`}>
                <DomainGlyph id={next.domainId} />
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
    </>
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
