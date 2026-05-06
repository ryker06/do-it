# Bulk Build Report

**Session:** 14 routes + wiring  
**TypeScript:** `npx tsc --noEmit` — 0 errors  

## Built

| File | Status |
|---|---|
| `app/loading.tsx` | Done — splash orb + wordmark |
| `app/page.tsx` | Done — root redirect (onboarding / now) |
| `app/onboarding/page.tsx` | Done — 3-step: welcome, city, done |
| `app/(shell)/routines/[id]/page.tsx` | Done — day toggles, block list, save |
| `app/(shell)/domains/[id]/page.tsx` | Done — momentum hero, stat strip, visions rail |
| `app/(shell)/visions/[id]/page.tsx` | Done — threads list, related blocks |
| `app/(shell)/visions/[id]/edit/page.tsx` | Done — live preview, domain picker, danger zone |
| `app/(shell)/settings/domains/[id]/page.tsx` | Done — bottom sheet, momentum/direction pills |
| `app/(shell)/yesterday/page.tsx` | Done — dusk hero, timeline, domain dot strip |
| `components/BlockSheet.tsx` | Done — 2x2 action grid |
| `components/BlockCreateSheet.tsx` | Done — domain picker, duration segmented control |
| `components/BrainDumpSheet.tsx` | Done — mic button, textarea, domain tags |
| `components/SearchOverlay.tsx` | Done — frosted glass, grouped results, highlight |

## Wiring

- TODAY: idle block tap → BlockSheet; + FAB → BlockCreateSheet; yesterday link → /yesterday
- NOW: + thought pill → BrainDumpSheet; anchor-interrupt (5 min warning + prayer-time mint hero); day-complete state
- DOMAINS: card tap → /domains/[id]; empty state with warm orb
- VISIONS: hero + grid taps → /visions/[id]; empty state with sage orb
- TOPBAR: magnifier → SearchOverlay via `#search` hash

## Fixes

- `doneBocks` typo → `doneBlocks` in yesterday page  
- Duplicate `color` key in visions detail page removed  
- `Block` has no `movedFrom` — yesterday simplified to done-only timeline

## Reviewer rework

**MAJOR 1** — `routines/[id]/page.tsx`: added not-found guard after hook calls. Arbitrary slug renders "Routine not found" + "Back to Routines" link matching visions pattern.

**MAJOR 2** — `store.ts`: added `onboardingComplete: boolean` (default `false`) + `completeOnboarding()` action + `userCity: string` field. Version bumped 4→5. Migrate sets `onboardingComplete: true` for any existing persisted state so users don't re-see onboarding on upgrade. `app/page.tsx` now reads `useDoIt.getState().onboardingComplete` instead of `localStorage` key check. Splash placeholder ("Do It." text) renders during redirect.

**MAJOR 3** — `onboarding/page.tsx`: city input now wired to store via `setUserCity(city)` called in `finish()`. `completeOnboarding()` called before `router.push("/now")`. Prayer fetch still hardcoded to Kiel; city persists in store for future use.

**WARN dead buttons** — "Preview tomorrow" routes to `/today`. "Keep going" gets `type="button"` + `aria-label`. BrainDumpSheet mic gets `type="button"` + `aria-label="Record voice note (coming soon)"`. SearchOverlay suggested cards converted from `<div>` to `<button>` with typed actions: "Add block"→/today, "Visions"→/visions, "Routines"→/routines, "Settings"→/domains.

**WARN a11y** — `role="dialog"` + `aria-modal="true"` added to BlockSheet, BlockCreateSheet, BrainDumpSheet, SearchOverlay outer containers. Escape key listener with cleanup added to all four.

**WARN moveBlockTo** — `scheduledFor: "today" | "tomorrow"` added to `Block` type. `moveBlockTo` now sets this field so tomorrow blocks are filterable.

**TypeScript:** `npx tsc --noEmit` — 0 errors after all changes.
