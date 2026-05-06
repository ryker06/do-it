# Project Principles (constitution)

These are the inviolable rules for this project. Override only with Adam's explicit say-so.

1. **One feature at a time.** Never branch into a second feature mid-flight.
2. **Spec before code.** Every non-trivial feature has a `specs/<feature>/` trio before implementation.
3. **Image-driven design.** No design decisions made from rules — only from the references in `board/` and approved screens in `canon/`.
4. **Verification gates the commit.** No feature is "done" until the verification subagent says SHIP.
5. **Reviewer adversarial pass before commit.** Default verdict is REWORK; SHIP requires positive proof.
6. **Production stack defaults.** Clerk + Convex + Stripe/RevenueCat + Sentry + PostHog. Override only with stated reason.
7. **TypeScript strict, no `any`.** Use `unknown` and narrow it.
8. **Token discipline.** /compact at 60%, /clear at 80%, new session per project.

[Adam may add project-specific principles below this line]
