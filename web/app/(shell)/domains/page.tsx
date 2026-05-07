"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { CompounderPhrase } from "@/components/CompounderPhrase";
import type { DomainMomentum, DomainId } from "@/lib/types";

const MOMENTUM_WORD: Record<DomainMomentum, string> = {
  warm: "warm.",
  steady: "steady.",
  drifting: "drifting.",
  quiet: "quieter.",
  humming: "humming.",
};

const MOMENTUM_COLOR: Record<DomainMomentum, string> = {
  humming: "#7A2A3C",
  warm: "#1F5C2C",
  steady: "#0050C8",
  drifting: "#6E6E73",
  quiet: "#8E8E93",
};

const DOMAIN_TINT_BG: Record<DomainId, string> = {
  business: "linear-gradient(180deg,#E2EEFF 0%,#C9DBFF 100%)",
  religion: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
  learning: "linear-gradient(180deg,#FFE0E8 0%,#FFC9D6 100%)",
  fitness: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
  home: "linear-gradient(180deg,#EAEFF3 0%,#D4DCE3 100%)",
  food: "linear-gradient(180deg,#FFF0DD 0%,#FFDFB5 100%)",
};

// Domain SVG glyphs (inline)
function DomainSVG({ id, size = 20 }: { id: DomainId; size?: number }) {
  const paths: Record<DomainId, React.ReactNode> = {
    business: (
      <>
        <path d="M3 7h18v12H3z" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    religion: (
      <>
        <path d="M12 2v20M5 9h14" />
      </>
    ),
    learning: (
      <>
        <path d="M4 5h16v14H4z" />
        <path d="M4 9h16" />
      </>
    ),
    fitness: (
      <>
        <path d="M6 9v6" />
        <path d="M18 9v6" />
        <path d="M3 12h18" />
      </>
    ),
    home: (
      <>
        <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" />
      </>
    ),
    food: (
      <>
        <path d="M5 6v6a3 3 0 0 0 6 0V6" />
        <path d="M16 3v18" />
      </>
    ),
  };

  const tints: Record<DomainId, { bg: string; color: string }> = {
    business: {
      bg: "linear-gradient(180deg,#E2EEFF 0%,#C9DBFF 100%)",
      color: "#1748A8",
    },
    religion: {
      bg: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
      color: "#1F5C2C",
    },
    learning: {
      bg: "linear-gradient(180deg,#FFE0E8 0%,#FFC9D6 100%)",
      color: "#7A2A3C",
    },
    fitness: {
      bg: "linear-gradient(180deg,#FFD0DA 0%,#FFB6C5 100%)",
      color: "#7A2A3C",
    },
    home: {
      bg: "linear-gradient(180deg,#EAEFF3 0%,#D4DCE3 100%)",
      color: "#36475A",
    },
    food: {
      bg: "linear-gradient(180deg,#FFF0DD 0%,#FFDFB5 100%)",
      color: "#7A4A1A",
    },
  };

  const t = tints[id];
  return (
    <div
      style={{
        width: size + 22,
        height: size + 22,
        borderRadius: "50%",
        background: t.bg,
        color: t.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow:
          "inset 0 0 0 0.5px rgba(20,20,30,0.06),0 2px 5px rgba(20,20,30,0.06),0 6px 14px -8px rgba(20,20,30,0.12)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        stroke="currentColor"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[id]}
      </svg>
    </div>
  );
}

// 7-day mini bar: 7 cells, each reflecting block density
function WeekBar({
  blocks,
  domainId,
}: {
  blocks: ReturnType<typeof useDoIt.getState>["blocks"];
  domainId: DomainId;
}) {
  const now = Date.now();
  // Build 7 buckets: index 0 = 6 days ago, index 6 = today
  const buckets: number[] = Array(7).fill(0);
  for (const b of blocks) {
    if (b.domain !== domainId) continue;
    if (!b.startedAt) continue;
    const daysAgo = Math.floor((now - b.startedAt) / 86_400_000);
    if (daysAgo >= 0 && daysAgo < 7) {
      buckets[6 - daysAgo]++;
    }
  }

  const cells = buckets.map((count, i) => {
    // intensity 0/1/2/3+
    const opacity =
      count === 0 ? 0.1 : count === 1 ? 0.3 : count === 2 ? 0.6 : 0.9;
    return (
      <div
        key={i}
        style={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          background: "#0B0B0F",
          opacity,
        }}
      />
    );
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        marginTop: 8,
      }}
    >
      {cells}
    </div>
  );
}

// Momentum → grid span
function getMomentumSpan(m: DomainMomentum): {
  colSpan: number;
  rowSpan: number;
} {
  switch (m) {
    case "humming":
      return { colSpan: 2, rowSpan: 2 };
    case "warm":
      return { colSpan: 2, rowSpan: 1 };
    case "steady":
      return { colSpan: 1, rowSpan: 2 };
    default:
      return { colSpan: 1, rowSpan: 1 };
  }
}

function computeBalanceSignal(
  blocks: ReturnType<typeof useDoIt.getState>["blocks"],
): string | null {
  const recent = blocks.filter(
    (b) =>
      b.mode !== undefined &&
      (b.status === "done" || b.scheduledFor === "today"),
  );
  if (recent.length === 0) return null;

  const domainCounts: Record<
    DomainId,
    { theory: number; application: number; feedback: number }
  > = {} as Record<
    DomainId,
    { theory: number; application: number; feedback: number }
  >;

  for (const b of recent) {
    if (!b.mode) continue;
    if (!domainCounts[b.domain]) {
      domainCounts[b.domain] = { theory: 0, application: 0, feedback: 0 };
    }
    domainCounts[b.domain][b.mode]++;
  }

  let worst: { domain: DomainId; ratio: number } | null = null;
  for (const [domainId, counts] of Object.entries(domainCounts) as [
    DomainId,
    { theory: number; application: number; feedback: number },
  ][]) {
    if (counts.theory > 0 && counts.application === 0) {
      const ratio = counts.theory * 3;
      if (!worst || ratio > worst.ratio) worst = { domain: domainId, ratio };
    } else if (counts.theory > 0 && counts.application > 0) {
      const ratio = counts.theory / counts.application;
      if (ratio > 2 && (!worst || ratio > worst.ratio))
        worst = { domain: domainId, ratio };
    }
  }
  if (!worst) return null;

  const DOMAIN_NAMES: Record<DomainId, string> = {
    business: "business",
    religion: "religion",
    learning: "learning",
    fitness: "fitness",
    home: "home",
    food: "food",
  };
  return `heavy on theory in ${DOMAIN_NAMES[worst.domain]}, light on application this week.`;
}

export default function DomainsPage() {
  const { domains, blocks, transactions } = useDoIt();
  const router = useRouter();
  const balanceSignal = computeBalanceSignal(blocks);

  if (domains.length === 0) {
    return (
      <>
        <Topbar name="six lives, one man." sub="domains" />
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
            define your
            <br />
            life areas.
          </div>
        </div>
      </>
    );
  }

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 86_400_000;
  const monthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  return (
    <>
      <Topbar
        name="six lives, one man."
        sub="tap a domain to see what's moving"
      />

      {/* Bento grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {domains.map((d) => {
          const { colSpan, rowSpan } = getMomentumSpan(d.momentum);

          const domainBlocks = blocks.filter(
            (b) =>
              b.domain === d.id &&
              b.startedAt !== undefined &&
              b.startedAt > sevenDaysAgo,
          );

          const domainTx = transactions.filter(
            (t) => t.domain === d.id && t.dateISO.startsWith(monthStr),
          );
          const totalCents = domainTx.reduce(
            (acc, t) =>
              t.kind === "expense" ? acc + t.amountCents : acc - t.amountCents,
            0,
          );
          let moneyStr: string | null = null;
          if (totalCents > 10000) moneyStr = "$ heavy this month";
          else if (totalCents > 2000) moneyStr = "$ steady this month";
          else if (totalCents > 0) moneyStr = "$ light this month";

          // Tile min-height scales with rowSpan
          const minH = rowSpan === 2 ? 180 : 110;

          return (
            <button
              key={d.id}
              onClick={() => router.push(`/domains/${d.id}`)}
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                minHeight: minH,
                background: "#fff",
                borderRadius: 20,
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.10)",
                border: "none",
                cursor: "pointer",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                fontFamily: "inherit",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Domain tint accent strip at top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: DOMAIN_TINT_BG[d.id],
                  borderRadius: "20px 20px 0 0",
                }}
              />

              {/* Glyph */}
              <DomainSVG id={d.id} size={rowSpan === 2 ? 20 : 16} />

              {/* Name + momentum */}
              <div
                style={{
                  marginTop: 8,
                  fontSize: rowSpan === 2 ? 17 : 14,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: "#0B0B0F",
                  lineHeight: 1.1,
                }}
              >
                {d.name}
              </div>
              <div
                style={{
                  fontSize: rowSpan === 2 ? 13 : 11,
                  fontWeight: 700,
                  color: MOMENTUM_COLOR[d.momentum],
                  letterSpacing: "-0.01em",
                  marginTop: 2,
                }}
              >
                {MOMENTUM_WORD[d.momentum]}
              </div>

              {/* Last-touched phrase */}
              {d.lastEngagement && (
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: "#8E8E93",
                    marginTop: 4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {d.lastEngagement}
                </div>
              )}

              {/* Suggested next move */}
              {d.nextAction && rowSpan === 2 && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#6E6E73",
                    marginTop: 6,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.4,
                  }}
                >
                  {d.nextAction}
                </div>
              )}

              {/* Spacer to push bar + phrases to bottom */}
              <div style={{ flex: 1 }} />

              {/* 7-day mini bar */}
              <WeekBar blocks={blocks} domainId={d.id} />

              {/* Money phrase */}
              {moneyStr && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#8E8E93",
                    marginTop: 5,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {moneyStr}
                </div>
              )}

              {/* CompounderPhrase */}
              {domainBlocks.length > 0 && (
                <div style={{ marginTop: 4, width: "100%" }}>
                  <CompounderPhrase domainId={d.id} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Balance signal (T·A·F) */}
      {balanceSignal && (
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 500,
            color: "#6E6E73",
            letterSpacing: "0.005em",
            padding: "0 4px 16px",
            lineHeight: 1.5,
          }}
        >
          {balanceSignal}
        </div>
      )}

      {/* Sub-cards */}
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#8E8E93",
          marginBottom: 8,
          paddingLeft: 2,
        }}
      >
        balance
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "14px 16px",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(180deg,#FFE0E8 0%,#FFC9D6 100%)",
            color: "#7A2A3C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            height={18}
            stroke="currentColor"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16v14H4z" />
            <path d="M4 9h16" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: "#0B0B0F",
              letterSpacing: "-0.005em",
            }}
          >
            theory · application balance
          </div>
          <div style={{ fontSize: 12, color: "#6E6E73", marginTop: 1 }}>
            {balanceSignal ?? "balanced this week."}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: "14px 16px",
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 110,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(180deg,#E2F4E6 0%,#C0E5C8 100%)",
            color: "#1F5C2C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            height={18}
            stroke="currentColor"
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19l4-4 4 4 8-8" />
            <path d="M16 7h4v4" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: "#0B0B0F",
              letterSpacing: "-0.005em",
            }}
          >
            compounder trend
          </div>
          <div style={{ fontSize: 12, color: "#6E6E73", marginTop: 1 }}>
            {domains
              .map((d) => d.name)
              .slice(0, 2)
              .join(", ")}{" "}
            · 3-week arc
          </div>
        </div>
      </div>
    </>
  );
}
