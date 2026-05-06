# Stack

## Picked (recommendation — redirect via Q2/Q3/Q4 below)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router) as a PWA | One codebase, installs to iPhone/iPad/laptop home screen, feels native, free to host |
| Hosting | Cloudflare Pages (auto-deploy from GitHub) | Free, global edge, no cold starts |
| Background jobs | Cloudflare Workers + Cron Triggers | Free tier covers the 4am Notion sync 100x over |
| Database | Cloudflare D1 (SQLite at the edge) | Free 5GB, single-user scale forever, simple |
| Notifications | Web Push API + service worker | Free, works on iOS 16.4+ when installed as PWA, native-feeling |
| Auth | Cloudflare Access (Google login gate) | Free for personal use, no login UI in the app, locks domain to Adam's email |
| Notion sync | Notion API + Worker cron at 04:00 local | Pulls flagged tasks → categorizes into domains → seeds TODAY |
| Styling | Tailwind v4 + custom tokens extracted from `board/` references | Image-driven, not generic |
| State | Zustand (client) + tRPC for server calls | Minimal surface area, no Convex/Clerk complexity |
| Error monitoring | Sentry free tier | 5k events/mo is plenty |
| Analytics | None (intentional — no dashboards, no metrics theater) | Per UX spec |

## Cost target
$0/mo until Apple Dev account ($99/yr) becomes necessary. PWA defers that decision.

## Override of project default principles
`CLAUDE-principles.md` line 6 says default = Clerk + Convex + Stripe + RevenueCat. Overridden because Adam explicitly required free hosting and single-user scope. Stripe/RevenueCat irrelevant (no payments). Clerk replaced by Cloudflare Access. Convex replaced by D1 + tRPC.

## Open decisions (will lock when Adam picks)

**Q2 — Stack path.** I picked PWA-on-Cloudflare. Alternatives:
- A) PWA on Cloudflare *(recommended, default)*
- B) Expo + EAS native app (better notifications + iOS feel, but $99/yr Apple Dev + paid EAS tier eventually)
- C) Hybrid — PWA now, Expo later when revenue justifies it (defer the decision; same code path 80% reusable if we keep state portable)

**Q3 — Auth.** I picked Cloudflare Access.
- A) Cloudflare Access — Google login at the domain, no app login UI *(recommended)*
- B) Simple passcode env var — fastest, slightly less secure
- C) Clerk free tier — overkill for single user, but plays nicely if we ever multi-user

**Q4 — Notion sync direction.**
- A) Pull-only — Adam dumps to Notion, app reads at 4am *(simplest, recommended for v1)*
- B) Two-way — completed/paused state writes back to Notion so Notion stays the source of truth
- C) Hybrid — pull tasks from Notion, push only daily summary back at 11pm
