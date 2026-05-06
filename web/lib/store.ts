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
  sliderMinOffset: number;
  sliderMaxOffset: number;
};

type Actions = {
  start: (id: string) => void;
  pause: (id: string) => void;
  resume: (id: string) => void;
  finish: (id: string) => void;
  extend: (id: string, min: number) => void;
  reorder: (fromIdx: number, toIdx: number) => void;
  reorderBlocks: (orderedIds: string[]) => void;
  resetDay: () => void;
  setHydrated: () => void;
  completeOnboarding: () => void;
  setUserCity: (city: string) => void;
  setSliderRange: (min: number, max: number) => void;
  advanceStep: (id: string) => void;
  // block actions
  createBlock: (input: {
    title: string;
    domain: DomainId;
    durationMin: number;
    scheduleToday: boolean;
  }) => void;
  moveBlockTo: (id: string, target: "today" | "inbox") => void;
  // routine actions
  createRoutine: (routine: Omit<Routine, "id">) => void;
  updateRoutine: (id: string, patch: Partial<Omit<Routine, "id">>) => void;
  deleteRoutine: (id: string) => void;
  assignRoutine: (weekday: Weekday, routineId: string) => void;
  unassignRoutine: (weekday: Weekday) => void;
  // inbox
  addToInbox: (text: string, domain?: DomainId) => void;
  scheduleFromInbox: (id: string) => void;
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
      sliderMinOffset: -30,
      sliderMaxOffset: 60,
      setHydrated: () => set({ hydrated: true }),
      setSliderRange: (min, max) =>
        set({ sliderMinOffset: min, sliderMaxOffset: max }),
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

      advanceStep: (id) => {
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id || !b.step) return b;
            const next = (b.step.current ?? 0) + 1;
            return {
              ...b,
              step: {
                ...b.step,
                current: Math.min(next, b.step.items.length - 1),
              },
            };
          }),
        }));
      },

      reorderBlocks: (orderedIds: string[]) => {
        set((s) => {
          const idxMap = new Map(orderedIds.map((id, i) => [id, i]));
          return {
            blocks: s.blocks.map((b) => {
              const newOrder = idxMap.get(b.id);
              return newOrder !== undefined ? { ...b, order: newOrder } : b;
            }),
          };
        });
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
            status: "pending",
            accumulatedMs: 0,
            startedAt: undefined,
            adjustedMin: undefined,
          })),
        });
      },

      createBlock: ({ title, domain, durationMin, scheduleToday }) => {
        const s = get();
        const maxOrder = s.blocks.reduce((m, b) => Math.max(m, b.order), -1);
        const newBlock: Block = {
          id: `b-${Date.now()}`,
          title,
          domain,
          durationMin,
          status: "pending",
          accumulatedMs: 0,
          order: maxOrder + 1,
          scheduledFor: scheduleToday ? "today" : "inbox",
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

      addToInbox: (text, domain) => {
        const item: InboxItem = {
          id: `inbox-${Date.now()}`,
          text,
          domain,
          createdAt: Date.now(),
        };
        set((s) => ({ inbox: [...s.inbox, item] }));
      },

      scheduleFromInbox: (id) => {
        set((s) => {
          const item = s.inbox.find((x) => x.id === id);
          if (!item) return s;
          const maxOrder = s.blocks.reduce((m, b) => Math.max(m, b.order), -1);
          const newBlock: Block = {
            id: `b-${Date.now()}`,
            title: item.text,
            domain: item.domain ?? "home",
            durationMin: 30,
            status: "pending",
            accumulatedMs: 0,
            order: maxOrder + 1,
            scheduledFor: "today",
          };
          return {
            inbox: s.inbox.filter((x) => x.id !== id),
            blocks: [...s.blocks, newBlock],
          };
        });
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
      version: 8,
      skipHydration: true,
      migrate: (persistedState, _fromVersion) => {
        const s = persistedState as Record<string, unknown> | null;
        const hadPriorState = s != null && Object.keys(s).length > 0;

        // Migrate old Block shape → new shape
        // Old: { domainId, status: "idle"|"active"|"paused"|"done", subtasks, focusType, step: {current, total} }
        // New: { domain, status: "pending"|"active"|"paused"|"done", step: BlockStep, scheduledFor }
        const migrateBlock = (b: Record<string, unknown>): Block => {
          // domain field: prefer "domain", fall back to "domainId"
          const domain = (b.domain ?? b.domainId ?? "home") as Block["domain"];

          // status: remap "idle" → "pending"
          const rawStatus = (b.status ?? "pending") as string;
          const status: Block["status"] =
            rawStatus === "idle" ? "pending" : (rawStatus as Block["status"]);

          // step: if old shape {current, total} convert to new BlockStep
          let step: Block["step"] | undefined = undefined;
          if (b.step && typeof b.step === "object") {
            const oldStep = b.step as Record<string, unknown>;
            if ("items" in oldStep && Array.isArray(oldStep.items)) {
              // already new shape
              step = b.step as Block["step"];
            } else if ("current" in oldStep && "total" in oldStep) {
              // old shape — create a generic outline step
              const total = Number(oldStep.total ?? 0);
              step = {
                kind: "outline",
                items: Array.from({ length: total }, (_, i) => `Step ${i + 1}`),
                current: Number(oldStep.current ?? 0) - 1,
              };
            }
          }

          // scheduledFor: remap old "tomorrow" → "inbox"
          let scheduledFor: Block["scheduledFor"] = "today";
          if (b.scheduledFor === "tomorrow") scheduledFor = "inbox";
          else if (typeof b.scheduledFor === "string")
            scheduledFor = b.scheduledFor as Block["scheduledFor"];

          return {
            id: String(b.id ?? `b-${Math.random()}`),
            title: String(b.title ?? ""),
            domain,
            durationMin: Number(b.durationMin ?? 30),
            status,
            startedAt: b.startedAt as number | undefined,
            accumulatedMs: Number(b.accumulatedMs ?? 0),
            order: Number(b.order ?? 0),
            adjustedMin: b.adjustedMin as number | undefined,
            step,
            visionId: b.visionId as string | undefined,
            routineId: b.routineId as string | undefined,
            mode: b.mode as Block["mode"],
            meta: b.meta as Block["meta"],
            scheduledFor,
          };
        };

        const oldBlocks = Array.isArray(s?.blocks)
          ? (s.blocks as Record<string, unknown>[])
          : [];
        const blocks: Block[] =
          oldBlocks.length > 0 ? oldBlocks.map(migrateBlock) : SEED_BLOCKS;

        // Migrate Domain: add food domain if missing, update momentum vocab
        const oldDomains = Array.isArray(s?.domains)
          ? (s.domains as Record<string, unknown>[])
          : [];
        const momentumRemap: Record<string, string> = {
          strong: "warm",
          stable: "steady",
          weak: "drifting",
          inactive: "quiet",
        };
        const migratedDomains = oldDomains.map((d) => ({
          ...d,
          momentum: (momentumRemap[String(d.momentum ?? "steady")] ??
            d.momentum) as Domain["momentum"],
        }));
        const hasFoodDomain = migratedDomains.some(
          (d) => (d as Record<string, unknown>).id === "food",
        );
        const domains: Domain[] = (
          migratedDomains.length > 0 ? migratedDomains : DOMAINS
        ).concat(
          hasFoodDomain ? [] : [DOMAINS.find((d) => d.id === "food")!],
        ) as Domain[];

        // Migrate Routine blocks: domainId → domain
        const oldRoutines = Array.isArray(s?.routines)
          ? (s.routines as Record<string, unknown>[])
          : [];
        const routines: Routine[] =
          oldRoutines.length > 0
            ? (oldRoutines.map((r) => ({
                ...r,
                blocks: Array.isArray(r.blocks)
                  ? (r.blocks as Record<string, unknown>[]).map((rb) => ({
                      ...rb,
                      domain: rb.domain ?? rb.domainId ?? "home",
                    }))
                  : [],
              })) as Routine[])
            : SEED_ROUTINES;

        return {
          ...s,
          blocks,
          domains,
          visions:
            Array.isArray(s?.visions) && (s.visions as unknown[]).length > 0
              ? s.visions
              : SEED_VISIONS,
          routines,
          weekAssignments:
            (s?.weekAssignments as Record<Weekday, string | null>) ??
            SEED_WEEK_ASSIGNMENTS,
          inbox: Array.isArray(s?.inbox)
            ? (s.inbox as Record<string, unknown>[]).map((item) => ({
                ...item,
                domain: item.domain ?? item.domainId,
              }))
            : [],
          onboardingComplete:
            (s?.onboardingComplete as boolean) ?? hadPriorState,
          userCity: (s?.userCity as string) ?? "Kiel",
          sliderMinOffset: (s?.sliderMinOffset as number) ?? -30,
          sliderMaxOffset: (s?.sliderMaxOffset as number) ?? 60,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
