# Adam's verdict on v3
> if anything v2 is better. just fix what i said there you removed too much. back to v2 please. and my memoji should be a man with beard and black hair

# Direction
Revert the baseline to **v2** (the version Adam approved as a big improvement). v3 stripped too much richness and felt austere. Apply ONLY the targeted fixes Adam listed in his v2 feedback. Do not strip visual interest, do not minimize aggressively, do not collapse layouts to bare essentials.

## v2 looked like (reference screenshot at `P:\Apps\Do It\canon\v2-baseline.png`)
- White card surfaces on soft gray stage
- "Wednesday · 9:24 — Morning, Adam · let's start" greeting with Adam's memoji top-right
- Prayer banner with sun glyph
- Domain header showing memoji/avatar + "Business · Strong rhythm · 4 days in a row"
- Big bold black title "Write the Q2 launch brief" (placeholder text — replace with "Webuild — finish Dr. Lashin landing draft" if you want real seed data)
- Chips: "60 min · Step 2 of 4 · deep focus"
- Black pill CTA "Start · 60 min"
- "After this" stack with the next block
- Active state: subtle pastel halo top, big tabular timer, green progress, "Pause · hold time" + "Done early" / "+15 min"

## Apply ONLY these fixes (Adam's v2 feedback)
1. **Premium harder.** v2 was 80% there. Push the typography, the spacing rhythm, the card stacking, the micro-shadow language until it reads like it belongs in iOS 18 system apps. Don't strip — refine.
2. **One confusing color → resolve.** Adam said his eyes didn't know where to look. Diagnose the offender (was likely the green Business memoji circle competing with prayer banner sun), pick a more cohesive accent strategy. You can have multiple tints if they're all from the same warm or same cool family. Just no random clash.
3. **Adam's memoji top-right** — must depict a **man with black hair AND black beard**. The Tapback API is deterministic per seed string. Try seeds like `adam`, `lashin`, `adamlashin`, `mahmoud`, `adam.l`, `adamL`, until you land on black-hair-black-beard. If the API doesn't reliably give that, document which seeds you tried and recommend the closest match.
4. **No memojis for tasks** — replace task/domain memojis with the colored-circle + emoji pattern (peach + 🚀 for Business, mint + 🕌 for Religion, lavender + 📚 for Learning, rose + 🥊 for Fitness, sky + 🏠 for Home). Memojis are reserved for the user (Adam) only — top-right avatar slot.
5. **Bottom nav: last two icons don't fit.** Pick a consistent icon family across all four tabs (NOW, TODAY, DOMAINS, VISIONS). They should obviously be siblings.
6. **Layout consistency across states.** v2's idle and in-flow versions had different chrome positions (greeting top, nav at different heights). Lock the outer shell — same greeting, same prayer pill, same tab bar position — only the hero card morphs between idle/active.

## Do NOT
- Strip the warm pastel halo behind the active hero (v2 had it subtle, that was good)
- Reduce to monochrome austerity
- Remove the "After this" stack
- Drop the consistency line ("4-day rhythm" / "Strong rhythm" — Adam approved that addition)

## Output
- `P:\Apps\Do It\canon\now.html` (overwrite)
- Copy to `P:\Apps\Do It\web\public\canon-now.html`
