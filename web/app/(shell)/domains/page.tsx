"use client";

import { useRouter } from "next/navigation";
import { useDoIt } from "@/lib/store";
import { Topbar } from "@/components/Topbar";
import { DomainGlyph } from "@/components/icons";
import type { DomainMomentum, DomainId } from "@/lib/types";

const MOMENTUM_WORD: Record<DomainMomentum, string> = {
  warm: "warm.",
  steady: "steady.",
  drifting: "drifting.",
  quiet: "quieter.",
  humming: "humming.",
};

// humming = big tile (span 2 cols × min-height 174)
// warm/steady = normal (span 1)
// drifting/quiet = small (span 1, min-height 148)
function getTileSpan(momentum: DomainMomentum): "big" | "normal" | "small" {
  if (momentum === "humming") return "big";
  if (momentum === "steady" || momentum === "warm") return "normal";
  return "small";
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

/** Count done blocks per day for the last 7 days, for a given domain */
function sevenDayBlockCounts(
  blocks: ReturnType<typeof useDoIt.getState>["blocks"],
  domainId: DomainId,
): number[] {
  const now = Date.now();
  const counts: number[] = Array(7).fill(0);
  for (const b of blocks) {
    if (b.domain !== domainId || b.status !== "done") continue;
    // Use startedAt if available, else skip
    if (!b.startedAt) continue;
    const daysAgo = Math.floor((now - b.startedAt) / 86_400_000);
    if (daysAgo >= 0 && daysAgo < 7) {
      counts[6 - daysAgo]++;
    }
  }
  return counts;
}

/** Compute money phrase for domain from transactions this month */
function moneyPhrase(
  transactions: ReturnType<typeof useDoIt.getState>["transactions"],
  domainId: DomainId,
): string | null {
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const domainTx = transactions.filter(
    (t) => t.domain === domainId && t.dateISO.startsWith(monthStr),
  );
  if (domainTx.length === 0) return null;
  const totalCents = domainTx.reduce((acc, t) => {
    return t.kind === "expense" ? acc + t.amountCents : acc - t.amountCents;
  }, 0);
  if (totalCents > 10000) return "$ heavy this month";
  if (totalCents > 2000) return "$ steady this month";
  if (totalCents > 0) return "$ light this month";
  return null;
}

export default function DomainsPage() {
  const { domains, blocks, transactions } = useDoIt();
  const router = useRouter();
  const balanceSignal = computeBalanceSignal(blocks);

  if (domains.length === 0) {
    return (
      <>
        <Topbar name="domains." sub="five facets, one life." />
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

  return (
    <>
      <Topbar name="domains." sub="five facets, one life." />

      {/* T·A·F balance signal */}
      {balanceSignal && (
        <div
          style={{
            fontSize: 12,
            color: "var(--label-2,#6E6E73)",
            fontStyle: "italic",
            letterSpacing: "-0.005em",
            padding: "0 2px 12px",
            lineHeight: 1.4,
          }}
        >
          {balanceSignal}
        </div>
      )}

      {/* Asymmetric bento grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridAutoRows: "minmax(120px,auto)",
          gap: 12,
          paddingBottom: 110,
        }}
      >
        {domains.map((d) => {
          const span = getTileSpan(d.momentum);
          const isBig = span === "big";
          const barCounts = sevenDayBlockCounts(blocks, d.id);
          const maxBar = Math.max(...barCounts, 1);
          const money = moneyPhrase(transactions, d.id);

          return (
            <button
              key={d.id}
              onClick={() => router.push(`/domains/${d.id}`)}
              style={{
                gridColumn: isBig ? "span 2" : "span 1",
                minHeight: isBig ? 174 : 148,
                position: "relative",
                background: "var(--card,#fff)",
                borderRadius: 24,
                padding: 16,
                boxShadow:
                  "0 0 0 0.5px rgba(60,60,67,0.05),0 1px 1px rgba(20,20,30,0.02),0 8px 22px -14px rgba(20,20,30,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "left",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
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
                }}
              />

              {/* head: glyph + name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 10,
                }}
              >
                <div
                  className={`ddisc ${d.id}`}
                  style={{ width: 38, height: 38, flexShrink: 0 }}
                >
                  <DomainGlyph id={d.id} />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.022em",
                    color: "var(--ink,#000)",
                  }}
                >
                  {d.name}
                </div>
              </div>

              {/* momentum word */}
              <div
                style={{
                  fontSize: isBig ? 32 : 24,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "var(--ink,#000)",
                  marginBottom: 4,
                }}
              >
                {MOMENTUM_WORD[d.momentum]}
              </div>

              {/* compounder / last engagement */}
              <div
                style={{
                  fontSize: 11,
                  color: "var(--label,#8E8E93)",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                  marginBottom: 8,
                }}
              >
                {d.lastEngagement}
              </div>

              {/* 7-day minibar */}
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 18,
                  marginBottom: 8,
                }}
              >
                {barCounts.map((count, i) => {
                  const pct = maxBar > 0 ? count / maxBar : 0;
                  const minH = 3;
                  const h = Math.max(minH, Math.round(pct * 18));
                  return (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        height: h,
                        background:
                          count > 0
                            ? "var(--ink-2,#1C1C1E)"
                            : "var(--inset-2,#EAEAEF)",
                        borderRadius: 2,
                        boxShadow:
                          count > 0
                            ? undefined
                            : "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                        display: "block",
                      }}
                    />
                  );
                })}
              </div>

              {/* money phrase */}
              {money && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--label-2,#6E6E73)",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {money}
                </div>
              )}

              {/* next move */}
              {d.nextAction && (
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--label-2,#6E6E73)",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.4,
                    background: "var(--inset,#F2F2F7)",
                    padding: "8px 10px",
                    borderRadius: 12,
                    boxShadow: "inset 0 0 0 0.5px rgba(60,60,67,0.06)",
                    marginTop: "auto",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                      color: "var(--label,#8E8E93)",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    next move
                  </span>
                  {d.nextAction}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
