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

// Domain SVG glyphs (inline)
function DomainSVG({ id }: { id: DomainId }) {
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
        width: 42,
        height: 42,
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
        width={20}
        height={20}
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

  // Build the compact domain list (canon pattern: disc row at top + clean rows below)
  return (
    <>
      <Topbar
        name="six lives, one man."
        sub="tap a domain to see what's moving"
      />

      {/* Hero disc row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
          padding: "20px 0 14px",
        }}
      >
        {domains.map((d, i) => (
          <button
            key={d.id}
            onClick={() => router.push(`/domains/${d.id}`)}
            style={{
              marginLeft: i === 0 ? 0 : -6,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              borderRadius: "50%",
            }}
          >
            <DomainSVG id={d.id} />
          </button>
        ))}
      </div>

      {/* Domain list rows */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow:
            "0 0 0 0.5px rgba(60,60,67,0.06),0 1px 1px rgba(20,20,30,0.02),0 12px 28px -16px rgba(20,20,30,0.10),0 28px 50px -32px rgba(20,20,30,0.14)",
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        {domains.map((d, i) => {
          const now = Date.now();
          const sevenDaysAgo = now - 7 * 86_400_000;
          const domainBlocks = blocks.filter(
            (b) =>
              b.domain === d.id &&
              b.status === "done" &&
              b.startedAt !== undefined &&
              b.startedAt > sevenDaysAgo,
          );
          const monthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
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

          const subText = [
            d.lastEngagement,
            domainBlocks.length > 0
              ? `${domainBlocks.length} block${domainBlocks.length !== 1 ? "s" : ""} this week`
              : null,
            moneyStr,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <button
              key={d.id}
              onClick={() => router.push(`/domains/${d.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                width: "100%",
                background: "none",
                border: "none",
                borderTop: i === 0 ? "none" : "0.5px solid rgba(60,60,67,0.06)",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              <DomainSVG id={d.id} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#0B0B0F",
                    letterSpacing: "-0.012em",
                    lineHeight: 1.2,
                  }}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#6E6E73",
                    fontWeight: 500,
                    marginTop: 2,
                    letterSpacing: "-0.005em",
                  }}
                >
                  <strong
                    style={{
                      fontWeight: 700,
                      color: MOMENTUM_COLOR[d.momentum],
                    }}
                  >
                    {MOMENTUM_WORD[d.momentum]}
                  </strong>
                  {subText ? ` · ${subText}` : ""}
                </div>
                <CompounderPhrase domainId={d.id} />
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: "#8E8E93",
                  flexShrink: 0,
                  marginLeft: 6,
                }}
              >
                ›
              </span>
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
