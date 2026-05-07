# Do It — Workflow Architecture

The information-architecture spec. Every layout decision references this document. The design system is settled; this fixes how surfaces hold together as a whole.

The failure mode this document fixes: **screens take too long to read.** Adam should know what a surface is for in one second, not five. That means each surface must have ONE focal answer, not a dashboard.

---

## Section 1 — The day in Adam's life

Ten moments. Each defines: trigger / surface / 1-second goal / 30-second goal / 5-minute goal.

### 04:30 — Morning brief
- **Trigger:** auto-prompt at first wake or 4:30, or Adam opens the app cold pre-fajr.
- **Surface:** TODAY with the morning-brief overlay on top.
- **1-sec:** today's shape — a phrase ("a steady learning day") + the first block name.
- **30-sec:** answer two prompts — "what's likely to push back" + "if it breaks, I resume by ___."
- **5-min:** scan the elastic flow, drag-reorder if needed, exit to NOW.

### 06:00 — First block
- **Trigger:** wake-anchor block kicks off.
- **Surface:** NOW.
- **1-sec:** current block title + next sub-step.
- **30-sec:** read the intention line, see prayer chip with countdown.
- **5-min:** execute first step iterator, mark sub-steps done, finish or extend.

### 09:41 — Mid-day check
- **Trigger:** Adam pulls phone out, glances.
- **Surface:** NOW (live block).
- **1-sec:** current block title + elapsed/duration phrase ("steady · 12 min in").
- **30-sec:** see what's next after this, prayer countdown.
- **5-min:** N/A — this is a glance moment, not a working moment.

### 12:30 — Dhuhr nearing
- **Trigger:** prayer chip enters its window.
- **Surface:** NOW with prayer chip expanded.
- **1-sec:** prayer name + minutes remaining + the next block after prayer.
- **30-sec:** mark prayed, see what resumes after.
- **5-min:** prayer logged, NOW reflows to the post-prayer block.

### 15:00 — Energy log
- **Trigger:** Adam notices state shift, taps Cmd+K or STATE quick-tap.
- **Surface:** STATE (modal sheet from MORE, or Cmd+K command).
- **1-sec:** five word chips — clear · focused · wired · drained · heavy.
- **30-sec:** tap one, done.
- **5-min:** scan recent pattern phrase if shown ("you run clearer when you eat earlier").

### 18:30 — Workout
- **Trigger:** workout block starts in NOW.
- **Surface:** WORKOUTS active tab (NOW step iterator delegates to it).
- **1-sec:** current exercise name + the set he's about to log.
- **30-sec:** log a set (reps, weight). Echo: "logged 5x110kg → 120kg coming."
- **5-min:** finish exercise, move to next, end workout.

### 21:00 — Evening audit
- **Trigger:** soft prompt at 21:00.
- **Surface:** REFLECT.
- **1-sec:** the three prompts, plain English. Nothing else.
- **30-sec:** voice-dump or type one prompt.
- **5-min:** all three answered, correction line auto-promoted to tomorrow's first-block intention.

### 22:30 — Wind down
- **Trigger:** Adam wants to see tomorrow.
- **Surface:** TODAY in tomorrow-preview mode.
- **1-sec:** tomorrow's first block + the day-shape phrase.
- **30-sec:** scan tomorrow's flow, see prayer anchors.
- **5-min:** drag-reorder, set tomorrow's first-block intention manually if not auto-set.

### Throughout — Capture
- **Trigger:** any moment, any surface. Cmd+K (desktop) or hold-to-talk (mobile).
- **Surface:** Cmd+K palette overlay.
- **1-sec:** input cursor, recent commands.
- **30-sec:** type or speak — "note: <body>" / "log state drained" / "add to jar" / "schedule run tomorrow."
- **5-min:** N/A — capture must take ≤10 sec or it failed.

### Throughout — Hydrate / quick log
- **Trigger:** Adam drinks water, weighs in, etc.
- **Surface:** HEALTH quick-tap from MORE, or Cmd+K verb.
- **1-sec:** the three cards (sleep · hydration · body) with current values.
- **30-sec:** tap a glass, log a weight.
- **5-min:** N/A — single-tap surface.

**The 1-second goal drives layout.** Whatever a moment's 1-sec answer is, that's the only thing allowed above the fold.

---

## Section 2 — Cognitive layers

Every surface gets exactly one layer. A surface's layer determines what content is allowed on it.

- **Layer 0 — daily anchors.** Open the app, see this without searching. **NOW · TODAY.** Both are nav-primary. No layer 4-6 content allowed inside them.
- **Layer 1 — quick taps.** One tap from anywhere. Single-action surfaces. **STATE log · JAR add · INBOX capture · WATER tap.** All Cmd+K-addressable. Modal or sheet, not destination.
- **Layer 2 — daily review.** 1-3x/day. **REFLECT · MORNING BRIEF · prayer chip expansion.** Surfaces that exist to close a loop, not to browse.
- **Layer 3 — weekly review.** 1-2x/week. **WEEK arc · GOALS (logging) · WEEKLY REVIEW.** WEEK is nav-primary; the rest live in MORE.
- **Layer 4 — month-scale.** Visited monthly+. **VISIONS · ROUTINES · MONEY overview · INSIGHTS · WISHLIST.** All in MORE.
- **Layer 5 — knowledge / archive.** Browsed, not edited daily. **COOKIE JAR · KNOWLEDGE heatmap · NOTES · YESTERDAY · PEOPLE.**
- **Layer 6 — admin.** Set-and-forget. **SETTINGS · profile · manifest · routine builder details.**

**The rule:** Layer 0 surfaces never carry Layer 4-6 content. NOW shows the block, period — not a sidebar of visions, not a money snapshot. TODAY shows today's flow + prayer anchors, not a vision deadline tile.

This is the failure-mode fix. Most of the existing clutter is Layer 4-6 content leaking into Layer 0 surfaces.

---

## Section 3 — Information architecture (revised)

### Bottom nav (mobile) / sidebar rail (desktop)
Four primary destinations. No more.

1. **NOW** — Layer 0
2. **TODAY** — Layer 0
3. **WEEK** — Layer 3
4. **MORE** — index of layers 1–6

Cmd+K is global, surface-agnostic, replaces deep nav.

### MORE — culled to first-class only

Current MORE: 19 tiles, 6 groups. Cut to **12 tiles in 5 groups.** Everything else accessible only via Cmd+K.

- **DO** — Inbox · Templates · Cmd+K hint
- **TRACK** — Habits · Health · Workouts · State (quick chip)
- **KNOW** — Visions · Goals · Insights · Notes · Cookie Jar
- **LIFE** — People · Money · Wishlist · Meal
- **TEND** — Domains · Routines · Reflect · Weekly Review · Prayer

### Cmd+K only (NOT in MORE)
Knowledge heatmap (sub-view of Domains), Yesterday, Books, Brag book legacy alias for Cookie Jar, Focus modes, Knowledge graph, Settings (still memoji-tap). These exist but are not first-class destinations — they don't earn a tile.

### Settings access
Memoji top-right of Topbar → /settings. Always. Don't put Settings in MORE — that's redundant.

### Why this works
12 tiles fit on one screen on mobile without scroll. Five groups give thematic recall ("where do I log my lift" → TRACK). Cmd+K is the relief valve for power users — anything not in MORE is one keystroke away.

---

## Section 4 — Notes / Knowledge base

### Purpose
Personal note-taker. Pure capture and retrieval. Adam's running thoughts, not journal entries, not insights, not reflections.

### Distinct from existing surfaces
- **Insights** = tested principles with status (`captured · testing · adopted · discarded`). Things Adam wants to *become*.
- **Reflections** = end-of-day audit (three prompts). Closed-loop daily artifact.
- **Cookie Jar** = proof of hard wins. Auto-captured from blocks.
- **Notes** = open scratch. Anything Adam wants to write down that doesn't fit the above.

**Decision: Notes stays separate from Insights.** Reasoning: an insight has a lifecycle (testing → adopted). A note doesn't — it's stable text. Forcing notes into the insight lifecycle creates ceremony where there shouldn't be any. Adam's voice-dump capture pattern needs a frictionless target without status fields.

### Data shape
```ts
Note {
  id: string
  title?: string          // optional; if blank, derive from first 60 chars of body
  body: string            // markdown-lite (bold, italic-replaced-with-weight, lists, quote, link)
  tags: string[]          // free-form, lowercase
  domainId?: DomainId
  visionId?: VisionId
  blockId?: BlockId       // attached to a block during NOW capture
  pinned?: boolean
  createdAt: ISO
  updatedAt: ISO
}
```

### Surface — NOTES
- **Mobile:** list view (paper cards, one per row). Tap → detail/editor (full screen). Plus button top-right opens composer.
- **Desktop:** 2-pane. Left = list (search + filter by tag/domain). Right = editor. Pinned notes stick to top.
- **List item:** title (or first 60 chars of body) · 2-line preview · tag chips · timestamp phrase.
- **Editor:** single text area, markdown-lite. No formatting toolbar — keyboard shortcuts only.

### Capture
- Cmd+K verb: `note: <body>` → instant create, optionally tag inline (`note: idea for vision #business`).
- NOW long-press: "note about this block" → creates Note with `blockId` attached.
- Inbox: voice capture defaults to block; long-press toggles to note.

### Relationship to other surfaces
- Vision detail → "notes on this vision" inline list (filtered by visionId).
- Domain detail → same, by domainId.
- Block detail (in TODAY history) → notes attached to this block.
- No cross-attachment to Goals, Routines, People — keep relationships shallow. If Adam needs a note on a person, attach via tag.

### What it's NOT
Not journal entries. Not insight candidates. Not a wiki with backlinks. Not AI-summarized. Pure text in, same text out.

---

## Section 5 — Prayer integration

### Existing model
Prayer ANCHORS = 5x/day windows that bend the elastic day. Prayer chip on NOW shows next prayer + countdown. TODAY renders prayers as soft tinted bands behind block flow.

### What "tracking" means here
Adam said "prayer tracker." The minimum viable depth:

1. **Per-prayer mark.** Tap prayer in TODAY band or chip-expanded → mark prayed (default state when window passes without action = unmarked, NEVER "missed" or red).
2. **Today's row visible inside chip-expanded state on NOW.** 5 dots horizontal: filled = prayed, hairline = pending or passed-unmarked. Same calm grammar as routine dots — never red.
3. **Weekly view inside Prayer surface.** 7×5 grid of dots, "kept this week · 33 of 35" calm phrase. No streak.

### Decision: Prayer is a dedicated surface in MORE → TEND.

Reasoning: the prayer chip on NOW handles glance + log (1-tap mark). But Adam will want a *weekly* read — was he steady this week — which is a Layer 3 question. The chip can't carry that without becoming cluttered. A Prayer surface owns the historical/pattern view; the chip stays slim.

Prayer surface contents (single-column, calm):
- Today's row (5 dots).
- Weekly grid (7×5, last 4 weeks scrollable).
- Calm phrase: "kept this week · 4 weeks steady."
- No streak counter. No graphs. No fire emojis.

Prayer chip on NOW retains: next prayer, countdown, tap-to-expand (shows today's row + mark).

---

## Section 6 — Mac desktop architecture

The current desktop = stretched mobile + sidebar rail. Adam wants Mac-app feel. The fix:

### Window structure
- **Full-bleed.** No embedded device frame, no center-column iframe look. The web app *is* the Mac app.
- **Sidebar rail LEFT, fixed 240px.** Logo top, four primary nav rows (NOW · TODAY · WEEK · MORE), a hairline, then a small "recent" stack of last-3 visited surfaces. Bottom: memoji avatar + "settings" link.
- **Title bar TOP, 44px.** Hairline bottom only, no shadow. Left: app name "Do It" in SF Pro Display Semibold 16px. Right: Cmd+K affordance ("⌘K · jump to anywhere"), then memoji 28px linking /settings.
- **Content area** centered with surface-specific max-width. NEVER full-bleed cards on a 1920px monitor.

### Surface max-widths
- NOW: 720px (single focal block, generous)
- TODAY: 880px (single column, leaves room for elastic timeline + anchor band)
- WEEK: 1100px (week arc benefits from horizontal real estate)
- MORE: 960px (5 group sections, 2-3 tiles wide)
- Notes editor: 760px (readable line length)
- Visions/Goals detail: 1100px (master-detail 2-pane)
- Domains: 1040px (5 cards in bento)

### Multi-pane (master/detail) surfaces
List + detail side by side. List is 360-400px left; detail fills right.

- **VISIONS** — list of visions left, vision detail (identity, goals, notes) right.
- **GOALS** — list of goals (grouped by vision) left, goal detail right.
- **INSIGHTS** — filter rail (status tabs, tag filter) left, insights content right.
- **PEOPLE** — list of people left, person detail right.
- **NOTES** — list left, editor right.
- **KNOWLEDGE heatmap** — calendar grid left, day-detail right.
- **MONEY** — section tab rail left (Subs · Out · In), content right.

### Single-column surfaces
- NOW, TODAY, MORE, JAR, REFLECT, STATE, MORNING BRIEF, PRAYER, ROUTINES (until builder is opened, then 2-pane).

### Window chrome
No traffic lights (web app, not native). The title bar's hairline + left-aligned app name + right-aligned controls is the Mac echo.

### Surface-specific top toolbar
Inline below title bar where applicable. Examples:
- NOTES: search input · tag filter · sort dropdown · "+ note" pill (right).
- VISIONS: filter (active/archived) · "+ vision" pill.
- GOALS: filter by vision · sort by deadline · "+ goal" pill.
- PEOPLE: search · filter by role · "+ person."
- MONEY: month picker · category filter.

NOW, TODAY, WEEK, REFLECT, STATE, JAR, MORE — no toolbar. The surface speaks for itself.

### Keyboard shortcuts (essential)
- `Cmd+K` — palette
- `Cmd+1` / `Cmd+2` / `Cmd+3` / `Cmd+4` — NOW / TODAY / WEEK / MORE
- `Cmd+N` — context-aware new (note in NOTES, block in TODAY, goal in GOALS, person in PEOPLE)
- `Cmd+/` — show all shortcuts overlay
- `Esc` — close overlay or back one level
- `Space` (in NOW) — pause/resume current block
- `Enter` (in NOW) — mark current sub-step done
- `Cmd+S` — save draft (notes editor, goal logging)

### What desktop adds that mobile doesn't
2-pane master/detail. Inline toolbars. Hover states. Cmd+K as primary capture. Persistent sidebar (no nav switch animation).

### What desktop deliberately doesn't add
No multi-window. No floating panels. No side-drawer over content. Sidebar + content + (optional) detail pane. Three columns max.

---

## Section 7 — Each surface's "1-second visual"

The lens: **"When Adam opens this surface, the THING he sees in 1 second is ___."** If the answer requires more than one phrase, the surface is over-spec'd. For each, what to KEEP / MOVE / REMOVE.

### NOW
**1-second visual:** the current block title + the next sub-step.
- KEEP: title hero, sub-step text, intention line (small under title), prayer chip, big primary CTA (start/done/next).
- MOVE: vision tag → secondary chip cluster only, never above title. Domain chip stays (rotated -7deg accent OK).
- REMOVE: any aggregate stats. Any "today's progress" phrase. Any list of upcoming blocks beyond "next: <name>." No domain momentum hints.

### TODAY
**1-second visual:** the time-of-day phrase + the active block ringed.
- KEEP: elastic time blocks as paper cards, prayer anchor bands behind, rotated "now" chip on active card, drag-reorder.
- MOVE: morning brief becomes a top overlay strip (collapsible), not a permanent header.
- REMOVE: domain summary tiles. Vision deadline pulls. Money snippets. ANY layer-4 content that drifted in.

### WEEK
**1-second visual:** the week's compounding phrase + this week's keep count.
- KEEP: 7-column arc, daily dot/phrase per domain, "this week vs four weeks ago" top strip.
- MOVE: per-day reflect access → tap a day to expand its summary.
- REMOVE: charts. Numeric scores. Any "you missed X." Replace with calm phrase or omit.

### DOMAINS
**1-second visual:** the 5 domain discs as a bento — color tells which is humming.
- KEEP: top row of 6 domain discs (per board mapping), momentum word per domain.
- MOVE: knowledge heatmap → sub-view, tap a domain to drill.
- REMOVE: per-domain block lists (violates spine). Numbers anywhere visible.

### VISIONS
**1-second visual:** Adam's current identity statement on the focal vision + one deadline pull phrase.
- KEEP: identity line big, hero card, list/grid of visions, deadline countdown in plain language.
- MOVE: nested goals to a "goals" section inside each vision detail (not on the index).
- REMOVE: progress bars (all). Numeric % complete.

### GOALS
**1-second visual:** the focal goal's identity line + "current → target by deadline."
- KEEP: identity line, currentValue → targetValue phrase, hairline track, deadline phrase, log button.
- MOVE: history → expandable section in detail.
- REMOVE: charts of any kind. Color-coded urgency.

### REFLECT
**1-second visual:** the three prompts.
- KEEP: three plain prompts, one input area each (voice or type), submit pill.
- MOVE: yesterday's reflection → tap-to-show, never visible above current prompts.
- REMOVE: streak. "You've reflected X days." Any framing.

### STATE
**1-second visual:** five word chips.
- KEEP: five word chips horizontally, recent pattern phrase below (only after 14 logs exist).
- MOVE: full state history → "see all" link to a sub-view.
- REMOVE: any chart. Numeric mood scale. Sliders.

### COOKIE JAR
**1-second visual:** the conqueror line at top + a recent entry.
- KEEP: conqueror line, scroll of one-line entries, capture-prompt on qualifying completions.
- MOVE: filters → tag chips at top, optional.
- REMOVE: counts of jar entries. Any "you've added X this month."

### INBOX
**1-second visual:** the captured items list, latest at top.
- KEEP: voice-captured blocks as rows, swipe-to-schedule.
- MOVE: bulk-actions to selection mode, not always-visible.
- REMOVE: domain auto-tag preview clutter — tag is implicit, just shows as a small chip.

### MORE
**1-second visual:** five group labels with their tiles below each — Adam knows where TRACK is without reading.
- KEEP: 5 groups (DO · TRACK · KNOW · LIFE · TEND), 12 tiles total, calm uppercase labels, hairline dividers.
- MOVE: any deep nav → into the destination surface itself.
- REMOVE: 7 tiles from the current 19. Cmd+K hint replaces them.

### NOTES (new)
**1-second visual:** the list of notes (paper cards) with the most recent on top.
- Desktop: list + editor 2-pane.
- KEEP: search bar, tag filter, list, editor.
- REMOVE: word counts. AI-summary banners. Backlinks (deferred).

### PRAYER (new dedicated surface)
**1-second visual:** today's 5-dot row + weekly grid.
- KEEP: today's row, weekly grid, "kept this week" phrase.
- REMOVE: streaks. Red. Notification settings (those go in /settings).

### MONEY
**1-second visual:** "this month: in X · out Y · net Z" calm phrase.
- KEEP: overview phrase, three drill cards (subs, out, in).
- MOVE: detail tables → tap a card to drill.
- REMOVE: red/green flashes. Urgency framing. "Overspending" vocab.

### PEOPLE
**1-second visual:** list of people, each with relation + last-touched phrase.
- KEEP: list with role-based auto-resurface, voice-memo per person.
- MOVE: detail view to right pane (desktop) or full screen (mobile).
- REMOVE: counts. CRM-vocab. "Engagement scores."

### WORKOUTS
**1-second visual:** today's lift name + the next set to log.
- KEEP: two tabs (today's lift, PRs/history), set-logger inline.
- REMOVE: charts. Volume calculations as primary metric.

### HEALTH
**1-second visual:** three calm cards stacked — sleep, hydration, body.
- KEEP: three cards with one current value + one trend phrase each.
- REMOVE: rings beyond hydration's subtle one. Health-app-style dashboards.

### HABITS
**1-second visual:** today's habit row, each with a tap-dot.
- KEEP: list of habits, today's dot tap-to-mark, calendar dot grid (8 weeks) on detail.
- REMOVE: streak counters. Red missed dots. % completion.

### ROUTINES
**1-second visual:** list of routines, each with identity line + "humming · 6 weeks steady."
- KEEP: list with phrase, builder accessed via tap-into-detail.
- REMOVE: routine taxonomy clutter.

### INSIGHTS
**1-second visual:** the focal insight text + its status chip.
- KEEP: list filtered by status, capture button, after-14-days prompt.
- REMOVE: tag clouds. "Most-cited."

### KNOWLEDGE HEATMAP
**1-second visual:** the calendar grid with calm tints.
- KEEP: grid, hover for day-detail.
- REMOVE: GitHub-green. Counts as primary.

### WISHLIST
**1-second visual:** want vs bought split.
- KEEP: two-column or two-tab layout, mark-bought.
- REMOVE: priority tags. "Days waiting" counters.

### MEAL
**1-second visual:** today's food blocks + the shopping list derived.
- KEEP: today's food slice + auto-derived shopping list link.
- REMOVE: macro tracking unless Adam asks.

### MORNING BRIEF
**1-second visual:** the two prompts.
- KEEP: friction prompt + resume-plan prompt, voice-or-type.
- REMOVE: yesterday's brief above current.

### YESTERDAY
**1-second visual:** yesterday's blocks list + the reflection summary.
- KEEP: timeline of done blocks, reflection echo.
- REMOVE: judgment phrases.

---

## Section 8 — Guard rails

Hard rules. Apply to every surface, every screen state, every viewport.

1. **One-second rule.** Every surface answers ONE question. The 1-second visual above is non-negotiable. If the focal answer isn't readable in one second, the surface fails.

2. **≤5 information chunks** visible without scroll. A chunk = a card, a phrase, a chip group. More than 5 = clutter, ship to a sub-view or a tap-to-expand.

3. **One ink primary action per surface.** All other actions are ghost / hairline. NOW's primary is start/done. TODAY's primary is "add block" (only when needed). REFLECT's is "save." If you're tempted to add a second ink button, you're wrong.

4. **Hierarchy via spacing + weight, not dividers.** No striped tables. No section dividers every 80px. Whitespace is the divider.

5. **Surface-specific max-width on desktop.** Never full-bleed. The width listed per surface in Section 6 is the contract.

6. **No layer leak.** Layer 0 surfaces never carry Layer 4-6 content. Period.

7. **No data the user didn't ask for.** Don't compute weekly volume on a workout-set screen. Don't preview tomorrow's blocks on NOW. The surface shows what its 1-sec answer needs, plus the secondary action it enables. Nothing else.

8. **No streaks. No red. No guilt vocab.** Locked in TONE.md. Doesn't change.

9. **Memoji + Topbar are sacred.** Don't touch.

10. **Calm phrase over number, always.** Numbers exist; typography keeps them small. "humming · 6 weeks steady" not "85%."

---

End.
