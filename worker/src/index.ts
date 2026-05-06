/**
 * Do It — Cloudflare Worker
 *
 * Scheduled: 03:00 UTC daily (≈ 04:00 Berlin winter / 05:00 summer)
 * Fetch:     GET /tasks/today → returns today's synced blocks as JSON
 *
 * Env secrets (set via `wrangler secret put`):
 *   NOTION_TOKEN   — Notion internal integration token (secret_…)
 *   NOTION_DB_ID   — Notion database ID (UUID, no dashes required)
 *
 * KV binding: DOIT_KV (namespace created via Cloudflare dashboard)
 */

export type DomainId =
  | "business"
  | "religion"
  | "learning"
  | "fitness"
  | "home"
  | "food";

export type SyncedBlock = {
  id: string;
  title: string;
  domain: DomainId;
  durationMin: number;
  scheduledFor: "today";
  mode?: "theory" | "application" | "feedback";
  visionId?: string;
  routineId?: string;
  meta?: { ingredients?: string[] };
};

type Env = {
  DOIT_KV: KVNamespace;
  NOTION_TOKEN: string;
  NOTION_DB_ID: string;
};

// ── Domain keyword inference ─────────────────────────────────────────────────

const DOMAIN_KEYWORDS: Array<{ domain: DomainId; words: string[] }> = [
  {
    domain: "fitness",
    words: ["gym", "workout", "lift", "run", "training", "exercise", "sets", "reps", "cardio", "deadlift", "squat", "bench"],
  },
  {
    domain: "religion",
    words: ["prayer", "pray", "quran", "salah", "fajr", "dhuhr", "asr", "maghrib", "isha", "dhikr", "dua", "mosque", "masjid"],
  },
  {
    domain: "food",
    words: ["eat", "meal", "breakfast", "lunch", "dinner", "cook", "grocery", "food", "recipe", "prep", "snack"],
  },
  {
    domain: "learning",
    words: ["read", "study", "learn", "book", "course", "lesson", "watch", "video", "note", "research", "chapter"],
  },
  {
    domain: "home",
    words: ["clean", "laundry", "tidy", "vacuum", "dish", "organize", "fix", "repair", "grocery", "errand", "home"],
  },
];

function inferDomain(title: string): DomainId {
  const lower = title.toLowerCase();
  for (const { domain, words } of DOMAIN_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) return domain;
  }
  return "business";
}

// ── Notion API helpers ───────────────────────────────────────────────────────

type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "number"; number: number | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "multi_select"; multi_select: Array<{ name: string }> }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "date"; date: { start: string } | null }
  | { type: string; [key: string]: unknown };

type NotionPage = {
  id: string;
  properties: Record<string, NotionPropertyValue>;
};

type NotionQueryResponse = {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
};

function getPlainText(
  prop: NotionPropertyValue | undefined,
): string | undefined {
  if (!prop) return undefined;
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("").trim() || undefined;
  }
  if (prop.type === "rich_text") {
    return (
      prop.rich_text.map((t) => t.plain_text).join("").trim() || undefined
    );
  }
  return undefined;
}

function getNumber(prop: NotionPropertyValue | undefined): number | undefined {
  if (!prop || prop.type !== "number") return undefined;
  return prop.number ?? undefined;
}

function getSelect(prop: NotionPropertyValue | undefined): string | undefined {
  if (!prop || prop.type !== "select") return undefined;
  return prop.select?.name ?? undefined;
}

function getMultiSelectFirst(
  prop: NotionPropertyValue | undefined,
): string | undefined {
  if (!prop || prop.type !== "multi_select") return undefined;
  return prop.multi_select[0]?.name ?? undefined;
}

function getStringArray(
  prop: NotionPropertyValue | undefined,
): string[] | undefined {
  if (!prop || prop.type !== "multi_select") return undefined;
  const items = prop.multi_select.map((x) => x.name).filter(Boolean);
  return items.length > 0 ? items : undefined;
}

// ── Page → SyncedBlock transform ─────────────────────────────────────────────

const VALID_DOMAINS: DomainId[] = [
  "business",
  "religion",
  "learning",
  "fitness",
  "home",
  "food",
];

const VALID_MODES = ["theory", "application", "feedback"];

function pageToBlock(page: NotionPage): SyncedBlock | null {
  const props = page.properties;

  // Title — required; skip page if missing
  const title =
    getPlainText(props["Name"]) ??
    getPlainText(props["Title"]) ??
    getPlainText(props["Task"]);
  if (!title) return null;

  // Domain — prefer explicit Notion property, else infer from title
  const domainRaw =
    getSelect(props["Domain"]) ??
    getMultiSelectFirst(props["Domain"]) ??
    undefined;
  const domain: DomainId =
    domainRaw && VALID_DOMAINS.includes(domainRaw as DomainId)
      ? (domainRaw as DomainId)
      : inferDomain(title);

  // Duration (minutes) — prefer Notion prop, default 30
  const durationMin = getNumber(props["Duration"]) ?? 30;

  // Mode
  const modeRaw = getSelect(props["Mode"]);
  const mode: SyncedBlock["mode"] =
    modeRaw && VALID_MODES.includes(modeRaw)
      ? (modeRaw as SyncedBlock["mode"])
      : undefined;

  // Vision + Routine IDs
  const visionId = getPlainText(props["VisionId"]) ?? undefined;
  const routineId = getPlainText(props["RoutineId"]) ?? undefined;

  // Ingredients (multi-select for food blocks)
  const ingredients = getStringArray(props["Ingredients"]) ?? undefined;

  const block: SyncedBlock = {
    id: `notion-${page.id}`,
    title,
    domain,
    durationMin: Math.max(1, Math.round(durationMin)),
    scheduledFor: "today",
    ...(mode ? { mode } : {}),
    ...(visionId ? { visionId } : {}),
    ...(routineId ? { routineId } : {}),
    ...(ingredients ? { meta: { ingredients } } : {}),
  };

  return block;
}

// ── Notion fetch (paginated) ──────────────────────────────────────────────────

async function fetchTodayBlocks(
  token: string,
  dbId: string,
): Promise<SyncedBlock[]> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const allBlocks: SyncedBlock[] = [];
  let cursor: string | undefined = undefined;

  // We query with a filter: date property "Date" equals today (if the DB has
  // such a property). If the DB doesn't have a date filter, we pull all pages
  // created/modified today — but the simplest approach is a "today" filter.
  // If Adam doesn't have a "Date" property, remove the filter object below.
  const filterBody = {
    filter: {
      or: [
        {
          property: "Date",
          date: { equals: today },
        },
        {
          property: "Scheduled",
          date: { equals: today },
        },
        // Fallback: if no date property, this filter won't match and pages
        // without a date prop won't appear. Adam should tag tasks with today's
        // date in Notion, or remove the filter to pull ALL tasks.
      ],
    },
  };

  do {
    const body: Record<string, unknown> = {
      ...filterBody,
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const resp = await fetch(
      `https://api.notion.com/v1/databases/${dbId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Notion API error ${resp.status}: ${text}`);
    }

    const data = (await resp.json()) as NotionQueryResponse;
    for (const page of data.results) {
      const block = pageToBlock(page);
      if (block) allBlocks.push(block);
    }

    cursor = data.has_more && data.next_cursor ? data.next_cursor : undefined;
  } while (cursor);

  return allBlocks;
}

// ── KV key helpers ────────────────────────────────────────────────────────────

function todayKey(): string {
  const d = new Date().toISOString().slice(0, 10);
  return `tasks/${d}`;
}

const KV_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// ── CORS headers ──────────────────────────────────────────────────────────────

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// ── Scheduled handler ─────────────────────────────────────────────────────────

async function runSync(env: Env): Promise<{ count: number }> {
  const blocks = await fetchTodayBlocks(env.NOTION_TOKEN, env.NOTION_DB_ID);
  const key = todayKey();
  await env.DOIT_KV.put(key, JSON.stringify(blocks), {
    expirationTtl: KV_TTL_SECONDS,
  });
  return { count: blocks.length };
}

// ── Entry point ───────────────────────────────────────────────────────────────

export default {
  // Cron trigger
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(
      runSync(env).then(({ count }) => {
        console.log(`[do-it-sync] Synced ${count} blocks for ${todayKey()}`);
      }),
    );
  },

  // HTTP fetch handler — GET /tasks/today
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === "GET" && url.pathname === "/tasks/today") {
      // Try KV first
      const cached = await env.DOIT_KV.get(todayKey(), "text");
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            ...corsHeaders(),
          },
        });
      }

      // Not in KV yet — run sync on demand (manual trigger or first open)
      try {
        const { count } = await runSync(env);
        const fresh = await env.DOIT_KV.get(todayKey(), "text");
        return new Response(fresh ?? "[]", {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-Synced-Now": String(count),
            ...corsHeaders(),
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown sync error";
        return new Response(JSON.stringify({ error: message }), {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(),
          },
        });
      }
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(),
    });
  },
} satisfies ExportedHandler<Env>;
