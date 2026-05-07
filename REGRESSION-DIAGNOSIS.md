# REGRESSION-DIAGNOSIS -- v3.5 (a9fcb23) vs v3-final (4309688)

Generated: 2026-05-06. Screenshots at verification/diagnosis/mobile and desktop.

---

## 1. Executive Summary

### Top 5 Most Painful Regressions

1. Desktop: entire app is a 460px-wide column with 410px of white void on each side. Every surface at 1280px. One CSS source-order bug causes this.

2. Master/detail panes (Goals, Notes, People, Insights, Money) structurally broken. md-detail is only 100px wide. In Insights hero text renders one word per line.

3. TODAY opens to a fullscreen Morning Brief modal blocking the timeline on every load. Next.js hydration error badge appears bottom-left on desktop.

4. DesktopTitlebar is in layout.tsx but CSS hides it unconditionally. Shell has padding-top:44px for it anyway, creating a 44px dead zone at top of every desktop surface.

5. Sidebar has 28 items across 7 groups. Avatar footer cut off on shorter screens.

### Single Architectural Decision That Caused Most Damage

CSS source order bug in globals.css. Mobile .shell base rule (max-width:460px; margin:0 auto) at line 1940 is declared AFTER @media (min-width:1024px) block at line 1505. Both have identical specificity -- later wins. At 1280px: max-width:none overridden back to 460px, margin-left:240px overridden back to auto. Browser computes shell = 460px wide, centered, with 410px margins each side. Every desktop surface breaks from this one mistake.

---

## 2. Per-Surface Table

| Surface | Mobile | Desktop | Specific issues | Severity |
|---------|--------|---------|-----------------|----------|
| /now | GOOD | MAJOR -- 460px column, 410px dead zone right | Mobile solid. Topbar quote duplicates page heading on desktop. | MAJOR |
| /today | BROKEN -- Morning Brief modal blocks timeline; hydration error badge | BROKEN -- Same modal plus error. Timeline blurred. | Hydration SSR mismatch. Default-open modal blocks every load. | BLOCKER |
| /domains | GOOD | MAJOR -- 460px column, bento narrower | Content correct, layout squeezed | MAJOR |
| /visions | GOOD -- cover cards, linked goals | MAJOR -- 460px single column. Camera icon clips edge. | Missing desktop layout for cover cards. | MAJOR |
| /goals | GOOD | BLOCKER -- md-list 320px, md-detail 100px. Detail non-functional. | md-detail 100px unusable | BLOCKER |
| /week | GOOD | MAJOR -- 460px column, left-shifted | Layout squeeze, content correct | MAJOR |
| /more | GOOD | MAJOR -- 460px tile grid, wastes 2/3 of viewport | MAJOR |
| /habits | GOOD | MAJOR -- heatmap rows clip at right edge of 460px shell | MAJOR |
| /workouts | GOOD | MAJOR -- form plus empty state, large white void below | MAJOR |
| /health | GOOD | MAJOR -- 3-card stack, bottom cards cut by viewport | MAJOR |
| /state | GOOD | MINOR -- dimensional chips fit in 460px | MINOR |
| /insights | GOOD | BLOCKER -- md-list 280px, md-detail 140px. Hero text: 1 word/line. Unreadable. | BLOCKER |
| /jar | GOOD | MINOR -- cookie jar hero centered, readable | MINOR |
| /knowledge | GOOD | MAJOR -- heatmap grid overflows 460px shell, clips | MAJOR |
| /reflect | GOOD | MINOR -- prompts fit in column | MINOR |
| /people | GOOD | BLOCKER -- md-list 320px, md-detail 100px. Person detail overflows. | BLOCKER |
| /money | GOOD | BLOCKER -- Tabs as vertical list in md-list. md-detail 100px. Transaction names truncated mid-word. | BLOCKER |
| /wishlist | GOOD | MINOR -- cards in 460px column | MINOR |
| /routines | GOOD | MINOR -- dot-card grid fits | MINOR |
| /notes | GOOD | BLOCKER -- md-list 320px, md-detail 100px. Note body not renderable. | BLOCKER |
| /prayer | GOOD | MINOR -- prayer rows plus 4-week grid visible | MINOR |
| /inbox | GOOD | MINOR -- list visible | MINOR |
| /meal | GOOD | MINOR -- logger visible | MINOR |
| /yesterday | GOOD | MINOR -- block history visible | MINOR |
| /settings | GOOD | MINOR -- rows visible, Done CTA looks mobile-native on desktop | MINOR |
---

## 3. Cross-Cutting Failures

### A. CSS Source Order Bug (Root of 90% of desktop damage)

globals.css declares two conflicting rules for .shell:
- Line 1505: inside @media (min-width: 1024px) -- sets max-width: none; margin-left: 240px
- Line 1940: outside media query (mobile base) -- sets max-width: 460px; margin: 0 auto

Because line 1940 appears LATER and specificity is equal, the mobile rule wins at all breakpoints. At 1280px: computed max-width = 460px, margin = 410px each side. Sidebar (240px) + shell (460px) = 700px, leaving 580px of dead white space.

Fix: Move the .shell and .shell-content mobile base rules to appear BEFORE the @media (min-width: 1024px) block. Zero component changes required.

### B. Master/Detail Panes -- 100px Detail Pane (Consequence of A)

With shell at 460px and 20px padding each side = 420px inner. md-list uses 280-360px, leaving 60-140px for md-detail. After bug A is fixed, shell fills ~1040px (1280 minus 240 sidebar), inner ~800px, detail pane gets ~520px -- appropriate for all 5 md surfaces.

### C. DesktopTitlebar Ghost Padding

DesktopTitlebarWrapper is in layout.tsx. CSS has .titlebar-desktop { display: none } outside any media query -- always hidden. Shell still has padding-top: 44px in desktop media query (line 1515). Result: 44px dead zone at top of every desktop screen.

### D. TODAY Hydration Error

SSR vs. client mismatch on /today. Morning Brief reads client-only state (Date.now() or localStorage) during server render, producing different output from client hydration. Next.js dev overlay visible in all desktop /today screenshots.

### E. Mobile is Production-Quality

All 25 mobile screenshots render correctly. Topbar, bottom nav, content layers, touch targets all work. The regression is 100% desktop-only. Do NOT modify mobile CSS during repair.

---

## 4. What v3.5 Got Right (Preserve These)

- Notes surface: list+detail, pinned section, search -- structure correct
- Prayer surface: 5-dot marking + 4-week grid -- correct and legible on mobile
- JAR auto-capture: 2+ pauses or 1.5x duration trigger -- logic correct
- TODAY Morning Brief: the concept is right; only default-open behavior is wrong
- State patterns computed: dimensional chips on /state work
- Yesterday filter fix: shows only prior-day done blocks
- MEAL surface: logger structure built
- Goals, People, Domains, Visions: detail navigation wired (RightDrawer), navigation logic works
- Keyboard shortcuts: KeyboardShortcuts component functional
- CmdK v3: verb-prefix tag pills, keycap hints, recent commands all functional
---

## 5. Surgical Fix Priority List

| Rank | Surface | Issue (concrete) | Proposed surgical change | Severity |
|------|---------|-----------------|--------------------------|----------|
| 1 | GLOBAL | globals.css: .shell base rule (line 1940) after desktop media query (line 1505), overrides max-width: none and margin-left: 240px | Move .shell and .shell-content mobile base rules to BEFORE @media (min-width: 1024px) block | BLOCKER |
| 2 | GLOBAL | After fix 1, shell fills 1040px raw -- content stretches full width | Add max-width: 720px; margin: 0 auto to desktop shell override inside 1024px media query | BLOCKER |
| 3 | GLOBAL | DesktopTitlebarWrapper in layout.tsx but CSS always hides it; padding-top: 44px creates 44px dead zone | Remove DesktopTitlebarWrapper from layout.tsx AND remove padding-top: 44px from desktop shell override | BLOCKER |
| 4 | /today | Morning Brief auto-opens every load; hydration error | Gate Morning Brief on localStorage briefSeenDate; only open if date != today. Resolves SSR mismatch. | BLOCKER |
| 5 | Goals, Notes, People, Insights, Money | After fix 1, md-detail gets ~520px -- verify all 5 surfaces | Visual check after fix 1. If md-list too wide, reduce from 360px to 280px fixed. No component rewrites. | MAJOR |
| 6 | /insights | Hero insight text large font forces word-wrap even in wide pane | Reduce hero font-size to 22px, add word-break: normal | MAJOR |
| 7 | /money | Tabs render as vertical list items in md-list | Move tabs to horizontal row above transaction list, outside md-layout split | MAJOR |
| 8 | /visions | Desktop renders as single long column of cover cards | Add CSS grid: 2 columns with gap: 20px inside desktop shell. No new components. | MAJOR |
| 9 | /habits | Heatmap rows clip at right edge of 460px shell | After fix 1, verify. If still clips, add overflow-x: auto to heatmap row container. | MAJOR |
| 10 | /knowledge | Knowledge heatmap overflows 460px shell | After fix 1, verify. If grid exceeds 720px, reduce cell size to 8px. | MAJOR |
| 11 | Sidebar | 28 items, avatar footer cut on shorter screens | After fixes 1-3, reassess. If still cluttered, collapse TEND and OTHER groups by default. | MAJOR |
| 12 | /now | Topbar quote appears twice on desktop (topbar component + page heading) | Add display: none to .topbar-quote inside 1024px media query | MINOR |
| 13 | /settings | Done CTA is blue text link -- looks like mobile sheet header on desktop | Hide Done button on desktop via media query | MINOR |
| 14 | /workouts | Large empty void below form on desktop | After fix 1, wire PRs/history tab to render below form | MINOR |
| 15 | /today | Morning Brief card is phone-sized when shell expands | After fix 4, add max-width: 560px to brief card for desktop centering | MINOR |