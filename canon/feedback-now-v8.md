# Adam's verbatim feedback on v8

> this icon of religion should be global style for all icons!!!! why is he using an android emoji now??? also make the time clock size harmonious to everything else.

# Diagnosis
The current v8 uses raw OS emoji (`🛐`, `🚀`, `📚`, `🥊`, `🏠`) inside the colored discs. Different emojis have wildly different rendering complexity by OS:
- 🛐 (place of worship) renders as a clean minimalist glyph-like mark — Adam sees it as a stylized green "G"-ish shape on the green disc, and he loves it.
- 🚀 renders as a fully colored 3D rocket with flames in OS emoji sets (Adam reads this as "Android emoji").

Adam wants **every icon to match Religion's minimalist single-color mark style**, not the colorful detailed emoji rendering.

# The fix
Drop emoji entirely. Use a unified **SVG icon set** with single-color line-style (or solid-style) glyphs that sit on the tinted disc. The icon = single color (dark ink or white), the disc = the tinted background. Like Apple's app icons in Settings, Health, Reminders, Mail — single mark on a colored square, not full-color illustration.

Pick one icon family for cohesion. Lucide (https://lucide.dev/) is a clean Apple-feeling open-source set. Or Heroicons solid. Or hand-rolled SVGs. Whichever gives the most "Apple SF Symbols inside an app icon" feel.

Apply to all 5 domains:
- Business (peach disc) — briefcase icon, or rocket SVG, or chart-line — pick something businesslike that's ONE color
- Religion (mint disc) — keep matching what 🛐 felt like — could be a building/mosque silhouette, or a person-bowing silhouette, or a moon. ONE color.
- Learning (lavender disc) — book SVG. ONE color.
- Fitness (rose disc) — boxing glove SVG, or running figure, or barbell. ONE color.
- Home (sky disc) — house SVG. ONE color.

The icon color: dark ink (#0A0A0F or similar) for high contrast against pastel discs. Or white. Whichever reads best.

# Also
**Shrink the timer further so it's in harmony with the rest of the card.** The 42:18 is still proud of the surrounding elements. Bring it down a notch so it sits inside the visual rhythm instead of dominating.

# Don't
- Don't touch palette, prayer banner, hero structure, "Then · after this" row layout, tab bar, eyebrow text, or anything else
- Don't redesign anything beyond these two surgical changes
- Don't use emoji
