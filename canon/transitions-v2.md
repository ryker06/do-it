# Do It — Motion Language v2

One premium feel across the app. No bouncy springs. Steel-calm easing.

## Signature easing
**`cubic-bezier(.32, .72, 0, 1)`** — Apple iOS easing. Used for every page transition, drawer, modal, list reorder.

Secondary:
- `cubic-bezier(.4, 0, .2, 1)` — only tiny micro-interactions (button press feedback).
- `linear` — only progress bars and timer ticks.

NEVER spring physics. NEVER `ease-in-out`.

## Page transition
**240ms cross-fade + 4px slide.**

Between primary surfaces (NOW ↔ TODAY ↔ WEEK ↔ MORE):
- Outgoing: `opacity 1→0`, `translateY(0)→translateY(-4px)`, 240ms.
- Incoming: `opacity 0→1`, `translateY(4px)→0`, 240ms.
- 40ms overlap.

Drilling INTO a surface (MORE → Habits):
- Push: incoming slides 12px from right, outgoing fades to 0.6 + scales to 0.98. 280ms.

## Drawer (right-side)
- Width 380px. Slides from right edge.
- Open: 280ms `cubic-bezier(.32,.72,0,1)`. Translate `+100%` → `0`.
- Scrim fades 240ms `linear` from 0 → 0.32 opacity.
- Close: 220ms reverse.

## Modal (center, Cmd+K, Morning Brief)
- 180ms fade in + 6px slide-down (`translateY(-6px)` → `0`).
- Backdrop fade 160ms.
- Close: 140ms reverse.

## Tap / press feedback
- Buttons: `scale(0.97)` on `:active`, 80ms.
- Cards: `scale(0.99)` + shadow softens, 100ms.
- Rows: background flashes to `var(--inset)` 120ms.

## Hover (desktop)
- Card: `translateY(-1px)`, shadow intensifies 20%, 200ms.
- Row: background → `var(--inset)`, 160ms.
- Sidebar item: pill background fades in 160ms.

## Drag (TODAY reorder)
- Pick-up: lifts with shadow ramp 200ms, scale 1.02.
- Drop: snap 240ms `cubic-bezier(.32,.72,0,1)`.
- Other rows shift 220ms ease.

## Inline edits
- Tap time chip on TODAY row → row expands 200ms to reveal time wheel inline.
- No popover. The row becomes the editor.

## Timer (NOW active)
- Digits update on the second (tabular-nums prevents jitter).
- Progress bar fills `linear` per second.
- Pause: icon morphs 180ms.

## Toast / completion echo
- Block done → bottom toast: "lift logged. → 220kg deadlift coming."
- Slides up 8px, fades 240ms. Holds 2.6s. Exits up 4px + fades 280ms.

## Cmd+K open
- ⌘K → backdrop fade 160ms + modal slide-down 6px + fade 180ms.
- Input auto-focused.

## Heatmap cell
- Tap pulses (`scale 1 → 1.06 → 1`, 240ms).
- Right drawer opens with day's captures.

## Long-press
- 320ms hold. Visual: dot scales 1.0 → 1.12 with shadow ramp.
- Release early = normal tap. After 320ms = action menu.

## Reduced motion
`@media (prefers-reduced-motion: reduce)` → durations clamp to 1ms. Cross-fades = instant. Timer continues.

## Never
- Bottom-up sheets.
- Spring overshoots.
- Confetti / particles / sparkles.
- 3D / page-flip transitions.
- Color-pulse attention animations (blue live-dot exception only).
