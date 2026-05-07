import type {
  Block,
  Domain,
  Vision,
  Routine,
  Weekday,
  Subscription,
  Transaction,
  Reflection,
  StateLogEntry,
  Insight,
  Person,
  WishlistItem,
  Goal,
  Habit,
  Workout,
  SleepLog,
  HydrationLog,
  BodyLog,
  JarEntry,
  MorningBrief,
  Note,
} from "./types";

export const DOMAINS: Domain[] = [
  {
    id: "business",
    name: "Business",
    emoji: "💼",
    tint: "#E1ECFF",
    momentum: "warm",
    direction: "improving",
    lastEngagement: "today",
    nextAction: "Cold email Reiner",
    streakLabel: "4-day rhythm",
  },
  {
    id: "religion",
    name: "Religion",
    emoji: "🌙",
    tint: "#E5F0E1",
    momentum: "steady",
    direction: "stable",
    lastEngagement: "today",
    nextAction: "Dhuhr in your block",
  },
  {
    id: "learning",
    name: "Learning",
    emoji: "📚",
    tint: "#E6E0FF",
    momentum: "steady",
    direction: "improving",
    lastEngagement: "yesterday",
    nextAction: "20 min on the design extractor",
  },
  {
    id: "fitness",
    name: "Fitness",
    emoji: "🥊",
    tint: "#FFE0E6",
    momentum: "drifting",
    direction: "improving",
    lastEngagement: "2 days ago",
    nextAction: "Gym tonight, 60 min",
  },
  {
    id: "home",
    name: "Home",
    emoji: "🏠",
    tint: "#DDF0F5",
    momentum: "steady",
    direction: "stable",
    lastEngagement: "yesterday",
    nextAction: "Laundry + balcony",
  },
  {
    id: "food",
    name: "Food",
    emoji: "🍽️",
    tint: "#FFF3E0",
    momentum: "quiet",
    direction: "stable",
    lastEngagement: "today",
    nextAction: "Prep tonight's chicken bowl",
  },
];

export const SEED_BLOCKS: Block[] = [
  {
    id: "b1",
    title: "Webuild — finish Dr. Lashin landing draft",
    domain: "business",
    durationMin: 60,
    status: "pending",
    accumulatedMs: 0,
    order: 0,
    scheduledFor: "today",
    step: {
      kind: "outline",
      items: [
        "Write hero headline",
        "Draft value prop section",
        "Add testimonial placeholders",
        "Review and publish",
      ],
      current: 1,
    },
  },
  {
    id: "b2",
    title: "Quran — read & reflect",
    domain: "religion",
    durationMin: 20,
    status: "pending",
    accumulatedMs: 0,
    order: 1,
    scheduledFor: "today",
    step: {
      kind: "verses",
      items: [
        "Al-Baqarah 255 (Ayat al-Kursi)",
        "Al-Ikhlas",
        "Al-Falaq",
        "An-Nas",
      ],
      current: 0,
    },
  },
  {
    id: "b3",
    title: "Design extractor — research Framer templates",
    domain: "learning",
    durationMin: 45,
    status: "pending",
    accumulatedMs: 0,
    order: 2,
    scheduledFor: "today",
    mode: "theory" as const,
  },
  {
    id: "b4",
    title: "Cold emails — Personalvermittler batch",
    domain: "business",
    durationMin: 30,
    status: "pending",
    accumulatedMs: 0,
    order: 3,
    scheduledFor: "today",
    mode: "application" as const,
  },
  {
    id: "b5",
    title: "Gym — push session",
    domain: "fitness",
    durationMin: 60,
    status: "pending",
    accumulatedMs: 0,
    order: 4,
    scheduledFor: "today",
    step: {
      kind: "sets",
      items: [
        "Bench press 4×8",
        "Overhead press 3×10",
        "Tricep dips 3×12",
        "Lateral raises 3×15",
      ],
      current: 0,
    },
  },
  {
    id: "b6",
    title: "Home — laundry, clear desk",
    domain: "home",
    durationMin: 25,
    status: "pending",
    accumulatedMs: 0,
    order: 5,
    scheduledFor: "today",
  },
  // Food blocks with ingredients for meal + shopping
  {
    id: "bf1",
    title: "Breakfast — oats & berries",
    domain: "food",
    durationMin: 15,
    status: "pending",
    accumulatedMs: 0,
    order: 6,
    scheduledFor: "today",
    step: {
      kind: "recipe",
      items: [
        "Cook rolled oats 5 min",
        "Add frozen berries",
        "Drizzle honey",
        "Serve warm",
      ],
      current: 0,
    },
    meta: {
      ingredients: ["rolled oats", "frozen berries", "honey", "milk"],
      mealSlot: "breakfast",
    },
  },
  {
    id: "bf2",
    title: "Lunch — chicken rice bowl",
    domain: "food",
    durationMin: 30,
    status: "pending",
    accumulatedMs: 0,
    order: 7,
    scheduledFor: "today",
    step: {
      kind: "recipe",
      items: [
        "Cook basmati rice",
        "Season & pan-fry chicken breast",
        "Slice cucumber & tomato",
        "Assemble bowl with tahini",
      ],
      current: 0,
    },
    meta: {
      ingredients: [
        "chicken breast",
        "basmati rice",
        "cucumber",
        "tomato",
        "tahini",
        "lemon",
        "garlic",
      ],
      mealSlot: "lunch",
    },
  },
  {
    id: "bf3",
    title: "Dinner — salmon & vegetables",
    domain: "food",
    durationMin: 35,
    status: "pending",
    accumulatedMs: 0,
    order: 8,
    scheduledFor: "today",
    step: {
      kind: "recipe",
      items: [
        "Season salmon with olive oil & herbs",
        "Roast broccoli & sweet potato",
        "Pan-sear salmon 4 min each side",
        "Plate and squeeze lemon",
      ],
      current: 0,
    },
    meta: {
      ingredients: [
        "salmon fillet",
        "broccoli",
        "sweet potato",
        "olive oil",
        "lemon",
        "fresh dill",
      ],
      mealSlot: "dinner",
    },
  },
];

export const SEED_VISIONS: Vision[] = [
  {
    id: "v1",
    title: "Webuild",
    identity: "I run a focused 4-day workweek through Webuild.",
    blurb:
      "The website + solutions company. Templates → leads → close → automate.",
    domainId: "business",
    tint: "#E1ECFF",
    description:
      "A site shop that ships fast, beautiful, near-free websites to founders and small teams — powered by templates, lead gen, and a closing pipeline that quietly compounds in the background.",
    anchorLine: "Every block on Webuild moves the pipeline forward.",
    nextMove: "Send 10 cold emails to Personalvermittler this week.",
    threads: [
      {
        id: "t1",
        title: "Templates engine",
        sub: "The reusable spine — Framer, Webflow, code",
      },
      {
        id: "t2",
        title: "Lead generation",
        sub: "Where the right founders find us",
      },
      {
        id: "t3",
        title: "Cold email automation",
        sub: "A patient, quiet outbound loop",
      },
      {
        id: "t4",
        title: "Closing pipeline",
        sub: "Calls, scope, signed — without friction",
      },
      {
        id: "t5",
        title: "Webuild.solutions",
        sub: "The faces of the same engine",
      },
    ],
  },
  {
    id: "v2",
    title: "Jarvis × Claude",
    blurb:
      "Co-evolution engine. High-level brain piecing it all together via Notion.",
    domainId: "learning",
    tint: "#E6E0FF",
    nextMove: "Wire today's blocks into Notion and see the pattern.",
    threads: [
      {
        id: "t1",
        title: "Notion as memory",
        sub: "The external brain that persists",
      },
      {
        id: "t2",
        title: "Claude as collaborator",
        sub: "Real-time thinking partner",
      },
    ],
  },
  {
    id: "v3",
    title: "Second Brain",
    blurb: "The personal database that thinks the way you think.",
    domainId: "learning",
    tint: "#E6E0FF",
    nextMove: "Capture three insights from today into the system.",
  },
  {
    id: "v4",
    title: "Dr. Lashin platform",
    blurb: "Kentnissprüfung site, app, and content engine.",
    domainId: "business",
    tint: "#E1ECFF",
    nextMove: "Ship the landing page draft by end of week.",
    threads: [
      {
        id: "t1",
        title: "Landing page",
        sub: "Where doctors land and convert",
      },
      {
        id: "t2",
        title: "Content engine",
        sub: "Questions, guides, prep material",
      },
    ],
  },
  {
    id: "v5",
    title: "Strong rhythm in fitness",
    blurb: "Combat sports + gym, weekly cadence that holds.",
    domainId: "fitness",
    tint: "#FFE0E6",
    identity: "I am a 100kg deadlifter who shows up three times a week.",
    nextMove: "Show up to the gym three times this week.",
    deadline: "2026-07-28",
    targetMetric: "3 gym sessions per week for 8 consecutive weeks",
  },
  {
    id: "v6",
    title: "Stable religious practice",
    blurb: "Five prayers on time, Quran daily, Islamic learning weekly.",
    domainId: "religion",
    tint: "#E5F0E1",
    anchorLine: "Prayer is the anchor everything else bends around.",
    nextMove: "Complete Dhuhr and the Quran block today.",
  },
  {
    id: "v7",
    title: "Plan for Life",
    blurb: "The vision document for everything across every domain.",
    domainId: "learning",
    tint: "#E6E0FF",
    nextMove: "Write one paragraph about where you want to be in 3 years.",
  },
];

export const SEED_ROUTINES: Routine[] = [
  {
    id: "r1",
    name: "Weekday morning",
    color: "weekday",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    cadence: {
      kind: "weekly",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as Weekday[],
    },
    cadenceDescription: "Every weekday, Monday through Friday",
    streakPhrase: "4 weeks running",
    identity: "I am someone who starts every weekday with intention.",
    blocks: [
      {
        id: "rb1",
        title: "Quran · read & reflect",
        domain: "religion",
        durationMin: 20,
        order: 0,
      },
      {
        id: "rb2",
        title: "Webuild · deep work",
        domain: "business",
        durationMin: 90,
        order: 1,
      },
      {
        id: "rb3",
        title: "Cold emails",
        domain: "business",
        durationMin: 30,
        order: 2,
      },
      {
        id: "rb4",
        title: "Learning sprint",
        domain: "learning",
        durationMin: 45,
        order: 3,
      },
      {
        id: "rb5",
        title: "Gym · push session",
        domain: "fitness",
        durationMin: 60,
        order: 4,
      },
    ],
  },
  {
    id: "r2",
    name: "Recovery day",
    color: "recovery",
    days: ["Sat"],
    cadenceDescription: "Saturday — rest and reset",
    streakPhrase: "Every week",
    blocks: [
      {
        id: "rb1",
        title: "Quran · read & reflect",
        domain: "religion",
        durationMin: 20,
        order: 0,
      },
      {
        id: "rb2",
        title: "Home · reset & tidy",
        domain: "home",
        durationMin: 60,
        order: 1,
      },
      {
        id: "rb3",
        title: "Light walk",
        domain: "fitness",
        durationMin: 30,
        order: 2,
      },
    ],
  },
  {
    id: "r3",
    name: "Friday cycle",
    color: "friday",
    days: ["Fri"],
    cadenceDescription: "Every Friday afternoon",
    blocks: [
      {
        id: "rb1",
        title: "Jumu'ah prep + prayer",
        domain: "religion",
        durationMin: 40,
        order: 0,
      },
      {
        id: "rb2",
        title: "Week review",
        domain: "learning",
        durationMin: 30,
        order: 1,
      },
    ],
  },
  {
    id: "r4",
    name: "Sunday slow",
    color: "sunday",
    days: ["Sun"],
    cadence: {
      kind: "monthlyWeeks",
      weeks: [1, 2, 3, 4, 5],
      days: ["Sun"] as Weekday[],
    },
    cadenceDescription: "Every Sunday — slow and deliberate",
    blocks: [
      {
        id: "rb1",
        title: "Quran · long session",
        domain: "religion",
        durationMin: 45,
        order: 0,
      },
      {
        id: "rb2",
        title: "Plan next week",
        domain: "learning",
        durationMin: 45,
        order: 1,
      },
    ],
  },
];

export const SEED_WEEK_ASSIGNMENTS: Record<Weekday, string | null> = {
  Mon: "r1",
  Tue: "r1",
  Wed: "r1",
  Thu: "r1",
  Fri: "r1",
  Sat: "r2",
  Sun: null,
};

export const SEED_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub1",
    name: "Spotify",
    amountCents: 1099,
    currency: "USD",
    cadence: "monthly",
    nextChargeISO: "2026-05-18",
    category: "music",
  },
  {
    id: "sub2",
    name: "GitHub Pro",
    amountCents: 400,
    currency: "USD",
    cadence: "monthly",
    nextChargeISO: "2026-05-22",
    category: "software",
  },
  {
    id: "sub3",
    name: "ChatGPT Plus",
    amountCents: 2000,
    currency: "USD",
    cadence: "monthly",
    nextChargeISO: "2026-05-14",
    category: "software",
  },
];

const thisMonthISO = "2026-05-";
export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    kind: "expense",
    amountCents: 5400,
    currency: "USD",
    dateISO: `${thisMonthISO}02`,
    category: "food",
    note: "Grocery run",
    source: "manual",
  },
  {
    id: "tx2",
    kind: "expense",
    amountCents: 8900,
    currency: "USD",
    dateISO: `${thisMonthISO}04`,
    category: "gym",
    note: "Monthly gym membership",
    source: "manual",
  },
  {
    id: "tx3",
    kind: "income",
    amountCents: 250000,
    currency: "USD",
    dateISO: `${thisMonthISO}01`,
    category: "freelance",
    note: "Webuild client project",
    source: "manual",
  },
  {
    id: "tx4",
    kind: "income",
    amountCents: 42000,
    currency: "USD",
    dateISO: `${thisMonthISO}03`,
    category: "dividend",
    note: "ETF dividend",
    source: "manual",
  },
];

export const SEED_REFLECTIONS: Reflection[] = [
  {
    id: "ref1",
    dateISO: "2026-05-05",
    worked:
      "Deep work session on the Dr. Lashin landing page was uninterrupted — got the hero drafted.",
    shifted:
      "Gym moved to evening, which actually felt better than the morning slot.",
    firstMove: "Send the landing page draft to review first thing.",
  },
];

export const SEED_STATE_LOG: StateLogEntry[] = [
  { id: "sl1", ts: Date.now() - 3 * 3600_000, mark: "focused" },
  { id: "sl2", ts: Date.now() - 1 * 3600_000, mark: "wired" },
];

export const SEED_INSIGHTS: Insight[] = [
  {
    id: "ins1",
    text: "Consistency compounds faster than intensity. Showing up every day, even for 20 minutes, builds more than a single heroic session.",
    source: "Atomic Habits",
    domainId: "learning",
    capturedAt: Date.now() - 2 * 86400_000,
    status: "testing",
    statusChangedAt: Date.now() - 2 * 86400_000,
  },
  {
    id: "ins2",
    text: "The goal is not to be perfect at prayer — it is to return quickly when you drift.",
    domainId: "religion",
    capturedAt: Date.now() - 86400_000,
    status: "adopted",
    statusChangedAt: Date.now() - 86400_000,
  },
  {
    id: "ins3",
    text: "Systems beat goals. The goal is the direction; the system is what actually moves you.",
    source: "James Clear",
    domainId: "learning",
    capturedAt: Date.now() - 14 * 86400_000,
    status: "testing",
    statusChangedAt: Date.now() - 14 * 86400_000,
  },
];

export const SEED_WISHLIST: WishlistItem[] = [
  {
    id: "w1",
    name: "Atomic Habits",
    expectedAmountCents: 2400,
    currency: "USD",
    priority: "low",
    category: "books",
    status: "wanted",
    createdAt: Date.now() - 7 * 86400_000,
  },
  {
    id: "w2",
    name: "Resistance bands set",
    expectedAmountCents: 8900,
    currency: "USD",
    priority: "medium",
    category: "gear",
    status: "wanted",
    createdAt: Date.now() - 5 * 86400_000,
  },
  {
    id: "w3",
    name: "USB-C hub (Anker 9-in-1)",
    expectedAmountCents: 14500,
    currency: "USD",
    priority: "high",
    category: "tools",
    status: "wanted",
    createdAt: Date.now() - 3 * 86400_000,
  },
  {
    id: "w4",
    name: "Ali Abdaal productivity course",
    expectedAmountCents: 39900,
    currency: "USD",
    priority: "medium",
    category: "experiences",
    status: "wanted",
    createdAt: Date.now() - 2 * 86400_000,
  },
  {
    id: "w5",
    name: "Mechanical keyboard (Keychron K2)",
    expectedAmountCents: 9900,
    currency: "USD",
    priority: "low",
    category: "tools",
    status: "wanted",
    createdAt: Date.now() - 86400_000,
  },
];

export const SEED_PEOPLE: Person[] = [
  {
    id: "p1",
    name: "Mom",
    relation: "Family",
    role: "family",
    lastTouchedISO: "2026-04-28",
    nextMove: "Call this weekend — ask about the trip.",
  },
  {
    id: "p2",
    name: "Karim",
    relation: "Business mentor",
    role: "mentor",
    lastTouchedISO: "2026-04-20",
    nextMove: "Share the Webuild pipeline update and ask for feedback.",
  },
  {
    id: "p3",
    name: "Faris",
    relation: "Gym partner",
    role: "training",
    lastTouchedISO: "2026-05-03",
    nextMove: "Confirm Thursday push session.",
  },
];

// ── v2 seed data ──

export const SEED_GOALS: Goal[] = [
  {
    id: "g1",
    visionId: "v5",
    identityLine: "I am a 100kg deadlifter.",
    metricKind: "weight",
    targetValue: 100,
    currentValue: 88,
    unit: "kg",
    deadlineISO: "2026-07-28",
    history: [
      { dateISO: "2026-04-06", value: 82 },
      { dateISO: "2026-04-20", value: 84 },
      { dateISO: "2026-05-04", value: 88 },
    ],
  },
  {
    id: "g2",
    visionId: "v1",
    identityLine: "I close €5k/month through Webuild.",
    metricKind: "money",
    targetValue: 500000,
    currentValue: 292000,
    unit: "€",
    deadlineISO: "2026-08-01",
    history: [
      { dateISO: "2026-04-01", value: 0 },
      { dateISO: "2026-05-01", value: 292000 },
    ],
  },
  {
    id: "g3",
    visionId: "v3",
    identityLine: "I capture 3 insights a week.",
    metricKind: "count",
    targetValue: 50,
    currentValue: 14,
    unit: "insights",
    deadlineISO: "2026-09-01",
    history: [
      { dateISO: "2026-03-01", value: 0 },
      { dateISO: "2026-04-01", value: 7 },
      { dateISO: "2026-05-06", value: 14 },
    ],
  },
];

export const SEED_HABITS: Habit[] = [
  {
    id: "hab1",
    name: "read 20 pages",
    identity: "I am a daily reader.",
    marks: [
      { dateISO: "2026-04-29", status: "done" },
      { dateISO: "2026-04-30", status: "done" },
      { dateISO: "2026-05-01", status: "rested" },
      { dateISO: "2026-05-02", status: "done" },
      { dateISO: "2026-05-03", status: "done" },
      { dateISO: "2026-05-04", status: "done" },
      { dateISO: "2026-05-05", status: "done" },
    ],
    createdAt: Date.now() - 56 * 86400_000,
  },
  {
    id: "hab2",
    name: "stretch 5 min",
    identity: "I move every morning.",
    marks: [
      { dateISO: "2026-04-30", status: "done" },
      { dateISO: "2026-05-01", status: "done" },
      { dateISO: "2026-05-02", status: "done" },
      { dateISO: "2026-05-03", status: "rested" },
      { dateISO: "2026-05-04", status: "done" },
      { dateISO: "2026-05-05", status: "done" },
    ],
    createdAt: Date.now() - 42 * 86400_000,
  },
  {
    id: "hab3",
    name: "no phone first hour",
    identity: "I own my mornings.",
    marks: [
      { dateISO: "2026-05-01", status: "done" },
      { dateISO: "2026-05-02", status: "done" },
      { dateISO: "2026-05-03", status: "done" },
      { dateISO: "2026-05-04", status: "rested" },
      { dateISO: "2026-05-05", status: "done" },
    ],
    createdAt: Date.now() - 30 * 86400_000,
  },
];

export const SEED_WORKOUTS: Workout[] = [
  {
    id: "wo1",
    dateISO: "2026-05-06",
    exercises: [
      {
        id: "ex1",
        name: "Deadlift",
        sets: [
          { reps: 5, weightKg: 80, loggedAt: Date.now() - 3600_000 },
          { reps: 5, weightKg: 85, loggedAt: Date.now() - 3400_000 },
          { reps: 3, weightKg: 88, loggedAt: Date.now() - 3200_000 },
        ],
      },
      {
        id: "ex2",
        name: "Bench Press",
        sets: [
          { reps: 8, weightKg: 60, loggedAt: Date.now() - 3000_000 },
          { reps: 8, weightKg: 65, loggedAt: Date.now() - 2800_000 },
        ],
      },
    ],
    notes: "solid session. → 100kg deadlift coming.",
  },
  {
    id: "wo2",
    dateISO: "2026-05-03",
    exercises: [
      {
        id: "ex1",
        name: "Overhead Press",
        sets: [
          { reps: 8, weightKg: 40, loggedAt: Date.now() - 4 * 86400_000 },
          {
            reps: 8,
            weightKg: 42.5,
            loggedAt: Date.now() - 4 * 86400_000 + 600_000,
          },
        ],
      },
    ],
  },
];

// 7 days of sleep logs
const today = new Date("2026-05-06");
function daysAgoISO(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const SEED_SLEEP_LOG: SleepLog[] = [
  { id: "sl1", dateISO: daysAgoISO(6), hoursSlept: 7.5, quality: 4 },
  { id: "sl2", dateISO: daysAgoISO(5), hoursSlept: 6.5, quality: 3 },
  { id: "sl3", dateISO: daysAgoISO(4), hoursSlept: 8, quality: 5 },
  { id: "sl4", dateISO: daysAgoISO(3), hoursSlept: 7, quality: 4 },
  { id: "sl5", dateISO: daysAgoISO(2), hoursSlept: 6, quality: 2 },
  { id: "sl6", dateISO: daysAgoISO(1), hoursSlept: 7.5, quality: 4 },
  { id: "sl7", dateISO: daysAgoISO(0), hoursSlept: 0, quality: undefined },
];

export const SEED_HYDRATION_LOG: HydrationLog[] = [
  { id: "hy1", dateISO: daysAgoISO(6), glasses: 8 },
  { id: "hy2", dateISO: daysAgoISO(5), glasses: 6 },
  { id: "hy3", dateISO: daysAgoISO(4), glasses: 9 },
  { id: "hy4", dateISO: daysAgoISO(3), glasses: 7 },
  { id: "hy5", dateISO: daysAgoISO(2), glasses: 5 },
  { id: "hy6", dateISO: daysAgoISO(1), glasses: 8 },
  { id: "hy7", dateISO: daysAgoISO(0), glasses: 3 },
];

export const SEED_BODY_LOG: BodyLog[] = [
  { id: "bo1", dateISO: daysAgoISO(14), weightKg: 78.2, waistCm: 82 },
  { id: "bo2", dateISO: daysAgoISO(7), weightKg: 77.8, waistCm: 81 },
  { id: "bo3", dateISO: daysAgoISO(0), weightKg: 77.4, waistCm: 80.5 },
];

export const SEED_JAR: JarEntry[] = [
  {
    id: "jar1",
    capturedAt: Date.now() - 3 * 86400_000,
    oneLine: "finished the cold email batch at 23:00. didn't quit.",
  },
  {
    id: "jar2",
    capturedAt: Date.now() - 5 * 86400_000,
    oneLine: "gym session after a full day. showed up anyway.",
  },
  {
    id: "jar3",
    capturedAt: Date.now() - 8 * 86400_000,
    oneLine: "wrote 1,400 words for the landing page in one block.",
  },
  {
    id: "jar4",
    capturedAt: Date.now() - 12 * 86400_000,
    oneLine: "held the morning routine for 7 days straight.",
  },
  {
    id: "jar5",
    capturedAt: Date.now() - 20 * 86400_000,
    oneLine: "closed first Webuild client. proof the thing works.",
  },
];

export const SEED_MORNING_BRIEFS: MorningBrief[] = [
  {
    id: "mb1",
    dateISO: "2026-05-05",
    friction: "Back-to-back calls might interrupt the deep work block.",
    resumePlan: "If calls run long, I resume with the cold email batch.",
  },
  {
    id: "mb2",
    dateISO: "2026-05-04",
    friction: "Low energy after poor sleep.",
    resumePlan: "Start with the lightest block first, build momentum.",
  },
];

export const SEED_NOTES: Note[] = [
  {
    id: "n1",
    title: "cold email angle that worked",
    body: "Lead with the specific problem they have, not the solution. Reference their latest post or initiative. Keep it under 4 sentences.",
    tags: ["business", "outreach"],
    domainId: "business",
    pinned: true,
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 3 * 86400000,
  },
  {
    id: "n2",
    title: "deadlift cue that clicked",
    body: "Push the floor away instead of pulling the bar up. Hips drive forward at the lockout, not a hyperextension.",
    tags: ["fitness", "lifting"],
    domainId: "fitness",
    pinned: false,
    createdAt: Date.now() - 7 * 86400000,
    updatedAt: Date.now() - 7 * 86400000,
  },
  {
    id: "n3",
    body: "Reading Almanack of Naval Ravikant. Compounding applies to knowledge and relationships, not just money. Time your inputs early.",
    tags: ["learning"],
    domainId: "learning",
    pinned: false,
    createdAt: Date.now() - 14 * 86400000,
    updatedAt: Date.now() - 14 * 86400000,
  },
  {
    id: "n4",
    title: "morning routine what actually works",
    body: "Prayer first. No phone for 30 min. Coffee while reading — not scrolling. The first decision of the day sets the tone for all subsequent ones.",
    tags: ["routine", "discipline"],
    pinned: true,
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
  },
];
