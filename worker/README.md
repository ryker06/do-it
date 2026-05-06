# Do It — Cloudflare Worker (Notion Sync)

Runs at **03:00 UTC daily** (≈ 04:00 Berlin winter, 05:00 summer).
Fetches today's tasks from a Notion database, transforms them to Block JSON,
and writes to Cloudflare KV. The PWA reads KV via `GET /tasks/today`.

---

## 4-step activation recipe (Adam's TODO)

### Step 1 — Create a Notion integration

1. Go to https://www.notion.so/profile/integrations
2. Click "New integration" → name it "Do It Sync" → select your workspace
3. Copy the **Internal Integration Token** (starts with `secret_…`)

### Step 2 — Share your DB with the integration

1. Open the Notion database you want to sync from
2. Click "..." (top right) → "Connections" → add "Do It Sync"
3. Copy the **Database ID** from the URL:
   `notion.so/{workspace}/{DATABASE_ID}?v=...`
   (it's the 32-char hex string before `?v=`)

### Step 3 — Deploy the Worker

```bash
# Install wrangler globally (once)
npm install -g wrangler

# Authenticate
wrangler login

# Create KV namespace (run ONCE, copy the IDs into wrangler.toml)
wrangler kv:namespace create DOIT_KV
wrangler kv:namespace create DOIT_KV --preview

# Set secrets (never committed to the repo)
wrangler secret put NOTION_TOKEN
# → paste: secret_…

wrangler secret put NOTION_DB_ID
# → paste: your-db-uuid-here

# Deploy
cd worker/
npm install
wrangler deploy
```

### Step 4 — Plug the Worker URL into Settings

1. After deploy, Wrangler prints your Worker URL:
   `https://do-it-sync.<your-subdomain>.workers.dev`
2. Open the Do It PWA → Settings → Notion sync
3. Paste the URL into "Sync URL" field
4. Tap "Sync now" to verify

---

## Notion database schema (recommended columns)

| Column       | Type         | Notes                                                  |
| ------------ | ------------ | ------------------------------------------------------ |
| Name / Title | Title        | Task title (required)                                  |
| Domain       | Select       | business / religion / learning / fitness / home / food |
| Duration     | Number       | Minutes (default: 30)                                  |
| Date         | Date         | Today's date to include in sync                        |
| Mode         | Select       | theory / application / feedback (optional)             |
| Ingredients  | Multi-select | For food blocks (optional)                             |
| VisionId     | Text         | Links block to a vision (optional)                     |
| RoutineId    | Text         | Links block to a routine (optional)                    |

If "Domain" column is absent, domain is inferred from title keywords (gym→fitness, prayer→religion, etc).
If "Date" column is absent, ALL pages will be returned — add the column and tag today's tasks.

---

## Manual trigger / debugging

```bash
# Watch live logs
wrangler tail

# Force a sync right now (without waiting for cron)
curl https://do-it-sync.<subdomain>.workers.dev/tasks/today

# Check KV contents
wrangler kv:key get --namespace-id=<ID> "tasks/2026-05-06"
```

## Cron timing

The cron is `"0 3 * * *"` = 03:00 UTC.

- **Winter (CET = UTC+1):** fires at 04:00 Berlin — correct
- **Summer (CEST = UTC+2):** fires at 05:00 Berlin — 1 hour late

To fix for summer, change `wrangler.toml` cron to `"0 2 * * *"` and redeploy.
