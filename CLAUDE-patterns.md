# Patterns & Known Issues
## Proven patterns

### Shared prayer cache
`do-it-prayer-cache-v1` in localStorage is the single source of truth for today's prayer times. Both `PrayerBanner` and `today/page.tsx` read/write this key. Shape: `{ date: string (toDateString()), anchors: Anchor[] }`. Day-string check invalidates stale data automatically.

### Zustand persist migration pattern
Stable key name (`"do-it-state"`), `version: N`, `migrate(persistedState, fromVersion)` that spreads persisted state and backfills missing fields from seed defaults. Never version-suffix the key — that defeats migration.

### Playwright in this project
Playwright is installed as a dev dependency in `web/` via pnpm. Run verification scripts as `node <script>.mjs` from the `web/` directory so Node resolves `playwright` from `web/node_modules`.

### CSS variable fallbacks in inline styles
Use `"var(--token, #hex)"` pattern for inline styles that reference design tokens. This gives a reliable fallback if the CSS variable hasn't loaded, and makes the palette intention explicit.

## Known bugs & fixes

### `void hydrated` anti-pattern
Early pages suppressed "unused variable" lint warnings with `void hydrated;`. This is dead code — `skipHydration` + `setHydrated` in the store handles hydration ordering. Remove from destructure entirely.

### Non-null assertions on optional Block fields
`focus.adjustedMin!` is unsafe — use `focus.adjustedMin ?? 0`. The field is `optional` in the Block type.

## Library quirks
[Filled when the verification subagent or engineering hits a non-obvious framework quirk]

## food domain — always add to Record<DomainId,...>
`DomainId` includes `"food"`. Every `Record<DomainId, string>` constant needs a `food` entry or TypeScript errors. Pattern is `food: "linear-gradient(180deg,#FFF3E0 0%, #FFE0B2 100%)"` for bg, `food: "#FFD08A"` for dot.

## Block field names (post wave 1 refactor)
Block uses `domain: DomainId` (NOT `domainId`). RoutineBlock also uses `domain`. Vision keeps `domainId`. Any component accessing block's domain: `b.domain`, not `b.domainId`.

## BlockStep shape (post wave 1 refactor)
`step.total` was removed. Use `step.items.length` for total count. `step.current` is 0-based index. Display as `step ${(step.current ?? 0) + 1} of ${step.items.length}`.

## BlockStatus: no "idle"
`"idle"` was removed. Status is `"pending" | "active" | "paused" | "done"`. Any `=== "idle"` check must be `=== "pending"`.

## DomainMomentum vocabulary
Old values `strong/stable/weak/inactive` were remapped to `warm/steady/drifting/quiet/humming` in store migration. Any `Record<DomainMomentum,...>` must use the new values.

## store.createBlock signature
Takes `{ title, domain, durationMin, scheduleToday }` — field is `domain`, not `domainId`. Components passing `domainId` local state must rename the key.

## UserPrefs extension pattern
When adding new optional fields to `userPrefs`, define a named `UserPrefs` type in store.ts (not an inline anonymous type), add the fields as optional, update both the initial default value AND the migrate spread (use `{ wakeHHMM: "06:00", sleepHHMM: "22:00", ...s?.userPrefs }` pattern so new fields are backfilled from seed defaults). Bump persist version.

## Static export + dynamic [id] routes
With `output: export` in next.config, any `[id]/page.tsx` MUST export `generateStaticParams()` or the build fails with "missing generateStaticParams". For user-created runtime IDs (goals, jar entries, etc.) that aren't known at build time, do NOT use `[param]` routes. Instead, use a static page with `useSearchParams` to read `?id=` from the URL. Wrap the component reading searchParams in `<Suspense>` to avoid hydration errors.

Pattern:
```tsx
// /goals/detail/page.tsx
function Inner() {
  const id = useSearchParams().get("id") ?? "";
  const goal = goals.find(g => g.id === id);
  ...
}
export default function Page() {
  return <Suspense fallback={<div />}><Inner /></Suspense>;
}
// Link to it: href={`/goals/detail?id=${g.id}`}
```

## addInsight requires status field
`Insight` type now requires `status: InsightStatus` (not optional). Any `addInsight(...)` call must include `status: "captured"` as default. Missing this causes a TypeScript build error.

## TypeScript: closures don't narrow post-early-return
If a function does `if (!goal) return <JSX/>` and later uses `goal` inside a nested function (closure), TS still considers `goal` possibly undefined. Add a `if (!goal) return;` guard at the top of the closure function, or use a non-null assertion if the early return truly guarantees non-null.

## syncFromCloud is store-aware but not a hook
`web/lib/notionSync.ts` calls `useDoIt.getState()` and `useDoIt.setState()` directly (not inside a React component). This is valid for Zustand — the store instance is a singleton. Never import this file from a Server Component.

## Cloudflare Worker is a separate package
`worker/` at repo root is a standalone Node package (wrangler devDep, its own tsconfig). Never import from `web/` into `worker/` or vice versa. Shared types (DomainId, SyncedBlock) are duplicated by design to keep the packages independent.

## @keyframes in globals.css
`spin` and `fadeInUp` are defined in `web/app/globals.css`. Reference them in inline `style` props as `animation: "spin 1s linear infinite"` — no Tailwind class needed.

## moveBlockTo target
`moveBlockTo(id, target)` accepts `"today" | "inbox"` — NOT "tomorrow". Old "tomorrow" callers must be updated to "inbox".
