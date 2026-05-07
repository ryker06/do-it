"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph } from "@/components/icons";
import { CoverImagePickerTrigger } from "@/components/CoverImagePicker";
import RightDrawer from "@/components/RightDrawer";
import { svgById } from "@/lib/svgLibrary";
import type { DomainId, CoverImage, Vision, Goal } from "@/lib/types";

const DOMAIN_ORDER: DomainId[] = [
  "fitness",
  "business",
  "religion",
  "learning",
  "home",
  "food",
];

const DOMAIN_SVG_ID: Record<DomainId, string> = {
  fitness: "dumbbell",
  business: "bolt",
  religion: "moon",
  learning: "book",
  home: "leaf",
  food: "drop",
};

const DOMAIN_TINT: Record<DomainId, string> = {
  fitness: "var(--d-fitness,#FFD0DA)",
  business: "var(--d-business,#E2EEFF)",
  religion: "var(--d-religion,#E2F4E6)",
  learning: "var(--d-learning,#FFE0E8)",
  home: "var(--d-home,#EAEFF3)",
  food: "var(--d-food,#FFF0DD)",
};

function CoverDisplay({
  cover,
  domainId,
}: {
  cover: CoverImage | undefined;
  domainId: DomainId;
}) {
  if (!cover) {
    const svgStr = svgById(DOMAIN_SVG_ID[domainId]);
    return (
      <div
        style={{
          width: "100%",
          height: 110,
          borderRadius: "16px 16px 0 0",
          background: DOMAIN_TINT[domainId],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-3,#3A3A3C)",
          opacity: 0.7,
        }}
      >
        {svgStr && (
          <span
            dangerouslySetInnerHTML={{ __html: svgStr }}
            style={{ width: 36, height: 36, display: "block", opacity: 0.6 }}
          />
        )}
      </div>
    );
  }
  if (cover.kind === "emoji") {
    return (
      <div
        style={{
          width: "100%",
          height: 110,
          borderRadius: "16px 16px 0 0",
          background: DOMAIN_TINT[domainId],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        {cover.value}
      </div>
    );
  }
  if (cover.kind === "svg-id") {
    const svgStr = svgById(cover.value);
    return (
      <div
        style={{
          width: "100%",
          height: 110,
          borderRadius: "16px 16px 0 0",
          background: DOMAIN_TINT[domainId],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-3,#3A3A3C)",
        }}
      >
        {svgStr && (
          <span
            dangerouslySetInnerHTML={{ __html: svgStr }}
            style={{ width: 40, height: 40, display: "block" }}
          />
        )}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover.value}
      alt=""
      style={{
        width: "100%",
        height: 110,
        objectFit: "cover",
        borderRadius: "16px 16px 0 0",
        display: "block",
      }}
    />
  );
}

function deadlineCountdown(deadline: string | undefined): string | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (days < -1) return "moved";
  if (days <= 0) return "today";
  if (days < 7) return `${days}d left`;
  if (days < 60) return `${Math.round(days / 7)} weeks out`;
  return `${Math.round(days / 30)} months out`;
}

// ── Shared vision card content (used in both mobile list + desktop detail pane) ──
function VisionDetail({
  v,
  goals,
  setCoverImage,
}: {
  v: Vision;
  goals: Goal[];
  setCoverImage: (
    kind: "goal" | "vision" | "wishlist" | "habit" | "person" | "routine",
    id: string,
    image: CoverImage | null,
  ) => void;
}) {
  const deadline = deadlineCountdown(v.deadline);
  const vGoals = goals.filter((g) => g.visionId === v.id);

  return (
    <div
      style={{
        position: "relative",
        background: "var(--card,#fff)",
        borderRadius: 24,
        boxShadow:
          "0 0 0 0.5px rgba(60,60,67,0.05),0 8px 22px -14px rgba(20,20,30,0.12)",
        overflow: "hidden",
      }}
    >
      {/* inset highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.95), inset 0 0 0 0.5px rgba(60,60,67,0.06)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      {/* Cover */}
      <div style={{ position: "relative" }}>
        <CoverDisplay cover={v.coverImage} domainId={v.domainId} />
        <div
          style={{ position: "absolute", top: 8, right: 8, zIndex: 3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CoverImagePickerTrigger
            context="vision"
            current={v.coverImage}
            onConfirm={(img) => setCoverImage("vision", v.id, img)}
          />
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "14px 18px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--ink,#000)",
              flex: 1,
            }}
          >
            {v.identity ?? v.title}
          </div>
          {deadline && (
            <div
              style={{
                flexShrink: 0,
                fontSize: 10.5,
                fontWeight: 700,
                color: "var(--label-2,#6E6E73)",
                background: "var(--inset,#F2F2F7)",
                padding: "4px 10px",
                borderRadius: 999,
                boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.08)",
                fontVariantNumeric: "tabular-nums",
                marginTop: 4,
              }}
            >
              {deadline}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 13.5,
            color: "var(--label-2,#6E6E73)",
            fontWeight: 500,
            letterSpacing: "-0.012em",
            lineHeight: 1.4,
            marginBottom: vGoals.length > 0 ? 14 : 0,
          }}
        >
          {v.blurb}
        </div>
        {vGoals.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 12,
              borderTop: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
            }}
          >
            {vGoals.map((g) => {
              const pct = Math.min(
                1,
                g.targetValue > 0 ? g.currentValue / g.targetValue : 0,
              );
              return (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "var(--inset,#F2F2F7)",
                    borderRadius: 14,
                    boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink,#000)",
                      letterSpacing: "-0.012em",
                      flex: 1,
                    }}
                  >
                    {g.identityLine ?? g.unit}
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: 3,
                      background: "var(--inset-2,#EAEAEF)",
                      borderRadius: 999,
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "var(--ink,#000)",
                        position: "absolute",
                        top: -2,
                        left: `calc(${pct * 100}% - 3.5px)`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "var(--label-2,#6E6E73)",
                      fontWeight: 600,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {g.currentValue} / {g.targetValue}
                    {g.unit}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Inner component (reads searchParams) ──
function VisionsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const isDesktop = useIsDesktop();

  const { visions, goals, setCoverImage, createVision } = useDoIt();
  const [createOpen, setCreateOpen] = useState(false);
  const [cTitle, setCTitle] = useState("");
  const [cIdentity, setCIdentity] = useState("");
  const [cBlurb, setCBlurb] = useState("");
  const [cDomain, setCDomain] = useState<DomainId>("business");
  const [cDeadline, setCDeadline] = useState("");

  function handleCreate() {
    if (!cTitle.trim()) return;
    createVision({
      title: cTitle.trim(),
      identity: cIdentity.trim() || cTitle.trim(),
      blurb: cBlurb.trim(),
      domainId: cDomain,
      tint: "#E2EEFF",
      deadline: cDeadline || undefined,
    });
    setCTitle("");
    setCIdentity("");
    setCBlurb("");
    setCDomain("business");
    setCDeadline("");
    setCreateOpen(false);
  }

  const CreateDrawer = (
    <RightDrawer
      open={createOpen}
      onClose={() => setCreateOpen(false)}
      title="new vision"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          autoFocus
          value={cTitle}
          onChange={(e) => setCTitle(e.target.value)}
          placeholder="vision title"
          style={{
            width: "100%",
            fontSize: 15,
            fontWeight: 600,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        <input
          value={cIdentity}
          onChange={(e) => setCIdentity(e.target.value)}
          placeholder="identity line (I am a…)"
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        <textarea
          value={cBlurb}
          onChange={(e) => setCBlurb(e.target.value)}
          placeholder="one sentence on why this matters"
          rows={2}
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            resize: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DOMAIN_ORDER.map((d) => (
            <button
              key={d}
              onClick={() => setCDomain(d)}
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background: cDomain === d ? "#0B0B0F" : "rgba(60,60,67,0.06)",
                color: cDomain === d ? "#fff" : "#8E8E93",
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={cDeadline}
          onChange={(e) => setCDeadline(e.target.value)}
          style={{
            width: "100%",
            fontSize: 14,
            fontWeight: 500,
            color: "#0B0B0F",
            background: "#FBFAF8",
            border: "none",
            outline: "none",
            borderRadius: 12,
            padding: "10px 14px",
            fontFamily: "inherit",
            boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.10)",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleCreate}
          disabled={!cTitle.trim()}
          style={{
            background: cTitle.trim()
              ? "linear-gradient(180deg,#1A1A20,#000)"
              : "#F4F5F7",
            color: cTitle.trim() ? "#fff" : "#8E8E93",
            border: "none",
            borderRadius: 14,
            padding: "13px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: cTitle.trim() ? "pointer" : "default",
          }}
        >
          save vision
        </button>
      </div>
    </RightDrawer>
  );

  // Group by domain
  const byDomain = new Map<DomainId, typeof visions>();
  for (const v of visions) {
    const list = byDomain.get(v.domainId) ?? [];
    list.push(v);
    byDomain.set(v.domainId, list);
  }

  const selectedVision = visions.find((v) => v.id === selectedId) ?? null;

  // ── Add vision button ──
  const addButton = (
    <button
      onClick={() => setCreateOpen(true)}
      style={{
        background: "linear-gradient(180deg,#1A1A20 0%,#000 100%)",
        color: "#fff",
        border: "none",
        borderRadius: 999,
        padding: "9px 16px",
        fontSize: 13,
        fontWeight: 700,
        fontFamily: "inherit",
        cursor: "pointer",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.08) inset,0 0 0 0.5px rgba(0,0,0,0.5),0 18px 38px -18px rgba(10,10,20,0.55)",
        flexShrink: 0,
      }}
    >
      + vision
    </button>
  );

  // ── Vision list (shared between mobile card list + desktop left pane rows) ──
  function VisionListRows({ compact }: { compact: boolean }) {
    return (
      <>
        {DOMAIN_ORDER.map((domId) => {
          const list = byDomain.get(domId);
          if (!list || list.length === 0) return null;
          return (
            <div key={domId}>
              {/* domain label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: compact ? "10px 14px 6px" : "14px 6px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--label,#8E8E93)",
                }}
              >
                <div
                  className={`ddisc ${domId}`}
                  style={{ width: 16, height: 16, flexShrink: 0 }}
                >
                  <DomainGlyph id={domId} size={10} />
                </div>
                {domId}
              </div>

              {list.map((v) => {
                const deadline = deadlineCountdown(v.deadline);
                const isSelected = selectedId === v.id;

                if (compact) {
                  // Desktop compact row
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        router.push(`/visions?selected=${v.id}`, {
                          scroll: false,
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "9px 14px",
                        background: isSelected
                          ? "var(--ink,#0B0B0F)"
                          : "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "background 160ms",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            letterSpacing: "-0.015em",
                            lineHeight: 1.2,
                            color: isSelected ? "#fff" : "var(--ink,#0B0B0F)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v.identity ?? v.title}
                        </div>
                        {v.blurb && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: isSelected
                                ? "rgba(255,255,255,0.6)"
                                : "var(--label-2,#6E6E73)",
                              fontWeight: 500,
                              marginTop: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {v.blurb}
                          </div>
                        )}
                      </div>
                      {deadline && (
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: isSelected
                              ? "rgba(255,255,255,0.55)"
                              : "var(--label,#8E8E93)",
                            flexShrink: 0,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {deadline}
                        </div>
                      )}
                    </button>
                  );
                }

                // Mobile full card
                return (
                  <Link
                    key={v.id}
                    href={`/visions/${v.id}`}
                    style={{
                      textDecoration: "none",
                      display: "block",
                      marginBottom: 14,
                    }}
                  >
                    <VisionDetail
                      v={v}
                      goals={goals}
                      setCoverImage={setCoverImage}
                    />
                  </Link>
                );
              })}
            </div>
          );
        })}
      </>
    );
  }

  if (visions.length === 0) {
    return (
      <>
        <Topbar name="visions." sub="what you're becoming." />
        {CreateDrawer}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
          {addButton}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px 110px",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "var(--ink,#000)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            nothing yet.
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--label-2,#6E6E73)",
              letterSpacing: "-0.012em",
              lineHeight: 1.42,
              textAlign: "center",
            }}
          >
            visions are the big threads that pull you forward.
          </div>
        </div>
      </>
    );
  }

  // ── Desktop master/detail layout ──
  if (isDesktop) {
    return (
      <>
        {CreateDrawer}
        <div className="md-layout">
          {/* LEFT — 360px list pane */}
          <div className="md-list" style={{ width: 360 }}>
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 14px 10px",
                borderBottom: "0.5px solid var(--hairline,rgba(60,60,67,0.10))",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "var(--label,#8E8E93)",
                }}
              >
                {visions.length} vision{visions.length !== 1 ? "s" : ""}
              </span>
              {addButton}
            </div>
            <VisionListRows compact />
          </div>

          {/* RIGHT — detail pane */}
          <div className="md-detail">
            {selectedVision ? (
              <div style={{ padding: "24px 32px 40px", maxWidth: 600 }}>
                <VisionDetail
                  v={selectedVision}
                  goals={goals}
                  setCoverImage={setCoverImage}
                />
              </div>
            ) : (
              <div className="md-empty">
                <span className="md-empty-icon">◎</span>
                <span>select a vision to see the detail</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Mobile single-column layout ──
  return (
    <>
      <Topbar name="visions." sub="what you're becoming." />
      {CreateDrawer}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        {addButton}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          paddingBottom: 110,
        }}
      >
        <VisionListRows compact={false} />
      </div>
    </>
  );
}

export default function VisionsPage() {
  return (
    <Suspense>
      <VisionsInner />
    </Suspense>
  );
}
