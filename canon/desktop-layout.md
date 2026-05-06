# Do It — Desktop Responsive Spec

**Note:** Each surface uses the same tokens but layouts vary per screen. Mac-app feel: cards have max-width, NEVER full-width. Layout reorders for desktop.

## Breakpoints
| Name | Range | Behavior |
|------|-------|----------|
| Mobile | <640px | Bottom tab bar (4 tabs: NOW · TODAY · WEEK · MORE). Single column. Topbar at top. |
| Tablet | 640–1023px | Bottom tab bar still. Single column but content centers in 560px max-width column. |
| Desktop | ≥1024px | Left sidebar rail (72px collapsed icons + label, or 220px expanded). Slim title bar replaces topbar. Content area has a content-max-width per surface. Multi-pane (master/detail) on People / Visions / Insights / Goals / Money. |

## Sidebar rail (desktop)
- Width: 220px expanded, 72px collapsed (Cmd+B toggles).
- Background: `var(--bg)` with right hairline.
- Items vertically: NOW · TODAY · WEEK · — divider — · DO group · TRACK group · KNOW group · LIFE group · TEND group · HOME group.
- Each item: 16px Lucide-style line icon + 13.5px label, 36px row, 14px radius pill highlight on hover/active.
- Bottom of rail: memoji avatar (links /settings) + Cmd+K hint pill ("⌘K  search").
- Active item background: `var(--inset-2)`, ink: black.

## Slim title bar (desktop)
- 48px tall. Greeting only (no memoji — memoji lives in sidebar bottom).
- "Adam. ready when you are." in 15px / 600.
- Right side: optional contextual actions per surface (e.g. "+ block" on TODAY, "+ goal" on GOALS).

## Content area
- Outer container: full viewport minus sidebar.
- Centered column with `content-max` per surface. Background `var(--stage)`.
- Content gap top: 24px.

## Per-surface desktop notes
| Surface | content-max | Layout |
|---|---|---|
| **NOW** | 460px center | Single hero card centered, vertical stack as mobile. Massive negative space left/right. Optional `intention` line under title. |
| **TODAY** | 720px + 280px stats sidebar | Center column = elastic timeline, right column = floating "today's stats" card (total / used / next prayer · prayers stack). |
| **WEEK** | 1080px | All 7 days visible as 7 columns of equal width. Compounder phrase pinned top. Drag blocks day-to-day. |
| **DOMAINS** | 880px | Asymmetric tile grid (3-2-3 or bento). Humming domains span 2 cols. |
| **VISIONS** | 920px split (320 list + 600 detail) | Master/detail. Left = vision list grouped by domain. Right = vision detail with goals nested. |
| **GOALS** | 460px | Single column of goal cards centered. Tap = inline log row inside same card. |
| **MORE** | 720px | Six grouped sections with hairline dividers. Tile grid 3 cols per group. |
| **HABITS** | 720px | Vertical list of habit rows, each with full 8-week dot grid visible without scroll. |
| **WORKOUTS** | 720px + 280px sidebar | Center = today's lift. Sidebar = PR strip + recent sessions. |
| **HEALTH** | 720px | 3-card row (sleep / hydration / body) wider, then trend phrase below. |
| **KNOWLEDGE-HEATMAP** | 880px | Horizontal heatmap occupies full max-width. Day-detail panel slides in right drawer. |
| **COOKIE JAR** | 560px | Centered scroll. Empty state copy big. |
| **REFLECT** | 460px | Centered three prompts. Voice button bottom-right floating. |
| **CMD+K** | 600px modal | Centered modal, NOT bottom sheet. Single input + flat results list. |
| **ROUTINES** | 720px | Vertical card list, each card has 8-week grid + cadence phrase. |
| **INSIGHTS** | 920px split (320 list + 600 detail) | Master/detail like Visions. Status pill on each list row. |
| **WISHLIST** | 720px | Two-tab toggle (Want / Bought). Tile grid 2 cols. |
| **PEOPLE** | 920px split (320 list + 600 detail) | Master/detail. List rows show role + "x days quiet". |
| **MONEY** | 880px | 3-card top row (in/out/net). Below: 3 drill-down panels. |
| **STATE** | 460px | Centered 5 word chips, pattern phrase list below. |
| **MORNING-BRIEF** | 460px modal | Centered modal overlay on TODAY. |
| **WEEKLY** | 1080px | 7-day strip. |

## Drawer pattern
- Right-side drawer: 380px wide, slides in from right at 280ms `cubic-bezier(.32,.72,0,1)`.
- Scrim: `rgba(20,20,30,0.32)`, fades 240ms.
- Used for: edit-block, edit-goal, day-detail in heatmap, person detail, insight detail.
- Close: ESC, scrim click, or Cmd+W.

## Cmd+K modal
- 600px wide, 480px max-height, centered.
- Backdrop: `rgba(20,20,30,0.40)` + blur(20px).
- Input: 56px tall, 17px text, no border, hairline bottom.
- Open animation: 180ms fade + 6px slide-down. NOT a spring.

## Card max-widths (rule)
- NOW hero: 393px mobile, 420px desktop (NEVER wider).
- TODAY rows: 720px max.
- DOMAINS tiles: 240–460px.
- GOALS card: 460px max.

Cards NEVER stretch full-width on desktop.

## Hover states (desktop)
- Tile/card: `translateY(-1px)`, shadow intensifies 20%, 200ms.
- Row: background → `var(--inset)`, 160ms.
- Button: brightness 1.06.
- Easing: `cubic-bezier(.32,.72,0,1)`.
