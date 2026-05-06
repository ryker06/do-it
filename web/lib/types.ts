export type DomainId =
  | "business"
  | "religion"
  | "learning"
  | "fitness"
  | "home";

export type DomainMomentum = "strong" | "stable" | "weak" | "inactive";
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

export type BlockStatus = "idle" | "active" | "paused" | "done";

export type Block = {
  id: string;
  title: string;
  domainId: DomainId;
  durationMin: number;
  status: BlockStatus;
  startedAt?: number;
  accumulatedMs: number;
  order: number;
  adjustedMin?: number;
  step?: { current: number; total: number };
  focusType?: string;
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
};
