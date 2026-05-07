# Voice & Language

Adam's directive: **conqueror type, without weird language.** Short factual statement + future-self reminder.

## Background (HARD RULE)
**Default surface = white (#FFFFFF or near-white #FBFAF8 max).** No beige. No cream. No sand. No warm earth tones as a base.

Tints from board/ are for accents (cards, tinted strips, illustration panels) — never the global background. The skincare.jpg / Layout 5 cream tones inspire micro-accents, not the page bg.

When a hero card uses a tint (mint/pink/blue), the surrounding screen stays white so the tint pops.

## Header (HARD RULE)
Topbar = the v2 working pattern Adam likes:
- **Motivational quote line** LEFT (SF Pro Display Semibold, calm ink color) — short single-line quote that rotates daily or session-based. Examples: "discipline equals freedom." / "you become what you repeat." / "today is the lift." / "the mountain doesn't care." / "show up. that's the move." Pick from a curated list of ~30. NOT a personal greeting like "adam. ready when you are." — that pattern is dead.
- **Memoji 28-32px FAR RIGHT** (Link to `/settings/`)
- **Memoji source = `https://www.tapback.co/api/avatar/jay.webp?color=7`** — this is THE Adam memoji (black hair + black beard + glasses). NEVER substitute a different memoji. NEVER show a woman / random face. Adam called this out specifically.
- White surface, hairline bottom border (no frosted blur as primary state)
- Slim height (~56-64px)
- Memoji is non-negotiable. Always present.

## App identity (HARD RULE)
- **App name: "Do It"** (exact). manifest.json `name` and `short_name` = "Do It".
- App icon: needs to feel premium Apple — clean glyph on a solid or subtle gradient background. Current icon-192/512.png may need refresh during engineering implementation.

## Typography (HARD RULE)
**SF Pro Display / SF Pro Text ONLY. NO serif. NO italic. NO cursive. EVER.**
- The journal-app reference was a CREATIVITY-LEVEL example, not a font choice. Its Georgia-italic intention strips do NOT apply to Do It.
- Keep memoji on Topbar (top-right). Memoji is part of the design system, never remove.
- Keep all existing memojis throughout the app. Don't strip them anywhere.
- Board/ images are THE design standard. Journal-app shows what creativity LOOKS like, but every visual decision calibrates against board/.

## The pattern (use this everywhere)
**`<short fact>` → `<future version reminder>`**

- "Lift logged. → 220kg deadlift coming."
- "Block done. → 4-day workweek man in training."
- "Saved. → next move waiting."
- "Synced 12 blocks. → today's flow ready."
- "Captured. → nothing slips."

Not every line needs the arrow — empty states, labels, buttons stay terse. But anywhere a **completion** or **save** happens, end with a calm pull toward the man Adam is becoming.

## Yes
- Short. Verb-noun.
- Plain English. Direct.
- Future-self pull (not present-tense pep)
- Quiet motivation. Calm steel.

## No
- Therapy-speak: "your journey", "honor your needs"
- Hustle-bro: "crush it", "grind", "let's go!!!", fire emojis
- Corporate: "engagement", "optimize your day"
- Flowery: "your beautiful day awaits"
- Punctuation theatre: !!! · ??? · ALL CAPS
- Philosophy verbiage: "premeditatio", "microscope brief", "solitary check" — say it plain

## Ratios
- Section labels: 1-2 words, lowercase. ("today" not "TODAY OVERVIEW")
- Empty states: 3-7 words. ("nothing yet · capture something")
- Buttons: 1-3 words. ("done · next" / "skip" / "start")
- Toasts: 5-9 words, can include the future-self pull.
- Tooltips: 5-12 words max.

## Examples
- ❌ "Welcome back, Adam! Ready to make today count?"
  ✅ "Adam. ready when you are."
- ❌ "Great job! You crushed your workout!"
  ✅ "lift logged. → 220kg deadlift coming."
- ❌ "Your reflection has been saved successfully."
  ✅ "saved. → tomorrow sharper."
- ❌ "It looks like you haven't logged any insights this week."
  ✅ "no insights this week."
- ❌ "Don't forget to drink water!"
  ✅ "water."
- ❌ "Your premeditatio brief for today"
  ✅ "today's friction · resume plan"
