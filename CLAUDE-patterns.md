# Patterns & Known Issues
## Proven patterns

### Shared prayer cache
`do-it-prayer-cache-v1` in localStorage is the single source of truth for today's prayer times. Both `PrayerBanner` and `today/page.tsx` read/write this key. Shape: `{ date: string (toDateString()), anchors: Anchor[] }`. Day-string check invalidates stale data automatically.

### Zustand persist migration pattern
Stable key name (`"do-it-state"`), `version: N`, `migrate(persistedState, fromVersion)` that spreads persisted state and backfills missing fields from seed defaults. Never version-suffix the key — that defeats migration.

### Playwright in this project
Playwright is installed as a dev dependency in `web/` via pnpm. Run verification scripts as `node <script>.mjs` from the `web/` directory so Node resolves `playwright` from `web/node_modules`.

### CSS variable fallbacks in inline styles
Use `"var(--token, #hex)"` pattern for inline styles that reference design tokens. This gives a reliable fallback if the CSS variable hasn't loaded, and makes the palette intention explicit.

## Known bugs & fixes

### `void hydrated` anti-pattern
Early pages suppressed "unused variable" lint warnings with `void hydrated;`. This is dead code — `skipHydration` + `setHydrated` in the store handles hydration ordering. Remove from destructure entirely.

### Non-null assertions on optional Block fields
`focus.adjustedMin!` is unsafe — use `focus.adjustedMin ?? 0`. The field is `optional` in the Block type.

## Library quirks
[Filled when the verification subagent or engineering hits a non-obvious framework quirk]
