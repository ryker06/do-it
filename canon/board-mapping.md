# Board → Do It screen mapping

Every Do It surface gets calibrated against a specific board image. We **recreate the composition** of the board image with Do It content + locked palette. We do not invent — we translate.

| Do It screen | Template board image | What we copy | What we adapt |
|---|---|---|---|
| **system-v3-final** (style guide) | `Element 1.jpg` + `Element 3.jpg` + `Layout 4.jpg` | soft-shadow paper cards, dimensional layered card stacks, calm pastel bg, memoji as primary accent | Tokens swapped to white/pink/green/black/blue palette; SF Pro typography only |
| **topbar-v3** (Topbar) | `Layout 1.jpg` (Apple Settings/Family clean header) + `Element 1.jpg` (memoji circle) | Big calm SF Pro Display greeting LEFT, memoji circle FAR RIGHT, hairline bottom only — zero blur | "Family" centered title becomes left-aligned greeting; memoji size 30px; subtitle micro-line below greeting |
| **NOW v3-final** | `Layout 4.jpg` (Evening Ritual) — hero composition with one focal block, chip cluster, body card, bottom CTA pill | Big SF Pro Display title hero, 4-up chip cluster (goal/time/etc.), white paper card with intention text, dimensional Start CTA pill | Photo background dropped (we don't have one); replaced with calm pastel pink wash + sparkle/memoji accent in card corner. Domain chip adds rotated -7deg "playful premium" accent borrowed from Amie Welcome's green chip |
| **TODAY v3-final** | `Home Screen X 1.jpg` (constellation app — stacked paper cards) + `Amie Welcome Screen.jpg` (rotated chip overlay) | Vertical stack of distinct paper cards (different heights), each card a self-contained block, rotated playful chip floating over one card as the "now" marker | Cards become elastic time blocks with duration chips; prayer anchors render as soft tinted band cards. The rotated chip becomes the "now playing" marker on the active block |
| **DOMAINS v3-final** | `Layout 1.jpg` (Family settings — circle row + list rows) + `Element 2.jpg` (avatars row + soft tint) | Top: row of 6 domain "discs" (gradient tinted circles like the family memojis), each with a domain glyph. Below: stacked rows showing each domain with momentum word | Memoji discs become domain glyph discs (same circle treatment, same arrangement); list rows show domain name + momentum word + subtle hairline chevron |

## Combined references (where one board image isn't enough)

- **NOW** = Layout 4 composition (hero + chips + card + CTA) but with Amie Welcome's playful rotated chip move on the domain tag.
- **TODAY** = Home Screen X 1 layered card stack + Amie Welcome's rotated chip for the "in progress" marker.
- **DOMAINS** = Layout 1 family-row (top discs) + Element 2 (the soft pastel pill summary card with avatar overlap) for the weekly trend strip at the top.

## Anti-references (what NOT to inherit)

- `lisa jones eleemnt.jpg` looks like neumorphism — we keep its dimensional shadow softness ONLY, never its inset bevel feel.
- `Superpower Screen 1.jpg` uses a custom serif-leaning display font — we ignore typography entirely (SF Pro Display only).
- `Layout 4.jpg` Evening Ritual uses a purple gradient CTA — we replace with our blue or with ink-black, never purple.
- `Deel Screen 1.jpg` uses a heavy blue gradient bg — calibrate the **layered floating cards composition only**, drop the gradient.
- No frosted-glass / liquid-glass surfaces from any reference. Apple's iOS uses small frosted accents but we are not building a glass app.
