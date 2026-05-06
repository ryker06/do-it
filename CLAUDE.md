# Do It

A real-time adaptive execution system for someone with too many goals across too many domains. Opens to a single screen: one task, one button, one line of "Next:". Elastic time engine — durations, not timestamps; everything pauses, resumes, shifts forward, never goes "late." Three layers only: NOW (the action), TODAY (today's flow of blocks), DOMAINS (life areas shown as momentum words, never numbers). Daily 4am cloud routine pulls fresh tasks from Notion, categorizes them into domains, and seeds today's flow so Adam wakes up to a ready plan. Calm, premium, slightly playful, single focal object per screen, zero guilt language. Long-term: this becomes the single product where gym, learning, prayer anchors, business work, and every domain Adam touches gets executed from.

## ⚠️ HARD WORKFLOW RULE — read before doing anything

**The orchestrator (this top-level Claude) does NOT execute substantive work. Ever. No exceptions.** Adam set up the subagent system specifically because the orchestrator's context rots over a long session and drifts from his standards. The subagents stay sharp because their context is fresh.

The rule:

| Work type | Who does it |
|---|---|
| Specs, scoping, screen mapping | `product` subagent |
| Visual mockups, canon HTML, design iteration | `design` subagent |
| Any React/TypeScript/CSS implementation | `engineering` subagent |
| Playwright tests, screenshots, lint, typecheck | `verification` subagent |
| Adversarial review before commit | `reviewer` subagent |
| Voice-dump decomposition | `orchestrator` subagent |

**The orchestrator's job is exclusively:**
- Brief subagents with self-contained prompts
- Sequence work (one feature at a time)
- Gate approvals from Adam
- Pass verbatim feedback between Adam and subagents
- Apply meta corrections (this file, CLAUDE-state.md)

**The orchestrator NEVER:**
- Writes app code directly (no Edit/Write to `web/app/**`, `web/components/**`, `web/lib/**`)
- Edits canon HTML directly
- Skips the verification gate before declaring "done"
- Skips the reviewer gate before commit
- Inlines "trivial" fixes — they go to engineering subagent

**The only orchestrator-direct files are:** `CLAUDE.md`, `CLAUDE-*.md`, `HANDOFF.md`, `.claude/**`, feedback brief files in `canon/feedback-*.md`, and project root `.gitignore`. Everything else goes through subagents.

If the orchestrator catches itself about to use Edit/Write on app code: STOP, write a brief, dispatch the engineering subagent.

## Commands
- Dev: `pnpm dev` (from `web/`, runs on http://localhost:3000 + LAN at http://192.168.2.48:3000)
- Test: `pnpm test`
- Lint: `pnpm lint && pnpm typecheck`
- Build: `pnpm build`
- Deploy: auto on `git push` to `main` → Cloudflare Pages

## Memory bank
| File | Read when |
|------|-----------|
| CLAUDE-state.md | Session start |
| CLAUDE-stack.md | Before any code |
| CLAUDE-features.md | Before implementing |
| CLAUDE-patterns.md | Before debugging or similar logic |
| CLAUDE-principles.md | When making architectural calls |

All `CLAUDE-*.md` except `state.md` are committed. State is gitignored (per-machine).

## Reference images & approved canons
- Vibe references in `board/`
- Approved canon mockups in `canon/` — `*-APPROVED.html` files are locked design system source of truth
- Approved canon screenshots in `canon/*-APPROVED.png` and the latest `canon-*-vN.png` files at project root
- Cross-project taste in `C:\Design-Library\accepted\`

## Approved canons (locked)
- `now-APPROVED.html` (NOW screen, idle + active states, all tokens defined here)
- `today-APPROVED.html` (TODAY screen with elastic timeline + anchor)
- `domains-APPROVED.html` (DOMAINS screen with momentum cards)
- `visions.html` (VISIONS grid with hero + 2-col)
- Plus 16 sub-canons covering every other screen — see `canon/` directory

@./CLAUDE-principles.md
