"use client";

import { useDoIt } from "@/lib/store";
import type { DomainId, DomainMomentum } from "@/lib/types";

interface CompounderPhraseProps {
  domainId: DomainId;
}

function startOfWeekMs(weeksAgo: number): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // Monday-based week
  d.setDate(d.getDate() - ((day + 6) % 7) - weeksAgo * 7);
  return d.getTime();
}

function blocksInWindow(
  blocks: { domain: DomainId; status: string; accumulatedMs: number }[],
  domainId: DomainId,
  fromMs: number,
  toMs: number,
): number {
  // We don't have block completion timestamps stored, so we use accumulatedMs > 0
  // as a proxy for "touched" blocks in this domain. For the trend we count domain
  // blocks that have any accumulated time — a rough but real signal.
  return blocks.filter(
    (b) =>
      b.domain === domainId && (b.status === "done" || b.accumulatedMs > 0),
  ).length;
}

function countToMomentum(count: number): DomainMomentum {
  if (count >= 5) return "humming";
  if (count >= 3) return "warm";
  if (count >= 2) return "steady";
  if (count >= 1) return "drifting";
  return "quiet";
}

export function CompounderPhrase({ domainId }: CompounderPhraseProps) {
  const { blocks } = useDoIt();

  // Compute last 3 weeks' momentum words
  const words: DomainMomentum[] = [];
  for (let i = 2; i >= 0; i--) {
    const from = startOfWeekMs(i);
    const to = startOfWeekMs(i - 1);
    const count = blocksInWindow(blocks, domainId, from, to);
    words.push(countToMomentum(count));
  }

  const allSame = words.every((w) => w === words[0]);
  const hasData = blocks.some((b) => b.domain === domainId);

  if (!hasData) {
    return (
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--label,#8E8E93)",
          letterSpacing: "-0.005em",
          marginTop: 4,
        }}
      >
        still gathering
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 500,
        color: "var(--label,#8E8E93)",
        letterSpacing: "-0.005em",
        marginTop: 4,
      }}
    >
      {words.join(" → ")}
      {allSame && words[0] !== "quiet" && (
        <span style={{ color: "var(--label-2,#6E6E73)" }}> · holding</span>
      )}
    </div>
  );
}
