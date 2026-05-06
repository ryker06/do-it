# Bulk verification — Features 2-6

## Verdict: SHIP

## Routes status (one line each)
- /onboarding: PASS — loads, "Do It · One thing at a time" hero, Continue CTA, pagination dots
- /now (idle): PASS — Morning greeting, anchor pill (Asr), task card, Start button, "+ thought" pill, memoji top-right
- /now (active): PASS — Start click transitions to "In flow" timer state, Pause button, Done early / +15 min actions, LIVE badge
- /now → BrainDumpSheet: PASS — "+ thought" pill opens sheet with mic, domain chips, text input
- /now → SearchOverlay: PASS — magnifier triggers #search hash, overlay shows search field + suggested actions grid
- /today: PASS — timeline blocks, ANCHOR row, DONE/AHEAD stats, memoji, Yesterday link navigates to /yesterday
- /today → block-create modal: PASS — FAB (bottom-right "+") opens "ADD BLOCK" sheet with domain picker + duration + Today/Inbox options
- /today → block-sheet modal: PASS — tapping a block row opens sheet with Start now / Mark done / Move on / Dismiss actions
- /today → /yesterday: PASS — "Yesterday" link navigates correctly
- /domains: PASS — 5 domain cards, NEXT action rows, memoji, tab bar correct (DOMAINS highlighted)
- /domains/business: PASS — detail view, RHYTHM card, VISIONS IN THIS DOMAIN grid, NEXT action + Add as block CTA
- /visions: PASS — hero "Plan for Life" + 6-card grid, 7 threads count, memoji, VISIONS tab active
- /visions → hero tap → /visions/v7: PASS — navigates to vision detail for Plan for Life
- /visions → grid tap → /visions/v1: PASS — navigates to Webuild vision detail
- /visions/v1/edit: PASS — edit form with PREVIEW card, title/tagline/description fields, domain pill selector, Delete vision
- /settings: PASS — Adam avatar + memoji, PRAYER section (5 toggles), DOMAINS list, Done button
- /settings/domains/business: PASS — bottom sheet over blurred bg, momentum/direction pills, next-action + streak-label inputs, Save changes
- /routines: PASS — "Your week" calendar strip, 4 routine cards with day badges, duration, domain icons
- /routines/r1 (via card tap): PASS — "Weekday morning" detail, M–F days checked, 5 blocks with domain icons, Save routine CTA
- /yesterday: PASS — "Tuesday · May 5" header, 0 blocks card, DOMAINS TOUCHED row, Add a reflection CTA, Back to today link

## Outstanding issues
- MINOR: /routines/morning (arbitrary slug) renders "New routine" empty state instead of 404 — expected fallback but could confuse deep-linkers. No fix needed unless deep-linking is required.
- MINOR: /visions/v7 detail shows domain badge "LEARNING" in topbar — v7 is "Plan for Life" (cross-domain spine) so it should probably show no domain or "ALL DOMAINS". Low visual impact.
- MINOR: /settings domain rows show subtitle "60 min default · briefcase" (icon-name leak) vs canon which has no subtitle in that list. Harmless data string.
- MINOR: /now active state timer starts at 59:59 (counts down from 60 min, 0% done shown) — canon shows 42:18 with 30% done progress bar fill. Progress bar fill and percentage appear not to animate in headless snapshot (expected — real-time only).

## Console errors (NEW only)
- none

## Notes
- All 14 routes return HTTP 200 with no runtime crashes, no new console errors.
- Tab bar (NOW/TODAY/DOMAINS/VISIONS) present and correct active state on all shell routes.
- Memoji (jay color-7, sky-blue circle) present top-right on all main routes.
- Domain/vision navigation uses JS onClick (not anchor hrefs) — both work correctly in browser.
- Static check: `npx tsc --noEmit` exits 0, no errors. No lint script configured.
- Screenshots saved to P:\Apps\Do It\canon\screenshots\
