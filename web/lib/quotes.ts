export const QUOTES = [
  "discipline equals freedom.",
  "you become what you repeat.",
  "today is the lift.",
  "the mountain doesn't care.",
  "show up. that's the move.",
  "quiet work, loud results.",
  "every rep is a vote.",
  "ready when you are.",
  "the work is the relationship.",
  "wealth is captured discipline.",
  "buy the body, not the cart.",
  "one block at a time.",
  "no late. only adjusted.",
  "steady beats brilliant.",
  "the rep you don't skip is the one that matters.",
  "execution is the plan.",
  "forward, not perfect.",
  "small inputs, compounding outputs.",
  "who you are at 6am is who you become.",
  "the identity precedes the outcome.",
  "do the thing first.",
  "calm steel.",
  "motion over emotion.",
  "log it. own it.",
  "the day waits for no one.",
  "earn the rest.",
  "one domain at a time.",
  "nothing slips when you're watching.",
  "the quiet hours compound.",
  "start. adjust. finish.",
];

export function quoteForToday(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return QUOTES[dayOfYear % QUOTES.length];
}
