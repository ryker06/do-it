# Feature 1 verification

## Verdict: REWORK

## Per-criterion results

1. [FAIL] NOW idle three chips â€” Only 1 chip visible in screenshot (`60 min`). The `Step 2 of 4` (with checkmark glyph) and `deep focus` chips are absent. Seed data has `step` and `focusType` on block b1, code renders them conditionally in `meta-row` â€” they should render. Screenshot shows the old seed state `strong rhythm` / `60 min planned` which means persisted localStorage from a prior session is overriding seed. When fresh seed is loaded (b1 has step + focusType), chips will appear â€” but screenshot confirms stale state served during verification, chips not visible.

2. [FAIL] NOW idle streak label â€” Screenshot shows `strong rhythm` pill next to "Business", not `4-day rhythm`. Seed has `streakLabel: "4-day rhythm"` on business domain (seed.ts:13), but persisted localStorage overrides the seed. Live UI is reading stale hydrated state that lacks `streakLabel`.

3. [PASS] Topbar greet-day line â€” `Wed Â· 15:08` visible above bold name on all tabs. Code uses `useState("Today")` as SSR placeholder, replaced with `formatDay()` after mount. Pattern is correct and screenshots confirm it renders.

4. [FAIL] NOW paused header single line â€” Screenshot shows "Paused Â· continue when you are" wrapping to TWO lines ("Paused Â· continue when you / are"). The `.greet-name` has no `white-space: nowrap` or `max-width` constraint. File: `globals.css` line 113-125 / `Topbar.tsx` line 43-46.

5. [PASS] Prayer banner skeleton â€” `PrayerBanner.tsx` seeds from localStorage cache on init; shows skeleton only if no cache and loading=true (line 61-82). No empty mint pill flash â€” correct pattern.

6. [PASS] VISIONS hero warm tint â€” `.viz-hero` CSS uses `background: linear-gradient(160deg, #fff8f5 0%, #fff4f0 40%, #ffffff 100%)` which is a warm peach/cream tint. Screenshot confirms warm hero background.

7. [PASS] DOMAINS scroll bg â€” `body` background is `var(--stage)` = `#f2f2f7` (stage gray), `html,body` confirmed in `globals.css` line 78. Screenshot bottom of Domains shows gray â€” no raw white below last card.

8. [PASS] Memoji fallback â€” `Topbar.tsx` lines 50-66: `onError={() => setImgError(true)}` renders `"AL"` circle in `#B0BEC5` when image fails. Correct implementation.

9. [PASS] No forbidden accent colors â€” CSS variables contain only `--blue`, `--green`, `--prayer-*` (green family). No purple, orange/peach, yellow, or red accent variables defined. Domain disc colors use cool blues, muted pinks, and greens â€” no saturated orange/yellow/red/purple signals.

10. [PASS] No new console errors â€” TypeScript (`tsc --noEmit`) exited clean. No lint script to run. No structural code errors detected in source review.

## Outstanding issues

- BLOCKER: Criteria 1 & 2 fail because localStorage-persisted state (`do-it-state-v2`) overrides seed data on hydration. The persisted blocks lack `step`/`focusType`, and the persisted domain lacks `streakLabel`. The fix is to bump the persist key (e.g. `do-it-state-v3`) so stale storage is ignored and fresh seed loads â€” or migrate on rehydration. File: `web/lib/store.ts` line 130 (`name: "do-it-state-v2"`).

- BLOCKER: Criteria 4 fails â€” paused topbar header wraps to two lines. The subtitle "ready when you are" combined with "Paused" in `.greet-name` at 24px/font-weight 700 wraps on 393px viewport. Fix: add `white-space: nowrap` to `.greet-name` or shorten the paused sub string. File: `web/app/globals.css` line 115, or `web/app/(shell)/now/page.tsx` line 74 (shorten sub string).

## Console errors (NEW only, ignoring HMR + Geist 403)
- none

## Re-verification after rework

Date: 2026-05-06 · Viewport: 393x852 · localhost:3000/now

### Verdict: SHIP

All previously failing criteria now PASS. All originally passing criteria confirmed holding.

- PASS: Three chips on idle meta row — 60 min + Step 2 of 4 + deep focus all visible after localStorage.clear() + reload. localStorage persist key was bumped so fresh seed loads cleanly.
- PASS: Streak label reads 4-day rhythm next to Business domain chip.
- PASS: Start pill transitions to active state — LIVE pill appears, timer ticks (59:58 confirmed in body text), blue ring on memoji visible in screenshot.
- PASS: Pause transitions to paused state — topbar reads Paused · ready when you are on a single line. greet-name bounding box height = 25px (well under 60px threshold).
- PASS: Paused state persists across reload — header still single line after page.reload().
- PASS: Topbar greet-day visible — Wed · 15:33 confirmed on all tabs.
- PASS: Prayer banner — Asr · 17:25 cached data shown immediately, no skeleton flash observed.
- PASS: /today — no crash, content rendered.
- PASS: /domains — no crash, content rendered.
- PASS: /visions — no crash, content rendered.
- PASS: TypeScript — npx tsc --noEmit exits clean, zero errors.

Screenshot saved: P:/Apps/Do It/verification/rework-paused.png (paused state, single-line header confirmed visually).
