# UX Philosophy — Do It

The design system is the alphabet. UX is the sentence. This doc is the grammar — the rules every layout obeys before it ships.

## The North Star

**Adam should know what a screen is for in under 1 second, take action in under 3 seconds, and feel a small "yes" while doing it.** Anything that fails this test is rejected.

---

## Apple's Three Core Principles (HIG, distilled)

### 1. Clarity
Every element exists for a reason. Type is legible at every size. Decoration never competes with content. White space is structural, not residue. If a pixel doesn't earn its place, cut it.

→ **Test:** Cover the screenshot with your hand except one quadrant. Can you still tell what the screen is? If yes → clarity passes.

### 2. Deference
Content > chrome. UI gets out of the way of the actual thing. No heavy borders. No glass-liquid surfaces drowning the content. Translucency only where it serves spatial layering, not for "premium" decoration.

→ **Test:** What's the most visually loud element on the screen? If it's UI chrome (a button, a divider, a frosted bar), demote it. If it's content (a vision identity line, a goal phrase, a today block), pass.

### 3. Depth
Hierarchy through layering, not through borders. Realistic motion. Touch elements respond. Physics feel right. Modal layers cast soft shadows from "above" the surface.

→ **Test:** Does the layering tell you what's interactive vs ambient? If everything's flat, depth fails.

---

## The 7 Cognitive Heuristics (every layout passes ALL of these)

### A. The 1-Second Rule (most important)
Adam opens the screen. Within 1 second — before any scroll, before any thought — he sees the THING that surface is about. **`WORKFLOW.md` §7 specifies the 1-second visual for every surface.** If your layout doesn't surface that instantly, you've failed the most important test.

### B. Hick's Law (fewer choices = faster decisions)
Every screen has ONE primary action (ink pill). Maybe one secondary (ghost). That's it. Tertiary actions live in Cmd+K, in a drawer, or are removed.
→ **Cap:** ≤2 visible call-to-action pills per screen.

### C. Miller's 7±2 (chunk content)
A screen shows ≤5 information chunks above the fold. A "chunk" is a card, a section, or a clearly bounded element. More than 5 = cluttered = slow comprehension.
→ **Test:** Count the distinct chunks visible without scroll. If >5, cull or group.

### D. Fitts's Law (tap target sizing)
Frequent actions = bigger + closer to the thumb (mobile) or pointer rest (desktop). Rare actions can be smaller. Minimum tap target: 44×44 (Apple HIG).
→ **Implication:** "+ block" on TODAY is big and bottom-thumb-reachable. "Remove" affordances stay small and hidden until intent is shown (long-press or hover).

### E. Recognition over Recall
Don't make Adam remember. Show him. Domains have visible glyphs and color tints. Goals show their identity line, not just "Goal #7." Active block has a blue ring, not a label.
→ **Test:** Could you read the screen with your peripheral vision? Recognition surfaces look right at a glance. Recall surfaces require staring.

### F. Aesthetic-Usability Effect
A beautiful screen is *perceived* as more usable, even when functionally identical. Soft shadows, generous whitespace, premium typography, and a single moment of playfulness (one rotated chip per screen, one dimensional illustration per priority surface) — these earn trust before any feature is touched.
→ **Implication:** Don't let an ugly screen ship "because it works." Ugly = perceived broken.

### G. The Single-Glance Test (the hardest)
Show the screen for 200ms (literally — flash a screenshot to yourself). What did you see? If it's a confused blur of cards and labels, you have too much going on. If you saw "today's lift, 3 sets in" or "vision: 100kg deadlifter, 8 weeks left" — you're there.

---

## The Satisfaction Principle

"Premium playful Apple" — Adam's exact phrase. Beautiful is necessary but not sufficient. **A screen must feel satisfying to interact with.** That's:

1. **Micro-interactions everywhere small.** Tapping a habit dot doesn't just toggle — it fills with a 200ms ease-out, dot grows briefly, settles. Logging a goal value flashes the echo line "logged 96kg. → 100kg coming." for 2 seconds, fades.
2. **Soft, premium motion.** No bouncy springs. No cartoon overshoot. iOS-native cubic-bezier(.32,.72,0,1) at 240-280ms is the house easing.
3. **Materials that respond.** Cards lift slightly on press (1px translate up + shadow grow). Pills depress on tap (1px translate down + shadow shrink). Inputs get a calm focus ring, not a hard outline.
4. **One signature playful element per surface.** Examples: NOW = the geometric flame illustration. JAR = the dimensional jar SVG. WISHLIST = the rotated priority pill. DOMAINS = the asymmetric tile sizes. ONE per surface — never two.
5. **Sound is silent.** No haptics, no ding-on-success. Visual feedback only. (Adam never asked for sound; don't add it.)

---

## Apple's Hidden Craft (the things that look easy but aren't)

These are the small disciplines that separate "looks like an Apple app" from "looks like an app trying to look like an Apple app."

### Type
- Letterspacing tightens as size grows: -0.02em at 18px, -0.025em at 24px, -0.03em at 36px+. Body stays at 0 or +0.005em.
- Use SF Pro **Display** ≥20px, **Text** below. iOS auto-swaps; we set explicitly.
- Tabular numerics on data (`font-feature-settings: "tnum"`). Critical for any numeric column or stat.
- Line height 1.1 on display sizes, 1.4-1.5 on body, 1.6 on long-form prose.

### Color
- Use the calibrated palette. Don't invent. The point of a system is constraint.
- Tints come from cards/heroes, never the global background. Page bg = white.
- Accent (ink black) is reserved for the primary action. Use it sparingly — every black pill on a screen reduces the next one's authority.

### Spacing
- Two scales: **structural** (16, 24, 32, 48 — gaps between sections) and **micro** (4, 8, 12 — gaps within a card). Mixing scales = visual disorder.
- Card internal padding: 16-20px on mobile, 24-28px on desktop. Never less than 12.
- Top of viewport gets generous breathing room (24-40px from Topbar to first content).

### Hairlines
- 1px borders use `rgba(60, 60, 67, 0.1)` (the Apple HIG hairline color in the calibrated palette).
- Never use a darker border to "make it pop." If something needs emphasis, use elevation (shadow), not weight.

### Shadows
- Multi-stop shadows. Single-stop shadows look amateur. Always layer: a near 1-2px subtle stop + a soft 12-30px diffuse stop. The token system in `system-v3-final.html` already encodes this.

### Hierarchy via weight, not size
- Two adjacent type elements: vary by weight (700 vs 500), not by size. Only break that when going across hierarchies (display → body → caption). Within a single hierarchy, weight alone tells you what matters.

### Radii
- 8px for chips/pills.
- 14-16px for cards.
- 20-24px for hero cards.
- 50% for circles (memoji, avatars, glyph discs).
- Never use 4px or 6px — looks tight and cheap.

---

## The UX Rubric (mandatory checklist before any canon ships)

Every layout the design subagent produces must score ≥9/10 on this rubric. If <9, iterate.

| # | Test | Pass Criterion |
|---|------|----------------|
| 1 | 1-second visual | Looking at it for 1s, can I tell what this screen is for? |
| 2 | Primary action | Exactly one ink pill is the primary CTA. |
| 3 | Information chunks | ≤5 distinct chunks visible above the fold. |
| 4 | Cognitive layer purity | The screen only shows content from its assigned layer (per `WORKFLOW.md` §2). |
| 5 | Tap targets | All interactive elements ≥44×44 effective area. |
| 6 | Recognition | I recognize what each element does without reading any label. |
| 7 | Aesthetic | The screen is beautiful enough that I would screenshot it. |
| 8 | One playful moment | Exactly one signature element gives the screen character. |
| 9 | Mac desktop | Layout reorders intelligently for desktop (multi-pane where applicable, max-width content). |
| 10 | Customizability visible | Every customizable element has a discoverable affordance (≤1 second to find). |

---

## Anti-Patterns (instant rejection)

- Two or more ink pills competing on a single screen.
- Information chunks ≥6 above the fold.
- Layer leak (Layer 4 content on a Layer 0 surface).
- Every card has a colored background. (Use white paper as the default; tint sparingly.)
- "Read me" panels (paragraphs of explanatory text on a UI surface).
- Generic icons that could appear in any productivity app.
- Cards stretched to full width on desktop ≥1024px.
- Heavy frosted-glass surfaces as primary backgrounds.
- Italic / serif typography anywhere.
- Memojis other than `jay.webp?color=7` on Topbar.
- Personal greeting like "adam. ready when you are." (use motivational quote system).
- Beige / cream / sand as the page background.
- Bottom-up sheets / drawers.

---

## When in doubt

When two design directions both feel reasonable, pick the one that:
1. Removes more elements (less is more).
2. Increases the dominant element's prominence (signal stronger).
3. Reduces decisions Adam must make on this screen (Hick's law).
4. Better serves the surface's 1-second visual (per `WORKFLOW.md` §7).

If still tied → the simpler one wins.

---

## How design + engineering subagents must use this doc

**Design subagent:**
- Read this doc at the START of any canon work.
- Apply the UX rubric as a self-check at the end of each canon. State the score in the report.
- If score <9, iterate before declaring complete.

**Engineering subagent:**
- Read this doc at the START of any implementation wave.
- Apply the rubric to the LIVE rendered screen, not just the canon. The canon may pass; the implementation may regress.
- For micro-interactions (the satisfaction principle), allocate budget — don't skip them. Echo lines, focus rings, press states, soft easings are NOT polish — they ARE the experience.

**Reviewer subagent:**
- Use this doc as the rejection criteria during adversarial review.
- A canon or PR with rubric score <9 = automatic REWORK.

---

## The single thing that matters

If a screen is beautiful but Adam still has to think for 3 seconds about what it does → it failed.
If a screen is functional but Adam wouldn't screenshot it to a friend → it failed.

Both must be true: **instantly intelligible AND quietly beautiful.** That's the bar. That's Apple's craft.
