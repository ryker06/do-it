"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Block, Domain, Vision } from "./types";
import { DOMAINS, SEED_BLOCKS, SEED_VISIONS } from "./seed";

type State = {
  blocks: Block[];
  domains: Domain[];
  visions: Vision[];
  hydrated: boolean;
};

type Actions = {
  start: (id: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  finish: (id: string) => void;
  extend: (id: string, min: number) => void;
  reorder: (fromIdx: number, toIdx: number) => void;
  resetDay: () => void;
  setHydrated: () => void;
};

export const useDoIt = create<State & Actions>()(
  persist(
    (set, get) => ({
      blocks: SEED_BLOCKS,
      domains: DOMAINS,
      visions: SEED_VISIONS,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),

      start: (id) => {
        const now = Date.now();
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id === id) {
              return { ...b, status: "active", startedAt: now };
            }
            if (b.status === "active") {
              return {
                ...b,
                status: "paused",
                accumulatedMs: b.accumulatedMs + (now - (b.startedAt ?? now)),
                startedAt: undefined,
              };
            }
            return b;
          }),
        }));
      },

      pause: (id) => {
        const now = Date.now();
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id) return b;
            return {
              ...b,
              status: "paused",
              accumulatedMs: b.accumulatedMs + (now - (b.startedAt ?? now)),
              startedAt: undefined,
            };
          }),
        }));
      },

      resume: (id) => {
        const now = Date.now();
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id === id) return { ...b, status: "active", startedAt: now };
            if (b.status === "active") {
              return {
                ...b,
                status: "paused",
                accumulatedMs: b.accumulatedMs + (now - (b.startedAt ?? now)),
                startedAt: undefined,
              };
            }
            return b;
          }),
        }));
      },

      finish: (id) => {
        const now = Date.now();
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id) return b;
            const accumulated =
              b.accumulatedMs + (b.startedAt ? now - b.startedAt : 0);
            return {
              ...b,
              status: "done",
              accumulatedMs: accumulated,
              startedAt: undefined,
            };
          }),
        }));
      },

      extend: (id, min) => {
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === id ? { ...b, adjustedMin: (b.adjustedMin ?? 0) + min } : b,
          ),
        }));
      },

      reorder: (fromIdx, toIdx) => {
        set((s) => {
          const sorted = [...s.blocks].sort((a, b) => a.order - b.order);
          const [moved] = sorted.splice(fromIdx, 1);
          sorted.splice(toIdx, 0, moved);
          return {
            blocks: sorted.map((b, i) => ({ ...b, order: i })),
          };
        });
      },

      resetDay: () => {
        set({
          blocks: SEED_BLOCKS.map((b) => ({
            ...b,
            status: "idle",
            accumulatedMs: 0,
            startedAt: undefined,
            adjustedMin: undefined,
          })),
        });
      },
    }),
    {
      name: "do-it-state",
      version: 3,
      skipHydration: true,
      migrate: (persistedState, _fromVersion) => {
        const s = persistedState as Partial<State> | null;
        return {
          ...s,
          blocks: (s?.blocks ?? SEED_BLOCKS).map((b, i) => ({
            ...b,
            step: b.step ?? SEED_BLOCKS[i]?.step,
            focusType: b.focusType ?? SEED_BLOCKS[i]?.focusType,
          })),
          domains: (s?.domains ?? DOMAINS).map((d) => ({
            ...d,
            streakLabel:
              d.streakLabel ?? DOMAINS.find((x) => x.id === d.id)?.streakLabel,
          })),
          visions: s?.visions ?? SEED_VISIONS,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
