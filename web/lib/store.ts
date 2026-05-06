"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Block,
  Domain,
  Vision,
  Routine,
  Weekday,
  InboxItem,
  DomainId,
} from "./types";
import {
  DOMAINS,
  SEED_BLOCKS,
  SEED_VISIONS,
  SEED_ROUTINES,
  SEED_WEEK_ASSIGNMENTS,
} from "./seed";

type State = {
  blocks: Block[];
  domains: Domain[];
  visions: Vision[];
  routines: Routine[];
  weekAssignments: Record<Weekday, string | null>;
  inbox: InboxItem[];
  hydrated: boolean;
  onboardingComplete: boolean;
  userCity: string;
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
  completeOnboarding: () => void;
  setUserCity: (city: string) => void;
  // block actions
  createBlock: (input: {
    title: string;
    domainId: DomainId;
    durationMin: number;
    scheduleToday: boolean;
  }) => void;
  moveBlockTo: (id: string, target: "today" | "tomorrow") => void;
  // routine actions
  createRoutine: (routine: Omit<Routine, "id">) => void;
  updateRoutine: (id: string, patch: Partial<Omit<Routine, "id">>) => void;
  deleteRoutine: (id: string) => void;
  assignRoutine: (weekday: Weekday, routineId: string) => void;
  unassignRoutine: (weekday: Weekday) => void;
  // inbox
  addToInbox: (text: string, domainId?: DomainId) => void;
  // domains
  updateDomain: (id: DomainId, patch: Partial<Omit<Domain, "id">>) => void;
  // visions
  updateVision: (id: string, patch: Partial<Omit<Vision, "id">>) => void;
  deleteVision: (id: string) => void;
  createVision: (vision: Omit<Vision, "id">) => void;
};

export const useDoIt = create<State & Actions>()(
  persist(
    (set, get) => ({
      blocks: SEED_BLOCKS,
      domains: DOMAINS,
      visions: SEED_VISIONS,
      routines: SEED_ROUTINES,
      weekAssignments: SEED_WEEK_ASSIGNMENTS,
      inbox: [],
      hydrated: false,
      onboardingComplete: false,
      userCity: "Kiel",
      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: () => {
        if (typeof window !== "undefined") {
          localStorage.setItem("do-it-onboarding-complete", "1");
        }
        set({ onboardingComplete: true });
      },
      setUserCity: (city) => set({ userCity: city }),

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

      createBlock: ({ title, domainId, durationMin, scheduleToday }) => {
        const s = get();
        const maxOrder = s.blocks.reduce((m, b) => Math.max(m, b.order), -1);
        const newBlock: Block = {
          id: `b-${Date.now()}`,
          title,
          domainId,
          durationMin,
          status: scheduleToday ? "idle" : "idle",
          accumulatedMs: 0,
          order: maxOrder + 1,
        };
        set((st) => ({ blocks: [...st.blocks, newBlock] }));
      },

      moveBlockTo: (id, target) => {
        set((s) => {
          const maxOrder = s.blocks.reduce((m, b) => Math.max(m, b.order), -1);
          return {
            blocks: s.blocks.map((b) =>
              b.id === id
                ? { ...b, scheduledFor: target, order: maxOrder + 1 }
                : b,
            ),
          };
        });
      },

      createRoutine: (routine) => {
        const newRoutine: Routine = { ...routine, id: `r-${Date.now()}` };
        set((s) => ({ routines: [...s.routines, newRoutine] }));
      },

      updateRoutine: (id, patch) => {
        set((s) => ({
          routines: s.routines.map((r) =>
            r.id === id ? { ...r, ...patch } : r,
          ),
        }));
      },

      deleteRoutine: (id) => {
        set((s) => ({
          routines: s.routines.filter((r) => r.id !== id),
          weekAssignments: Object.fromEntries(
            Object.entries(s.weekAssignments).map(([day, rid]) => [
              day,
              rid === id ? null : rid,
            ]),
          ) as Record<Weekday, string | null>,
        }));
      },

      assignRoutine: (weekday, routineId) => {
        set((s) => ({
          weekAssignments: { ...s.weekAssignments, [weekday]: routineId },
        }));
      },

      unassignRoutine: (weekday) => {
        set((s) => ({
          weekAssignments: { ...s.weekAssignments, [weekday]: null },
        }));
      },

      addToInbox: (text, domainId) => {
        const item: InboxItem = {
          id: `inbox-${Date.now()}`,
          text,
          domainId,
          createdAt: Date.now(),
        };
        set((s) => ({ inbox: [...s.inbox, item] }));
      },

      updateDomain: (id, patch) => {
        set((s) => ({
          domains: s.domains.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        }));
      },

      updateVision: (id, patch) => {
        set((s) => ({
          visions: s.visions.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        }));
      },

      deleteVision: (id) => {
        set((s) => ({ visions: s.visions.filter((v) => v.id !== id) }));
      },

      createVision: (vision) => {
        const newVision: Vision = { ...vision, id: `v-${Date.now()}` };
        set((s) => ({ visions: [...s.visions, newVision] }));
      },
    }),
    {
      name: "do-it-state",
      version: 5,
      skipHydration: true,
      migrate: (persistedState, _fromVersion) => {
        const s = persistedState as Partial<State> | null;
        // For existing users (any prior version), treat onboarding as complete
        // so they don't re-see onboarding after an upgrade.
        const hadPriorState = s != null && Object.keys(s).length > 0;
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
          routines: s?.routines ?? SEED_ROUTINES,
          weekAssignments: s?.weekAssignments ?? SEED_WEEK_ASSIGNMENTS,
          inbox: s?.inbox ?? [],
          onboardingComplete: s?.onboardingComplete ?? hadPriorState,
          userCity: s?.userCity ?? "Kiel",
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
