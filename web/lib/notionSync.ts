"use client";

/**
 * notionSync — PWA-side client for the Cloudflare Worker sync endpoint.
 *
 * Call syncFromCloud() on app open (via SyncOnLoad component).
 * Also exposed for the manual "Sync now" button in Settings.
 *
 * Never throws — returns { added: 0, skipped: 0 } on any failure.
 */

import type { DomainId } from "./types";
import type { Block } from "./types";
import { useDoIt } from "./store";

type SyncedBlock = {
  id: string;
  title: string;
  domain: DomainId;
  durationMin: number;
  scheduledFor: "today";
  mode?: "theory" | "application" | "feedback";
  visionId?: string;
  routineId?: string;
  meta?: { ingredients?: string[] };
};

export type SyncResult = { added: number; skipped: number };

/**
 * Fetch today's blocks from the Worker and merge into Zustand store.
 * Pass the store snapshot and actions in so this fn stays testable.
 */
export async function syncFromCloud(options?: {
  syncUrl?: string;
}): Promise<SyncResult> {
  // Resolve sync URL — arg → env var → empty
  const url =
    options?.syncUrl?.trim() ||
    (typeof process !== "undefined"
      ? (process.env.NEXT_PUBLIC_SYNC_URL ?? "")
      : "");

  if (!url) {
    return { added: 0, skipped: 0 };
  }

  let raw: SyncedBlock[];

  try {
    const endpoint = url.replace(/\/$/, "") + "/tasks/today";
    const resp = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // 10-second timeout via AbortController
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      console.warn("[notionSync] Worker responded", resp.status);
      return { added: 0, skipped: 0 };
    }

    const json: unknown = await resp.json();
    if (!Array.isArray(json)) {
      console.warn("[notionSync] Unexpected response shape");
      return { added: 0, skipped: 0 };
    }

    raw = json as SyncedBlock[];
  } catch (err) {
    console.warn("[notionSync] Fetch failed:", err);
    return { added: 0, skipped: 0 };
  }

  // Merge into store
  const state = useDoIt.getState();
  const existingIds = new Set(state.blocks.map((b) => b.id));
  const maxOrder = state.blocks.reduce((m, b) => Math.max(m, b.order), -1);

  let added = 0;
  let skipped = 0;
  let orderCursor = maxOrder;

  const newBlocks: Block[] = [];

  for (const sb of raw) {
    if (existingIds.has(sb.id)) {
      skipped++;
      continue;
    }
    orderCursor++;
    const block: Block = {
      id: sb.id,
      title: sb.title,
      domain: sb.domain,
      durationMin: sb.durationMin,
      status: "pending",
      accumulatedMs: 0,
      order: orderCursor,
      scheduledFor: "today",
      ...(sb.mode ? { mode: sb.mode } : {}),
      ...(sb.visionId ? { visionId: sb.visionId } : {}),
      ...(sb.routineId ? { routineId: sb.routineId } : {}),
      ...(sb.meta ? { meta: sb.meta } : {}),
    };
    newBlocks.push(block);
    added++;
  }

  if (newBlocks.length > 0) {
    useDoIt.setState((s) => ({ blocks: [...s.blocks, ...newBlocks] }));
  }

  // Record last sync timestamp
  const todayISO = new Date().toISOString().slice(0, 10);
  useDoIt.setState((s) => ({
    userPrefs: { ...s.userPrefs, lastSyncISO: todayISO },
  }));

  return { added, skipped };
}
