import type { Block } from "./types";

export function elapsedMs(block: Block, now: number): number {
  if (block.status === "active" && block.startedAt) {
    return block.accumulatedMs + (now - block.startedAt);
  }
  return block.accumulatedMs;
}

export function remainingMs(block: Block, now: number): number {
  const total = block.durationMin * 60_000 + (block.adjustedMin ?? 0) * 60_000;
  return Math.max(0, total - elapsedMs(block, now));
}

export function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatMin(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function nextBlock(
  blocks: Block[],
  currentId: string | null,
): Block | null {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  if (!currentId) {
    return sorted.find((b) => b.status !== "done") ?? null;
  }
  const idx = sorted.findIndex((b) => b.id === currentId);
  if (idx === -1) return null;
  return sorted.slice(idx + 1).find((b) => b.status !== "done") ?? null;
}

export function activeBlock(blocks: Block[]): Block | null {
  return (
    blocks.find((b) => b.status === "active" || b.status === "paused") ?? null
  );
}

export function pickFocus(blocks: Block[]): Block | null {
  return activeBlock(blocks) ?? nextBlock(blocks, null);
}
