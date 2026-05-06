"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Block,
  Domain,
  Vision,
  Routine,
  Weekday,
  DomainId,
  Subscription,
  Transaction,
  Reflection,
  StateLogEntry,
  StateMark,
  Insight,
  WeeklyReview,
  Person,
  WishlistItem,
} from "./types";
import {
  DOMAINS,
  SEED_BLOCKS,
  SEED_VISIONS,
  SEED_ROUTINES,
  SEED_WEEK_ASSIGNMENTS,
  SEED_SUBSCRIPTIONS,
  SEED_TRANSACTIONS,
  SEED_REFLECTIONS,
  SEED_STATE_LOG,
  SEED_INSIGHTS,
  SEED_PEOPLE,
  SEED_WISHLIST,
} from "./seed";

type UserPrefs = {
  wakeHHMM: string;
  sleepHHMM: string;
  syncUrl?: string;
  lastSyncISO?: string;
};

type State = {
  blocks: Block[];
  domains: Domain[];
  visions: Vision[];
  routines: Routine[];
  weekAssignments: Record<Weekday, string | null>;
  hydrated: boolean;
  onboardingComplete: boolean;
  userCity: string;
  sliderMinOffset: number;
  sliderMaxOffset: number;
  subscriptions: Subscription[];
  transactions: Transaction[];
  reflections: Reflection[];
  stateLog: StateLogEntry[];
  insights: Insight[];
  weeklyReviews: WeeklyReview[];
  people: Person[];
  wishlist: WishlistItem[];
  userPrefs: UserPrefs;
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
  // domains
  updateDomain: (id: DomainId, patch: Partial<Omit<Domain, "id">>) => void;
  // visions
  updateVision: (id: string, patch: Partial<Omit<Vision, "id">>) => void;
  deleteVision: (id: string) => void;
  createVision: (vision: Omit<Vision, "id">) => void;
  // money
  addSubscription: (sub: Omit<Subscription, "id">) => void;
  removeSubscription: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  // reflections
  addReflection: (r: Omit<Reflection, "id">) => void;
  // state log
  addStateMark: (mark: StateMark, note?: string) => void;
  // insights
  addInsight: (ins: Omit<Insight, "id">) => void;
  removeInsight: (id: string) => void;
  // people
  addPerson: (p: Omit<Person, "id">) => void;
  updatePerson: (id: string, patch: Partial<Omit<Person, "id">>) => void;
  // weekly review
  addWeeklyReview: (wr: Omit<WeeklyReview, "id">) => void;
  // wishlist
  addWishlistItem: (item: Omit<WishlistItem, "id" | "createdAt">) => void;
  updateWishlistItem: (
    id: string,
    patch: Partial<Omit<WishlistItem, "id">>,
  ) => void;
  removeWishlistItem: (id: string) => void;
  markWishlistBought: (id: string) => void;
  // NOW mid-session commands
  extendCurrent: (min: number) => void;
  skipCurrent: () => void;
  pauseCurrent: () => void;
  finishCurrent: () => void;
  // user prefs
  userPrefs: UserPrefs;
  setUserPrefs: (prefs: Partial<UserPrefs>) => void;
};

export const useDoIt = create<State & Actions>()(
  persist(
    (set, get) => ({
      blocks: SEED_BLOCKS,
      domains: DOMAINS,
      visions: SEED_VISIONS,
      routines: SEED_ROUTINES,
      weekAssignments: SEED_WEEK_ASSIGNMENTS,
      hydrated: false,
      onboardingComplete: false,
      userCity: "Kiel",
      sliderMinOffset: -30,
      sliderMaxOffset: 60,
      subscriptions: SEED_SUBSCRIPTIONS,
      transactions: SEED_TRANSACTIONS,
      reflections: SEED_REFLECTIONS,
      stateLog: SEED_STATE_LOG,
      insights: SEED_INSIGHTS,
      weeklyReviews: [],
      people: SEED_PEOPLE,
      wishlist: SEED_WISHLIST,
      userPrefs: {
        wakeHHMM: "06:00",
        sleepHHMM: "22:00",
        syncUrl: "",
        lastSyncISO: "",
      },
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
        // Block is the one primitive. Inbox items are blocks with scheduledFor:'inbox'.
        const s = get();
        const maxOrder = s.blocks.reduce((m, b) => Math.max(m, b.order), -1);
        const newBlock: Block = {
          id: `inbox-${Date.now()}`,
          title: text,
          domain: domain ?? "business",
          durationMin: 30,
          status: "pending",
          accumulatedMs: 0,
          order: maxOrder + 1,
          scheduledFor: "inbox",
        };
        set((st) => ({ blocks: [...st.blocks, newBlock] }));
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

      addSubscription: (sub) => {
        const newSub: Subscription = { ...sub, id: `sub-${Date.now()}` };
        set((s) => ({ subscriptions: [...s.subscriptions, newSub] }));
      },
      removeSubscription: (id) => {
        set((s) => ({
          subscriptions: s.subscriptions.filter((x) => x.id !== id),
        }));
      },
      addTransaction: (tx) => {
        const newTx: Transaction = { ...tx, id: `tx-${Date.now()}` };
        set((s) => ({ transactions: [...s.transactions, newTx] }));
      },
      removeTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
        }));
      },

      addReflection: (r) => {
        const newR: Reflection = { ...r, id: `ref-${Date.now()}` };
        set((s) => {
          // Replace existing reflection for same date
          const filtered = s.reflections.filter((x) => x.dateISO !== r.dateISO);
          return { reflections: [...filtered, newR] };
        });
      },

      addStateMark: (mark, note) => {
        const entry: StateLogEntry = {
          id: `sl-${Date.now()}`,
          ts: Date.now(),
          mark,
          note,
        };
        set((s) => ({ stateLog: [...s.stateLog, entry] }));
      },

      addInsight: (ins) => {
        const newIns: Insight = { ...ins, id: `ins-${Date.now()}` };
        set((s) => ({ insights: [...s.insights, newIns] }));
      },
      removeInsight: (id) => {
        set((s) => ({ insights: s.insights.filter((x) => x.id !== id) }));
      },

      addPerson: (p) => {
        const newP: Person = { ...p, id: `p-${Date.now()}` };
        set((s) => ({ people: [...s.people, newP] }));
      },
      updatePerson: (id, patch) => {
        set((s) => ({
          people: s.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      addWeeklyReview: (wr) => {
        const newWr: WeeklyReview = { ...wr, id: `wr-${Date.now()}` };
        set((s) => {
          // Replace if same weekStartISO
          const filtered = s.weeklyReviews.filter(
            (x) => x.weekStartISO !== wr.weekStartISO,
          );
          return { weeklyReviews: [...filtered, newWr] };
        });
      },

      addWishlistItem: (item) => {
        const newItem: WishlistItem = {
          ...item,
          id: `w-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((s) => ({ wishlist: [...s.wishlist, newItem] }));
      },

      updateWishlistItem: (id, patch) => {
        set((s) => ({
          wishlist: s.wishlist.map((w) =>
            w.id === id ? { ...w, ...patch } : w,
          ),
        }));
      },

      removeWishlistItem: (id) => {
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== id) }));
      },

      markWishlistBought: (id) => {
        const s = get();
        const item = s.wishlist.find((w) => w.id === id);
        if (!item) return;
        const now = Date.now();
        const todayISO = new Date(now).toISOString().slice(0, 10);
        set((st) => ({
          wishlist: st.wishlist.map((w) =>
            w.id === id ? { ...w, status: "bought", boughtAt: now } : w,
          ),
          transactions: [
            ...st.transactions,
            {
              id: `tx-w-${Date.now()}`,
              kind: "expense" as const,
              amountCents: item.expectedAmountCents,
              currency: item.currency,
              dateISO: todayISO,
              category: `wishlist:${item.category ?? "other"}`,
              note: item.name,
              source: "manual" as const,
            },
          ],
        }));
      },

      extendCurrent: (min) => {
        set((s) => {
          const active = s.blocks.find(
            (b) => b.status === "active" || b.status === "paused",
          );
          if (!active) return s;
          return {
            blocks: s.blocks.map((b) =>
              b.id === active.id
                ? { ...b, adjustedMin: (b.adjustedMin ?? 0) + min }
                : b,
            ),
          };
        });
      },

      skipCurrent: () => {
        set((s) => {
          const active = s.blocks.find(
            (b) => b.status === "active" || b.status === "paused",
          );
          if (!active) return s;
          return {
            blocks: s.blocks.map((b) =>
              b.id === active.id ? { ...b, status: "done" } : b,
            ),
          };
        });
      },

      pauseCurrent: () => {
        const now = Date.now();
        set((s) => {
          const active = s.blocks.find((b) => b.status === "active");
          if (!active) return s;
          return {
            blocks: s.blocks.map((b) =>
              b.id === active.id
                ? {
                    ...b,
                    status: "paused",
                    accumulatedMs:
                      b.accumulatedMs + (now - (b.startedAt ?? now)),
                    startedAt: undefined,
                  }
                : b,
            ),
          };
        });
      },

      finishCurrent: () => {
        const now = Date.now();
        set((s) => {
          const active = s.blocks.find(
            (b) => b.status === "active" || b.status === "paused",
          );
          if (!active) return s;
          return {
            blocks: s.blocks.map((b) =>
              b.id === active.id
                ? {
                    ...b,
                    status: "done",
                    accumulatedMs:
                      b.accumulatedMs +
                      (b.status === "active" && b.startedAt
                        ? now - b.startedAt
                        : 0),
                    startedAt: undefined,
                  }
                : b,
            ),
          };
        });
      },

      setUserPrefs: (prefs) => {
        set((s) => ({ userPrefs: { ...s.userPrefs, ...prefs } }));
      },
    }),
    {
      name: "do-it-state",
      version: 11,
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
              ? SEED_VISIONS.map((seed) => {
                  const stored = (s.visions as Vision[]).find(
                    (v) => v.id === seed.id,
                  );
                  // Merge: seed fields win for optional rich fields that may be
                  // missing from stale localStorage snapshots (deadline,
                  // targetMetric, description, threads, etc.)
                  // stored wins for user-edited fields; seed fills in new
                  // optional fields (deadline, targetMetric, description,
                  // threads) that may be absent from stale localStorage data.
                  if (!stored) return seed;
                  const merged = { ...stored };
                  for (const key of Object.keys(seed) as (keyof Vision)[]) {
                    if (merged[key] === undefined || merged[key] === null) {
                      (merged as Record<string, unknown>)[key] = seed[key];
                    }
                  }
                  return merged;
                })
              : SEED_VISIONS,
          routines,
          weekAssignments:
            (s?.weekAssignments as Record<Weekday, string | null>) ??
            SEED_WEEK_ASSIGNMENTS,
          onboardingComplete:
            (s?.onboardingComplete as boolean) ?? hadPriorState,
          userCity: (s?.userCity as string) ?? "Kiel",
          sliderMinOffset: (s?.sliderMinOffset as number) ?? -30,
          sliderMaxOffset: (s?.sliderMaxOffset as number) ?? 60,
          subscriptions: Array.isArray(s?.subscriptions)
            ? (s.subscriptions as Subscription[])
            : SEED_SUBSCRIPTIONS,
          transactions: Array.isArray(s?.transactions)
            ? (s.transactions as Transaction[])
            : SEED_TRANSACTIONS,
          reflections: Array.isArray(s?.reflections)
            ? (s.reflections as Reflection[])
            : SEED_REFLECTIONS,
          stateLog: Array.isArray(s?.stateLog)
            ? (s.stateLog as StateLogEntry[])
            : SEED_STATE_LOG,
          insights: Array.isArray(s?.insights)
            ? (s.insights as Insight[])
            : SEED_INSIGHTS,
          weeklyReviews: Array.isArray(s?.weeklyReviews)
            ? (s.weeklyReviews as WeeklyReview[])
            : [],
          people: Array.isArray(s?.people)
            ? (s.people as Person[])
            : SEED_PEOPLE,
          wishlist: Array.isArray(s?.wishlist)
            ? (s.wishlist as WishlistItem[])
            : SEED_WISHLIST,
          userPrefs: {
            wakeHHMM: "06:00",
            sleepHHMM: "22:00",
            ...(s?.userPrefs as Partial<UserPrefs> | undefined),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
