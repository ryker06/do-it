# Do It — Adam-Specific Feature Roster (v2, Adam-approved direction)

## Adam in 4 lines
1. Building total-domain dominance — combat, cognition, wealth, religion, family, health, all integrated.
2. Wants concrete, trackable, deadline-driven surfaces — not philosophy abstractions.
3. Thinks in identity, not outcomes ("I am a 220kg deadlifter") — every screen pulls toward the future version.
4. Conqueror type. Plain language. No weird vocabulary. No streaks-for-streaks.

## What this app must NOT be
- Habit tracker with streak guilt
- 12-mini-apps drawer
- Confetti / dopamine-loop app
- "Smart" AI app (no AI v1)
- Pomodoro / GTD / Eisenhower reskin
- Red/yellow alarm system
- Score-flattens-domains-into-numbers

## Features (all kept, ranked by Adam's signal)

### 1. Deadline Goals (Adam's #1)
**Adam:** "I like deadlines, for example: in three months I'm gonna be a certain weight, have a certain amount of money. Then I can track whether I actually did that or not."

**Surface:** GOALS — new section inside VISIONS group, OR Goals as a sidebar on each Vision detail. Each Goal: target metric (weight / money / count / boolean), target date, current value, one identity line above.
**Data:** `Goal { id, visionId, identityLine, metricKind: 'weight'|'money'|'count'|'boolean', targetValue, currentValue, unit, deadlineISO, history: { dateISO, value }[] }`
**Interaction:** Tap goal → log current value (one number, voice or typed). Goal card shows: identity line big, "currentValue → targetValue by deadlineISO," delta phrase ("4kg from 100kg, 8 weeks left"). NO progress bars; words and a single hairline track.
**Pattern:** "fact → future-self." Every log echoes: "logged 96kg. → 100kg coming."

### 2. Identity line on every aim
**Adam:** "Always remind you of the future version that you're gonna be."

**Surface:** Visions, Goals, Routines all carry an `identity: string` — present-tense declarative. "I am a 220kg deadlifter." "I run a focused 4-day workweek." Read aloud silently every time the surface opens.
**Data:** `identity?: string` on Vision, Goal, Routine.

### 3. Cookie Jar
**Adam:** "Cookie jar sounds interesting."

**Surface:** Small surface in MORE → KNOW. Auto-captures unusually hard finished blocks (block paused 2+ times and finished, OR block ran ≥1.5x duration, OR Adam manually added). Browse = scroll of one-liners.
**Data:** `JarEntry { id, capturedAt, oneLine, blockId? }`
**Interaction:** Long-press a NOW block title when struggling → "open jar" → scroll past wins. Auto-prompt after qualifying completions: "add to jar?"

### 4. Evening Audit (refines REFLECT)
**Adam:** "Evening audit is nice if it can be incorporated."

**Surface:** REFLECT — three plain-English prompts (no philosophy words):
1. where did you fall short today?
2. where did you act well?
3. one specific correction for tomorrow.
**Data:** `Reflection { date, fell_short, acted_well, correction }`
**Interaction:** 21:00 soft prompt. Voice or typed. Correction auto-becomes tomorrow's first-block intention.

### 5. Compounding view on WEEK
**Adam:** "Compounding view, sure."

**Surface:** WEEK arc view — top strip: "this week vs four weeks ago." One sentence per active goal/vision. "deadlift: 3x/wk for 6 weeks · 92kg → 96kg."
**Data:** Computed live from Block + Goal history.
**Interaction:** Tap phrase → opens that goal/vision. No charts.

### 6. Habits (real surface — Adam restored from kill list)
**Surface:** HABITS in TRACK group. Daily binary tracker. Each habit: name, calendar dot grid (last 8 weeks — filled = done, hairline = missed; never red). Tap today's dot to log.
**Data:** `Habit { id, name, identity?, marks: { dateISO: 'done' | 'rested' }[] }`
**Note:** "Rested intentionally" is a valid mark, counts as kept. No streak counters.

### 7. Workouts (real surface — Adam restored)
**Surface:** WORKOUTS in TRACK group. Two tabs:
- **Today's lift** — sets/reps/weight log per exercise. Tap to log a set.
- **PRs / History** — best lifts ever, recent-session list, calm "PR last week" phrase.
**Data:** `Workout { id, dateISO, exercises: { name, sets: { reps, weightKg }[] }[] }`. Exercise library searchable.
**Pattern:** Each set logged echoes future-self: "log 5x110kg → 120kg coming."

### 8. Health (Sleep + Hydration + Body — Adam restored)
**Surface:** HEALTH in TRACK group. One screen, three calm cards:
- **Sleep** — last night hours + 7-day average phrase. Tap to log bed/wake.
- **Hydration** — today's glasses vs goal (default 8). Tap to add a glass. Subtle ring, not aggressive.
- **Body** — weight + waist + (optional) BF%. Tap to log. Trend phrase ("4kg lighter than 4 weeks ago").
**Data:** `SleepLog { dateISO, hoursSlept, quality?: 1-5 }`, `HydrationLog { dateISO, glasses }`, `BodyLog { dateISO, weightKg?, waistCm?, bfPct? }`

### 9. Knowledge heatmap (Adam restored)
**Surface:** Inside DOMAINS or as its own subscreen. Calendar grid heatmap of "knowledge engagement" per domain — count of insights captured + theory-mode blocks per day. Hover/tap a cell → that day's captures. Calm tints (no GitHub-green).
**Data:** Computed from existing Insights + Block.mode='theory' records.

### 10. Insights as personal codex
**Surface:** INSIGHTS in KNOW group. Each insight has status: `captured · testing · adopted · discarded`.
**Data:** `Insight { text, source, domainId?, visionId?, status, testedNotes? }`
**Interaction:** After 14 days in `testing`, prompt: "did this become you?" → adopted/discarded with one line of why.

### 11. State pattern phrases (refined — Adam's exact use case)
**Adam:** "I noticed I perform better when I eat earlier in the gym or something."

**Surface:** STATE — one-tap log (5 words: clear/focused/wired/drained/heavy). Pattern phrases appear after 14 logs ("you run clearer when you eat earlier" — exactly the kind of insight Adam mentioned).
**Data:** `State { ts, word, recentBlocks: BlockId[], recentMeals: BlockId[] }`. Pattern detection = simple correlation (no ML, just keyword + timing density).
**Interaction:** Tap STATE in MORE → 5 word chips, log instant. Patterns shown as plain sentences.

### 12. Routines as identity rhythms (refined)
**Surface:** ROUTINES — already in spine. Refinement: 8-week dot grid on each routine card, "humming · 6 weeks steady" phrase. Long-press missed dot → "rested intentionally" (counts as kept). Cadence builder supports week-of-month rules.
**Data:** Add `Routine.identity?: string` ("I am someone who trains daily").

### 13. Money (refined with domain tags)
**Surface:** MONEY in LIFE group. Already in spine. Refinement: every transaction tagged with a `domain` (fitness/learning/business/etc.) so DOMAINS shows "$ steady" or "$ heavy" line.
**Data:** Add `Transaction.domain?: DomainId`.

### 14. People (refined)
**Surface:** PEOPLE in LIFE group. Each person: relation, last-touched, one specific next move. Voice-memo per person on tap-and-hold (just transcription, no AI). Auto-resurfaces if quiet > role threshold (family 7d, mentor 30d, friend 14d).
**Data:** Add `Person.role?: 'family'|'mentor'|'training'|'team'|'friend'`, `lastInsight?: string`.

### 15. Wishlist (already scaffolded)
**Surface:** WISHLIST in LIFE group. Want / Bought split. Mark-bought auto-creates Money expense.
**Data:** Already in store.

### 16. Cmd+K (power user)
**Surface:** Global on desktop (Cmd+K), slide-from-right on mobile. Searches blocks, visions, routines, people, insights, goals, habits, workouts. Verbs: "start NOW", "log state drained", "add to jar", "log weight 96", "add to wishlist <item>".
**Interaction:** Type → fuzzy → Enter. No animations.

### 17. Today's intention (simplified from "microscope brief")
**Surface:** NOW — under the focal block title, a single optional `intention` line (≤80 chars). Tap to edit inline.
**Data:** `Block.intention?: string`
**Note:** Plain word "intention" — not "microscope."

### 18. Morning brief (simplified from "premeditatio")
**Surface:** TODAY — at first wake (or 04:30), a calm one-screen prompt: "what's likely to push back today?" + "if it breaks down, I resume by ___."
**Data:** `MorningBrief { date, friction, resumePlan }`
**Note:** Plain word "morning brief."

## Cross-cutting patterns

- **Every aim carries an identity line** — visions, goals, routines.
- **Every completion echoes future-self** — "fact → future version coming."
- **Words over numbers in user-visible surfaces** — momentum words on domains, calm phrases on goals/health/etc. Numbers exist but typography keeps them small.
- **No streaks. No red. No guilt.**
- **Voice in everywhere** (no AI on top — just transcription).
- **Cadence rules** apply to routines AND insight reviews AND people checkins.
- **Hidden craftsmanship** — long-press, Cmd+K, share-target, mid-NOW capture.

## Killed / deferred (final)

- **Solitary Check** — too niche, killed.
- **Microscope/premeditatio philosophy words** — replaced with "intention" / "morning brief."
- **T·A·F as primary feature** — kept as quiet phrase ("more reading than doing this week"), not a primary surface.
- **Brag book** — replaced by Cookie Jar.
- **Knowledge graph (force-directed)** — deferred; heatmap covers it.
- **Templates as a surface** — lives inside Routine builder.
- **Pomodoro / focus-mode timer** — killed; NOW is focus.
- **AI categorization, smart suggestions** — explicit no.
- **Goals as separate from Visions** — Goals nest UNDER each Vision; not a competing surface.

## Soul (one paragraph)
Quiet. Direct. Conqueror's. Every fact echoes a future-self pull. Words over graphs. Identity above outcome. Workouts and weights and water are tracked because that's how the man becomes who he says. Cookie jar holds the proof. Evening audit sharpens tomorrow. Cmd+K lets him strike anywhere. Premium the way a mechanical watch is premium — nothing extra, nothing missing. Walking through it should feel like the externalized version of the man Adam is becoming.
