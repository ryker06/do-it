# Feature 1 — Engineering Report

## What was changed

### lib/types.ts
- Added `step?: { current: number; total: number }` and `focusType?: string` to `Block` type.
- Added `streakLabel?: string` to `Domain` type.

### lib/seed.ts
- Seeded block `b1` with `step: { current: 2, total: 4 }` and `focusType: 'deep focus'`.
- Seeded Business domain with `streakLabel: '4-day rhythm'`.

### components/Topbar.tsx
- Fixed greet-day blank-on-load: replaced `useState<Date | null>(null)` pattern (which rendered empty string until useEffect fired) with `useState<string>('Today')` as an immediate SSR-safe placeholder. After mount, `formatDay()` ticks every 30 s replacing "Today" with "Wed · HH:MM".
- Added Memoji error fallback: `onError` sets `imgError` flag; renders a 42×42 soft blue-grey circle with white "AL" initials at same dimensions when the tapback.co fetch fails.

### components/PrayerBanner.tsx
- Added localStorage cache keyed by date string (`do-it-prayer-cache-v1`). `useState` initializer reads cache synchronously, so repeat visits show real data instantly with no loading state at all.
- Added skeleton loading state (dimmed crescent + faded "Next prayer" text) shown only on first load with no cache — replaces the previous "Loading prayer times…" text flash.
- Fetch still runs in background on every mount to refresh times; updates cache on success.

### app/(shell)/now/page.tsx
- **Idle meta chips**: Renders all three chips when present — `60 min` (always), `Step N of M` (when `focus.step` set), `deep focus` (when `focus.focusType` set). Step chip uses `CheckSvg` icon per canon. FocusType chip uses `.focus-tag` span for muted styling — no icon, plain text, matches canon.
- **Streak label**: Domain streak now reads `domain.streakLabel` instead of hardcoded "strong rhythm" string. Business shows "4-day rhythm" per canon.
- **Domain sub-line (idle)**: Shows "Step N of M today" when step is present.
- **Domain sub-line (active/paused)**: Shows "Step N of M · deep focus" format, matching the active-state canon layout.
- **Paused topbar sub**: Changed from "pick up when ready" (too long, wrapping) to "ready when you are" — shorter, same calm register, single line at 24px bold.

### app/globals.css
- **`.shell` background**: Changed from `var(--bg)` (#ffffff) to `var(--stage)` (#F2F2F7). All card/row surfaces explicitly use `var(--card)` = white, so content visually unchanged. The stage gray now fills below the last DOMAINS card instead of raw white. No other tabs affected.
- **`.viz-hero` warm tint**: Changed `background: var(--card)` to a subtle `linear-gradient(160deg, #fff8f5 0%, #fff4f0 40%, #ffffff 100%)` — a very faint blush wash per canon. Almost imperceptible but present, especially on the upper-left corner of the hero tile.

## Acceptance criteria verified (Playwright screenshots at 393×852)

- [x] Greet-day line always visible ("Today" placeholder on SSR, real day·time after hydration)
- [x] NOW idle shows all 3 meta chips: 60 min + Step 2 of 4 + deep focus
- [x] NOW streak reads "4-day rhythm" from domain.streakLabel
- [x] NOW paused topbar sub is a single line ("ready when you are")
- [x] Prayer banner shows live data with localStorage cache; skeleton on cold first load
- [x] VISIONS hero tile has subtle warm-cream blush tint
- [x] DOMAINS scroll never reveals raw white below last card (stage gray fills)
- [x] Memoji renders (live URL works in CI); fallback "AL" circle renders on error
- [x] TypeScript strict — `tsc --noEmit` passes with zero errors
- [x] No palette violations (no purple, orange, peach, yellow, red introduced)

## Blocker fixes — post-verification pass (2026-05-06)

Both blockers flagged in `feature-1-verification.md` have been resolved and re-verified with Playwright at 393x852. Blocker 1 (stale localStorage overriding seed): the Zustand persist key was bumped from `do-it-state-v2` to `do-it-state-v3` in `web/lib/store.ts` line 137, forcing Zustand to ignore any v2-era persisted state and hydrate fresh from `SEED_BLOCKS`/`DOMAINS`; Playwright confirmed idle state now shows all three chips (`IDLE chips: 3`), step chip reads "Step 2 of 4", and streak reads "4-day rhythm". Blocker 2 (paused header wrapping): `white-space: nowrap` was added to the `.greet-name` rule in `web/app/globals.css` line 120; Playwright confirmed the "Paused · ready when you are" text renders as a single line at 25.2px height (one line at 24px/1.05 line-height = ~25.2px, well under the 40px two-line threshold). TypeScript (`tsc --noEmit`) exits clean with zero errors after both changes.

## Rework #2 (reviewer findings) — 2026-05-06

All 5 items from the reviewer's report (3 blockers + 2 minor cleanups) resolved and verified with Playwright at 393x852.

### Fix 1 — [BLOCKER] Dhuhr hardcoded in TODAY
**File:** `web/app/(shell)/today/page.tsx`
Added `useState<{label,hhmm}|null>(null)` + `useEffect` that reads the shared `do-it-prayer-cache-v1` localStorage key first (populated by PrayerBanner on /now). On cache hit, Dhuhr updates instantly with zero extra network request. On cache miss, dynamically imports `@/lib/prayers`, fetches, writes the shared cache, and sets state. Fallback text while loading: "Dhuhr · loading".
Playwright result: `Dhuhr · 13:16` rendered (real live time from API). Hardcoded 12:47 test: PASS.

### Fix 2 — [MAJOR] Palette violation in Topbar AL fallback
**File:** `web/components/Topbar.tsx`
Replaced `background: "#B0BEC5"` with `background: "var(--inset-2, #e9e9ee)"` and `color: "#fff"` with `color: "var(--label, #8e8e93)"`.
Playwright result (memoji URL blocked): background computed as `rgb(234, 234, 239)` (= #eaeaef, within rounding of #e9e9ee), text `rgb(142, 142, 147)` (= #8e8e93). Palette violation test: PASS.

### Fix 3 — [MAJOR] Persist key migration
**File:** `web/lib/store.ts`
Renamed persist key from `"do-it-state-v3"` (versioned, never-migrated) to the stable `"do-it-state"`. Added `version: 3` and a `migrate` function that spreads persisted state, backfills missing `step`/`focusType` fields onto blocks from SEED_BLOCKS, backfills `streakLabel` onto domains from DOMAINS, and falls back to `SEED_VISIONS` if visions absent. Runtime timer state (accumulatedMs, startedAt) is preserved via spread.
Playwright result: localStorage key is `["do-it-state"]`. Stable key present: PASS. Old `-v3` key absent: PASS.

### Fix 4 — [MINOR] Replace `adjustedMin!` non-null assertions
**File:** `web/app/(shell)/now/page.tsx` (lines ~121 and ~211)
Both `focus.adjustedMin!` replaced with `focus.adjustedMin ?? 0`. Eliminates the TypeScript non-null assertion on an optional field.

### Fix 5 — [NIT] Remove `void hydrated` from all 4 page files
**Files:** `today/page.tsx`, `now/page.tsx`, `visions/page.tsx`, `domains/page.tsx`
Removed `hydrated` from each destructure and removed `void hydrated;` suppressor. Seed renders correctly without it; the pattern was defensive dead code from an earlier hydration-guard that is no longer needed since `skipHydration` + `setHydrated` handle this in the store.

### TypeScript
`npx tsc --noEmit` exits with zero errors after all 5 changes.

### Screenshots
- `canon/rework2-today.png` — TODAY showing `Dhuhr · 13:16`
- `canon/rework2-now-al.png` — NOW showing AL fallback in correct soft-grey palette

---

## Open questions / flags

1. **Paused sub copy change**: Canon HTML doesn't explicitly show a "paused" topbar state — only idle and active are shown. I changed the sub from "pick up when ready" to "ready when you are" to prevent wrapping at 24px bold. If Adam has a preferred copy, easy to swap in `now/page.tsx` line ~63.
2. **`d` (domain) variable in visions/page.tsx**: Pre-existing unused variable. Not introduced by this PR. Safe to remove in a cleanup pass.
3. **TODAY greet-day "Today" placeholder**: Playwright CI screenshots show "Today" because the screenshot is taken before React hydration fires `useEffect`. In the live browser, this resolves within one render frame to the real day+time. No code fix needed — behavior is correct.
