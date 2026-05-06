export type DomainId =
  | "business"
  | "religion"
  | "learning"
  | "fitness"
  | "home"
  | "food";

export type DomainMomentum =
  | "warm"
  | "steady"
  | "drifting"
  | "quiet"
  | "humming";
export type DomainDirection = "improving" | "stable" | "declining";

export type Domain = {
  id: DomainId;
  name: string;
  emoji: string;
  tint: string;
  momentum: DomainMomentum;
  direction: DomainDirection;
  lastEngagement: string;
  nextAction: string;
  streakLabel?: string;
};

export type BlockStatus = "pending" | "active" | "done" | "paused";

export type BlockStep = {
  kind: "recipe" | "sets" | "verses" | "outline" | "list";
  items: string[];
  current?: number; // index of current step (0-based)
};

export type Block = {
  id: string;
  domain: DomainId;
  title: string;
  durationMin: number;
  status: BlockStatus;
  startedAt?: number;
  accumulatedMs: number;
  order: number;
  adjustedMin?: number;
  step?: BlockStep;
  visionId?: string;
  routineId?: string;
  mode?: "theory" | "application" | "feedback";
  meta?: {
    ingredients?: string[];
    mealSlot?: string;
    [k: string]: unknown;
  };
  scheduledFor?: "today" | "inbox" | string; // "today" | "inbox" | ISO date string
};

export type AnchorKind = "prayer" | "training";

export type Anchor = {
  id: string;
  kind: AnchorKind;
  label: string;
  hhmm: string;
  hard: boolean;
};

export type Vision = {
  id: string;
  title: string;
  blurb: string;
  domainId: DomainId;
  tint: string;
  description?: string;
  nextMove?: string; // "next move that proves I'm aiming here"
  anchorLine?: string; // one anchor line
  threads?: VisionThread[];
  deadline?: string; // ISO date string e.g. "2026-07-28"
  targetMetric?: string; // free-text proof statement e.g. "deadlift 180kg"
};

export type VisionThread = {
  id: string;
  title: string;
  sub?: string;
};

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// RoutineBlock is a template; actual blocks are emitted at schedule time
export type RoutineBlock = {
  id: string;
  domain: DomainId;
  title: string;
  durationMin: number;
  order: number;
  step?: BlockStep;
};

export type Routine = {
  id: string;
  name: string;
  days: Weekday[];
  cadenceDescription?: string; // plain-English cadence
  streakPhrase?: string; // e.g. "9 weeks running"
  color?: string;
  blocks: RoutineBlock[];
};

export type InboxItem = {
  id: string;
  text: string;
  domain?: DomainId;
  createdAt: number;
};

export type Money = number; // cents
export type CadenceMoney = "monthly" | "yearly" | "weekly";
export type Subscription = {
  id: string;
  name: string;
  amountCents: Money;
  currency: string;
  cadence: CadenceMoney;
  nextChargeISO: string;
  category: string;
  note?: string;
};
export type Transaction = {
  id: string;
  kind: "expense" | "income";
  amountCents: Money;
  currency: string;
  dateISO: string;
  category: string;
  note?: string;
  source?: "manual" | "subscription";
};
export type Reflection = {
  id: string;
  dateISO: string;
  worked?: string;
  shifted?: string;
  firstMove?: string;
};
export type StateMark = "clear" | "focused" | "wired" | "drained" | "heavy";
export type StateLogEntry = {
  id: string;
  ts: number;
  mark: StateMark;
  note?: string;
};
export type Insight = {
  id: string;
  text: string;
  source?: string;
  domainId?: DomainId;
  visionId?: string;
  capturedAt: number;
};
export type WeeklyReview = {
  id: string;
  weekStartISO: string;
  q: {
    kept?: string;
    shifted?: string;
    learned?: string;
    aiming?: string;
    firstMoveNextWeek?: string;
  };
};
export type Person = {
  id: string;
  name: string;
  relation: string;
  lastTouchedISO?: string;
  nextMove?: string;
  note?: string;
};
