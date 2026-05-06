# Features

## Status key
[ ] pending | [~] in progress | [x] done | [!] broken

## Locked decisions
- Stack: Next.js 15 PWA on Cloudflare Pages, fixed-properly update strategy
- Hard anchors: prayers only (Muslim World League calc, Hanbali madhab, Kiel coords)
- Domains: Business / Religion / Learning / Fitness / Home
- Capture: brain-dump stays in Notion; Claude routine bridges to app (no in-app capture in v1)
- Tabs: NOW · TODAY · DOMAINS · VISIONS

## Core (from Features.md + UX.md)

### Layer 1 — NOW
- [~] Single-focus screen: current task + Start/Pause/Resume + "Next:" line
- [ ] Soft top banner when prayer is 5 min out (no full takeover)
- [ ] Pause = freeze timer + preserve state; Resume = continue seamlessly

### Layer 2 — TODAY
- [~] Sequence of blocks (durations, not timestamps)
- [ ] Auto-shift forward on long/short/pause
- [ ] No "late" / "overdue" / "missed" — only "adjusted +X min", "paused", "continued"

### Layer 3 — DOMAINS
- [~] Each domain: momentum word, direction, last engagement, single next action
- [ ] No charts on default view
- [ ] Five seed domains: Business / Religion / Learning / Fitness / Home

### Layer 4 — VISIONS (Adam-added)
- [~] Big-picture goals, future ideas, improvement threads
- [ ] Card grid, motivating visual, no list overload
- [ ] Seeded from Tasks dump: Webuild, Jarvis, Brain, Dr. Lashin, life plan, etc.

### Routine engine
- [ ] Named routines (durations only)
- [ ] Assign routines to weekdays
- [ ] Engine instantiates today's flow each morning

### Elastic time engine
- [~] Block: `{ id, title, domain, duration_min, status, started_at?, accumulated_ms, order }`
- [~] Anchor: `{ time, kind, label }`
- [~] Recompute pass on every state change

### Cloud routine (deferred to v2 — bridge via Claude subscription, not Worker)
- [ ] Daily Claude routine reads designated Notion DB
- [ ] Categorizes flagged items into domains
- [ ] Pushes today's block list into the app's persistence
- [ ] Adam wakes up to a ready plan

### Notifications (deferred to v2)
- [ ] Web Push: prayer 5-min warning, block start
- [ ] Never streaks, never guilt

## v1 prototype (today)
- [~] All 4 screens render with seeded data
- [~] NOW screen Start/Pause/Resume works
- [~] Elastic time engine with localStorage persistence
- [~] Prayer times displayed (Aladhan API, Kiel, Hanbali)
- [~] PWA installable with proper update strategy
- [ ] Deployed to Cloudflare Pages

## Build order
1. Static UI shell + 4 screens with mock data
2. Elastic time engine wired into NOW + TODAY
3. Prayer times integration
4. PWA manifest + service worker with version check
5. Cloudflare Pages deploy
6. (Later) Claude-routine Notion sync
7. (Later) Push notifications
