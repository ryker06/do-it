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
  intention?: string;
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
  nextMove?: string;
  anchorLine?: string;
  threads?: VisionThread[];
  deadline?: string; // ISO date string e.g. "2026-07-28"
  targetMetric?: string;
  identity?: string; // "I am a 220kg deadlifter"
};

export type VisionThread = {
  id: string;
  title: string;
  sub?: string;
};

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type RoutineCadence =
  | { kind: "weekly"; days: Weekday[] }
  | { kind: "biweekly"; days: Weekday[]; anchorWeek: "A" | "B" }
  | { kind: "monthlyWeeks"; weeks: (1 | 2 | 3 | 4 | 5)[]; days: Weekday[] }
  | { kind: "monthlyDays"; days: number[] }
  | { kind: "interval"; everyDays: number; from: string };

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
  days: Weekday[]; // legacy fallback — new code uses cadence
  cadence?: RoutineCadence;
  cadenceDescription?: string;
  streakPhrase?: string;
  color?: string;
  blocks: RoutineBlock[];
  identity?: string; // "I am someone who trains daily"
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
  domain?: DomainId;
};
export type Reflection = {
  id: string;
  dateISO: string;
  worked?: string;
  shifted?: string;
  firstMove?: string;
  // v2 evening audit fields
  fellShort?: string;
  actedWell?: string;
  correction?: string;
};
export type StateMark = "clear" | "focused" | "wired" | "drained" | "heavy";
export type StateLogEntry = {
  id: string;
  ts: number;
  mark: StateMark;
  note?: string;
};

export type InsightStatus = "captured" | "testing" | "adopted" | "discarded";
export type Insight = {
  id: string;
  text: string;
  source?: string;
  domainId?: DomainId;
  visionId?: string;
  capturedAt: number;
  status: InsightStatus;
  testedNotes?: string;
  statusChangedAt?: number;
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

export type PersonRole = "family" | "mentor" | "training" | "team" | "friend";
export type Person = {
  id: string;
  name: string;
  relation: string;
  lastTouchedISO?: string;
  nextMove?: string;
  note?: string;
  role?: PersonRole;
  lastInsight?: string;
};

export type WishlistPriority = "low" | "medium" | "high";
export type WishlistStatus = "wanted" | "bought" | "passed";
export type WishlistCategory =
  | "gear"
  | "books"
  | "experiences"
  | "tools"
  | "other";
export type WishlistItem = {
  id: string;
  name: string;
  expectedAmountCents: number;
  currency: string;
  priority?: WishlistPriority;
  category?: WishlistCategory;
  url?: string;
  note?: string;
  status: WishlistStatus;
  createdAt: number;
  boughtAt?: number;
};

// ── New v2 types ──

export type GoalMetricKind = "weight" | "money" | "count" | "boolean";
export type GoalLog = { dateISO: string; value: number };
export type Goal = {
  id: string;
  visionId: string;
  identityLine?: string;
  metricKind: GoalMetricKind;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadlineISO: string;
  history: GoalLog[];
};

export type HabitMark = { dateISO: string; status: "done" | "rested" };
export type Habit = {
  id: string;
  name: string;
  identity?: string;
  marks: HabitMark[];
  createdAt: number;
};

export type WorkoutSet = { reps: number; weightKg: number; loggedAt: number };
export type WorkoutExercise = { id: string; name: string; sets: WorkoutSet[] };
export type Workout = {
  id: string;
  dateISO: string;
  exercises: WorkoutExercise[];
  notes?: string;
};

export type SleepLog = {
  id: string;
  dateISO: string;
  hoursSlept: number;
  quality?: 1 | 2 | 3 | 4 | 5;
};
export type HydrationLog = { id: string; dateISO: string; glasses: number };
export type BodyLog = {
  id: string;
  dateISO: string;
  weightKg?: number;
  waistCm?: number;
  bfPct?: number;
};

export type JarEntry = {
  id: string;
  capturedAt: number;
  oneLine: string;
  blockId?: string;
};

export type MorningBrief = {
  id: string;
  dateISO: string;
  friction?: string;
  resumePlan?: string;
};
