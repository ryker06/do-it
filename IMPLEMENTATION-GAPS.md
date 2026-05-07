# IMPLEMENTATION-GAPS.md
Engineering-wave input — audit date: 2026-05-06

## Executive Summary

| Category | Count |
|---|---|
| DEAD AFFORDANCE | 14 |
| DEAD ROUTE | 3 |
| HALF-WIRED | 9 |
| CANON ELEMENT MISSING | 18 |
| DESKTOP REGRESSION | 2 |
| TOTAL | 46 |

## Gaps by Surface (Alphabetical)

### DOMAINS
1. DEAD ROUTE — /domains/[id] route exists (ClientView.tsx) but domain cards on /domains have no Link or onClick. Tapping does nothing. Fix: wrap each card in Link.
2. CANON ELEMENT MISSING — Canon shows a "next move" inline edit per domain card. Not in implementation.

### GOALS
3. DEAD AFFORDANCE — "+ goal" button has no onClick handler. Store has addGoal(). Fix: open a creation sheet.
4. DEAD AFFORDANCE — Goal cards are NOT tappable (no Link, no onClick). Detail route /goals/detail?id= exists and works. Fix: wrap each goal card in Link.
5. CANON ELEMENT MISSING — Filter chips (all / fitness / business / learning) shown in canon are not implemented.
6. HALF-WIRED — Inline log persists to store but no navigation to detail after log, no persistent echo.

### HABITS
7. HALF-WIRED — Long-press rested uses 320ms setTimeout. Unreliable on mobile (pointercancel fires first). Fix: increase threshold or add explicit rest toggle.
8. CANON ELEMENT MISSING — Canon shows cadence/domain tag and streak chip per habit row. Neither rendered.

### HEALTH
9. CANON ELEMENT MISSING — Canon shows a sleep-detail drawer on tap of the sleep hero card. Only inline log in implementation.
10. CANON ELEMENT MISSING — Canon shows a 7-day body weight sparkline. Only single latest value shown.

### INBOX
11. HALF-WIRED — Items submit and appear. Moving to today works but no confirm/cancel UX and no visual feedback.
12. CANON ELEMENT MISSING — Domain chip not displayed visually on inbox item rows (inferred in code but hidden from UI).

### INSIGHTS
13. HALF-WIRED — Status pill cycles correctly. "Still testing" button passes undefined testedNotes — minor bug.
14. CANON ELEMENT MISSING — "Link to vision" affordance on insight cards not implemented.

### JAR (Cookie Jar)
15. CANON ELEMENT MISSING — Canon shows a large centered "+ add win" pill prominently. Existing input is buried.

### KNOWLEDGE (Heatmap)
16. DEAD AFFORDANCE — Tapping a heatmap cell does nothing. Canon implies tap to log a knowledge block for that day.

### MEAL
17. DEAD ROUTE — /meal page file exists but is an empty shell. No data model, no interactions.
18. DEAD ROUTE — /meal/shopping sub-route file exists but not linked from /meal and renders nothing.

### MONEY
19. DEAD AFFORDANCE — Outflow and inflow tabs link to sub-routes that are empty shells.
20. HALF-WIRED — Reads transactions/subscriptions from store but no add affordance exists. Canon shows a "+ add" pill.
21. CANON ELEMENT MISSING — Canon shows income vs expense bar chart. Only numbers rendered.

### MORE
22. DEAD AFFORDANCE — "templates" tile: disabled:true, renders at 45% opacity, unclickable.
23. DEAD AFFORDANCE — "cmd+k" tile: href="#" navigates to nothing. Fix: open the CmdK overlay.

### NOW
24. HALF-WIRED — BrainDump sheet submits correctly to inbox store but no echo/confirmation shown on NOW screen after dismissal.

### PEOPLE
25. DEAD AFFORDANCE — Person cards on /people list have NO Link or onClick. Detail route /people/[id] exists and is fully implemented. Fix: wrap each card in Link.
26. CANON ELEMENT MISSING — CoverImagePicker not imported or used in people detail. Avatar cannot be changed via the UI.
27. CANON ELEMENT MISSING — No "touch today" one-tap button on person detail. Only a date input field exists.

### REFLECT
28. HALF-WIRED — Correction field 03 should create a tomorrow block per canon spec. Implementation only saves text; no block created.

### ROUTINES
29. CANON ELEMENT MISSING — Canon shows drag-to-reorder for blocks inside the routine builder. No dnd-kit in routine block list.

### STATE
30. HALF-WIRED — Patterns section always shows 3 identical hardcoded phrases. Never computed from actual stateLog data.

### TODAY
31. HALF-WIRED — Morning Brief overlay dismissal is abrupt with no animation.
32. CANON ELEMENT MISSING — No inline at-position "+ block" quick-add within timeline. Only end-append via BlockCreateSheet.

### VISIONS
33. CANON ELEMENT MISSING — No "+ vision" create affordance on the visions list page. createVision() exists in store but is never called from UI.

### WEEK
34. CANON ELEMENT MISSING — Canon shows a full 7-day visual timeline with domain color bands. Implementation is a plain per-day block list.

### WISHLIST
35. CANON ELEMENT MISSING — Bought items not in a distinct visual section; they render greyed in the same list.

### YESTERDAY
36. HALF-WIRED — Shows ALL-TIME done blocks, not just yesterday's. No date scoping. Fix: filter by dateISO === yesterday.

### CMDK
37. DEAD AFFORDANCE — recentIds array is tracked in memory and never displayed. Canon shows a recents section.
38. CANON ELEMENT MISSING — NLP-style composite command parsing not implemented. Only prefix-match on label strings.

### SETTINGS / DOMAINS DETAIL
39. HALF-WIRED — Domain tap in Settings uses router.push but no visual chevron or pointer cursor to indicate tappable.

### DESKTOP REGRESSIONS
40. DESKTOP REGRESSION — People list cards: no pointer cursor, no hover, no navigation on desktop.
41. DESKTOP REGRESSION — Goals list: "+ goal" dead button is the first click a desktop user makes. Silent failure.

---

## Top 20 Priority Fix List (Ranked by User Pain)

| Rank | Surface | Gap | Category |
|---|---|---|---|
| 1 | GOALS | Goal card not tappable — detail route unreachable | DEAD AFFORDANCE |
| 2 | PEOPLE | Person cards not tappable — detail route unreachable | DEAD AFFORDANCE |
| 3 | GOALS | + goal button does nothing | DEAD AFFORDANCE |
| 4 | DOMAINS | Domain cards not tappable — [id] route unreachable | DEAD ROUTE |
| 5 | VISIONS | No + vision create affordance on list | CANON ELEMENT MISSING |
| 6 | MORE | cmd+k tile navigates to dead href | DEAD AFFORDANCE |
| 7 | WEEK | Full visual timeline not implemented | CANON ELEMENT MISSING |
| 8 | MEAL | Entire surface is an empty shell | DEAD ROUTE |
| 9 | PEOPLE | Avatar change broken — CoverImagePicker not wired | CANON ELEMENT MISSING |
| 10 | YESTERDAY | Shows all-time done blocks not just yesterday | HALF-WIRED |
| 11 | STATE | Patterns always hardcoded, never computed from data | HALF-WIRED |
| 12 | GOALS | Domain filter chips missing | CANON ELEMENT MISSING |
| 13 | CMDK | Recents tracked but never displayed | CANON ELEMENT MISSING |
| 14 | MONEY | No add transaction affordance | HALF-WIRED |
| 15 | REFLECT | Correction does not create tomorrow block | HALF-WIRED |
| 16 | TODAY | No inline at-position block add in timeline | CANON ELEMENT MISSING |
| 17 | ROUTINES | No drag-to-reorder inside routine block list | CANON ELEMENT MISSING |
| 18 | HABITS | Long-press rested unreliable on mobile | HALF-WIRED |
| 19 | WISHLIST | Bought items not visually separated | CANON ELEMENT MISSING |
| 20 | INSIGHTS | Link-to-vision affordance missing on insight cards | CANON ELEMENT MISSING |
