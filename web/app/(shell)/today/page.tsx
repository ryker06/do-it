"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph, CrescentSvg } from "@/components/icons";
import BlockSheet from "@/components/BlockSheet";
import BlockCreateSheet from "@/components/BlockCreateSheet";
import type { Anchor, Block } from "@/lib/types";

const PRAYER_CACHE_KEY = "do-it-prayer-cache-v1";
const DAY_START_HHMM = "06:00";

function readAllAnchorsFromCache(): Anchor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRAYER_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { date: string; anchors: Anchor[] };
    if (parsed.date !== new Date().toDateString()) return [];
    return parsed.anchors;
  } catch {
    return [];
  }
}

function hhmmToMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minToHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Compute projected start time (minutes from midnight) for each block id */
function computeProjectedStarts(
  orderedBlocks: Block[],
  anchors: Anchor[],
): Map<string, number> {
  const prayerMins = anchors.map((a) => hhmmToMin(a.hhmm));
  const PRAYER_WINDOW = 5; // skip 5 min around each prayer
  const result = new Map<string, number>();

  let cursor = hhmmToMin(DAY_START_HHMM);

  for (const b of orderedBlocks) {
    if (b.status === "done") {
      // done blocks don't matter for projection but we still slot them
      result.set(b.id, cursor);
      cursor += b.durationMin + (b.adjustedMin ?? 0);
      continue;
    }
    // Bump cursor past any prayer window
    for (const pm of prayerMins) {
      if (cursor >= pm - PRAYER_WINDOW && cursor < pm + PRAYER_WINDOW) {
        cursor = pm + PRAYER_WINDOW;
      }
    }
    result.set(b.id, cursor);
    cursor += b.durationMin + (b.adjustedMin ?? 0);
  }

  return result;
}

// ── Sortable row ──────────────────────────────────────────────────────────────

interface SortableRowProps {
  block: Block;
  projectedStart: number | undefined;
  domainName: string | undefined;
  isFirstIdle: boolean;
  onTap: (b: Block) => void;
  onResume: (id: string) => void;
}

function SortableRow({
  block: b,
  projectedStart,
  domainName,
  isFirstIdle,
  onTap,
  onResume,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: b.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const status = b.status;
  const cls =
    status === "done"
      ? "done"
      : status === "active" || status === "paused"
        ? "flow"
        : "";

  const timeLabel =
    projectedStart !== undefined ? minToHHMM(projectedStart) : null;

  return (
    <div ref={setNodeRef} style={style} className={`tl-block ${cls}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Projected time label */}
        <div
          style={{
            width: 42,
            flexShrink: 0,
            fontSize: 10,
            fontWeight: 600,
            color: "var(--label,#8E8E93)",
            letterSpacing: "0.01em",
            textAlign: "right",
            paddingRight: 7,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {timeLabel}
        </div>

        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          style={{
            width: 24,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: isDragging ? "grabbing" : "grab",
            padding: 0,
            flexShrink: 0,
            touchAction: "none",
            color: "var(--label,#8E8E93)",
          }}
          aria-label="Drag to reorder"
        >
          <svg
            viewBox="0 0 14 18"
            width={9}
            height={12}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <line x1="2" y1="4" x2="12" y2="4" />
            <line x1="2" y1="9" x2="12" y2="9" />
            <line x1="2" y1="14" x2="12" y2="14" />
          </svg>
        </button>

        {/* Block content — tap area */}
        {status === "pending" ? (
          <button
            onClick={() => onTap(b)}
            className={`row ${cls}`}
            style={{
              flex: 1,
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
                {domainName}
                <span className="sep">·</span>
                {b.durationMin + (b.adjustedMin ?? 0)} min
              </div>
            </div>
            {b.adjustedMin && (
              <span className="pill adj">+{b.adjustedMin}m</span>
            )}
            {!b.adjustedMin && isFirstIdle && (
              <span className="pill up-next">Up next</span>
            )}
            {!b.adjustedMin && !isFirstIdle && (
              <span className="pill later">Later</span>
            )}
          </button>
        ) : (
          <Link
            href="/now"
            onClick={() => {
              if (status === "paused") onResume(b.id);
            }}
            className={`row ${cls}`}
            style={{ flex: 1 }}
          >
            <div className={`ddisc ${b.domain} row`}>
              <DomainGlyph id={b.domain} />
            </div>
            <div className="text">
              <div className="title">{b.title}</div>
              <div className="meta">
                {domainName}
                <span className="sep">·</span>
                {b.durationMin + (b.adjustedMin ?? 0)} min
              </div>
            </div>
            {status === "done" && <span className="pill done">Done</span>}
            {status === "active" && (
              <span className="pill flow">
                <span className="ldot" />
                In flow
              </span>
            )}
            {status === "paused" && <span className="pill flow">Paused</span>}
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
}

// ── MorningBrief overlay — modal-centered per morning-brief-v2.html ──────────

function MorningBriefOverlay({ onDone }: { onDone: () => void }) {
  const { addMorningBrief, blocks } = useDoIt();
  const [friction, setFriction] = useState("");
  const [resumePlan, setResumePlan] = useState("");
  const todayISO = new Date().toISOString().slice(0, 10);
  const blockCount = blocks.filter(
    (b) => b.scheduledFor === "today" && b.status !== "done",
  ).length;

  function handleSave() {
    if (!friction.trim() && !resumePlan.trim()) {
      onDone();
      return;
    }
    addMorningBrief({
      dateISO: todayISO,
      friction: friction.trim(),
      resumePlan: resumePlan.trim(),
    });
    onDone();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(20,20,30,0.42)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "120px 20px 0",
      }}
    >
      {/* modal card — centered */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          borderRadius: 24,
          boxShadow:
            "0 0 0 0.5px rgba(0,0,0,0.06), 0 32px 64px -20px rgba(20,20,30,0.40)",
          padding: "22px 22px 18px",
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--label,#8E8E93)",
            marginBottom: 6,
          }}
        >
          morning brief
        </div>
        {/* heading */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "var(--ink,#000)",
            marginBottom: 6,
          }}
        >
          {blockCount > 0 ? `${blockCount} blocks today.` : "today."}
          <br />
          where could it bend?
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--label-2,#6E6E73)",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            marginBottom: 18,
            lineHeight: 1.4,
          }}
        >
          two prompts. answer plain. shapes the rest.
        </div>

        {/* Q1 */}
        <div
          style={{
            marginBottom: 14,
            padding: "14px 14px 12px",
            background: "var(--inset,#F2F2F7)",
            borderRadius: 16,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.012em",
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            what&apos;s likely to push back today?
          </div>
          <textarea
            value={friction}
            onChange={(e) => setFriction(e.target.value)}
            placeholder="the 2pm calls might run long..."
            rows={2}
            style={{
              width: "100%",
              background: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              color: "var(--ink,#000)",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              letterSpacing: "-0.005em",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
              lineHeight: 1.45,
            }}
          />
        </div>

        {/* Q2 */}
        <div
          style={{
            marginBottom: 14,
            padding: "14px 14px 12px",
            background: "var(--inset,#F2F2F7)",
            borderRadius: 16,
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "var(--ink,#000)",
              letterSpacing: "-0.012em",
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            if it breaks down, you resume by ___.
          </div>
          <textarea
            value={resumePlan}
            onChange={(e) => setResumePlan(e.target.value)}
            placeholder="walking · 5 min · then back to the brief."
            rows={2}
            style={{
              width: "100%",
              background: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 14,
              color: "var(--ink,#000)",
              fontFamily: "inherit",
              resize: "none",
              outline: "none",
              letterSpacing: "-0.005em",
              boxShadow:
                "inset 0 0 0 0.5px var(--hairline,rgba(60,60,67,0.10))",
              lineHeight: 1.45,
            }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
            color: "#fff",
            fontSize: 14.5,
            fontWeight: 600,
            letterSpacing: "-0.014em",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 0.5px rgba(0,0,0,0.5), 0 12px 24px -14px rgba(10,10,20,0.45)",
          }}
        >
          good. start today.
        </button>
        <button
          onClick={onDone}
          style={{
            display: "block",
            margin: "10px auto 0",
            background: "transparent",
            border: "none",
            color: "var(--label,#8E8E93)",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          skip this morning
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const { blocks, domains, resume, reorderBlocks, morningBriefs } = useDoIt();
  const [anchors, setAnchors] = useState<Anchor[]>(() =>
    readAllAnchorsFromCache(),
  );
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Show morning brief overlay if none exists for today
  const todayISO = new Date().toISOString().slice(0, 10);
  const hasBriefToday = morningBriefs.some((b) => b.dateISO === todayISO);
  const [briefDismissed, setBriefDismissed] = useState(false);
  const showBrief = !hasBriefToday && !briefDismissed;

  // Local ordering state for optimistic drag-and-drop
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    [...blocks].sort((a, b) => a.order - b.order).map((b) => b.id),
  );

  // Sync orderedIds if blocks changes externally (new block created, etc.)
  useEffect(() => {
    const fromStore = [...blocks]
      .sort((a, b) => a.order - b.order)
      .map((b) => b.id);
    setOrderedIds((prev) => {
      // Merge: keep prev order for existing ids, append new ids at end
      const prevSet = new Set(prev);
      const newIds = fromStore.filter((id) => !prevSet.has(id));
      const stillValid = prev.filter((id) => fromStore.includes(id));
      return [...stillValid, ...newIds];
    });
  }, [blocks]);

  useEffect(() => {
    if (anchors.length > 0) return;
    import("@/lib/prayers").then(({ fetchTodayPrayers }) => {
      fetchTodayPrayers().then((fresh) => {
        if (fresh.length > 0) {
          try {
            localStorage.setItem(
              PRAYER_CACHE_KEY,
              JSON.stringify({
                date: new Date().toDateString(),
                anchors: fresh,
              }),
            );
          } catch {
            // silent
          }
          setAnchors(fresh);
        }
      });
    });
  }, [anchors.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setOrderedIds((prev) => {
        const oldIdx = prev.indexOf(String(active.id));
        const newIdx = prev.indexOf(String(over.id));
        const next = arrayMove(prev, oldIdx, newIdx);
        reorderBlocks(next);
        return next;
      });
    },
    [reorderBlocks],
  );

  // Build ordered block list from orderedIds
  const blockMap = new Map(blocks.map((b) => [b.id, b]));
  const sorted = orderedIds
    .map((id) => blockMap.get(id))
    .filter((b): b is Block => b !== undefined);

  const totalMin = sorted.reduce(
    (acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0),
    0,
  );
  const doneMin = sorted
    .filter((b) => b.status === "done")
    .reduce((acc, b) => acc + b.durationMin + (b.adjustedMin ?? 0), 0);
  const aheadMin = totalMin - doneMin;
  const pct = totalMin > 0 ? Math.round((doneMin / totalMin) * 100) : 0;

  const firstIdleIdx = sorted.findIndex((b) => b.status === "pending");

  // Dhuhr for anchor display
  const dhuhr = anchors.find((a) => a.label.toLowerCase() === "dhuhr");
  const anchorPos = 2; // insert anchor after 2nd block

  // Projected start times
  const projectedStarts = computeProjectedStarts(sorted, anchors);

  // Empty state
  if (sorted.length === 0) {
    return (
      <>
        <Topbar name="today." sub="nothing yet · add a block." />
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
          />
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
          </div>
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
              Add a block
            </button>
          </div>
        </div>
        {showCreate && (
          <BlockCreateSheet onClose={() => setShowCreate(false)} />
        )}
        {showBrief && (
          <MorningBriefOverlay onDone={() => setBriefDismissed(true)} />
        )}
      </>
    );
  }

  return (
    <>
      <Topbar name="today." sub={`${sorted.length} blocks ready.`} />
      {showBrief && (
        <MorningBriefOverlay onDone={() => setBriefDismissed(true)} />
      )}

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedIds}
              strategy={verticalListSortingStrategy}
            >
              {sorted.map((b, idx) => {
                const d = domains.find((x) => x.id === b.domain);
                return (
                  <div key={b.id}>
                    {idx === anchorPos && (
                      <div className="tl-block anchor">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Time spacer for anchor */}
                          <div style={{ width: 42, flexShrink: 0 }} />
                          {/* Handle spacer */}
                          <div style={{ width: 24, flexShrink: 0 }} />
                          <div className="row anchor" style={{ flex: 1 }}>
                            <div className="ddisc religion sm">
                              <CrescentSvg size={16} />
                            </div>
                            <div className="text">
                              <div
                                className="title"
                                style={{ color: "#1F3A2A" }}
                              >
                                {dhuhr
                                  ? `${dhuhr.label} · ${dhuhr.hhmm}`
                                  : "Dhuhr · loading"}
                              </div>
                            </div>
                            <span className="pill anchor">Anchor</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <SortableRow
                      block={b}
                      projectedStart={projectedStarts.get(b.id)}
                      domainName={d?.name}
                      isFirstIdle={idx === firstIdleIdx}
                      onTap={setSelectedBlock}
                      onResume={resume}
                    />
                  </div>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* + Add block FAB */}
      <button
        onClick={() => setShowCreate(true)}
        style={{
          position: "fixed",
          bottom: 156,
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
