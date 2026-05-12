# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## This repo

- **Project:** `eff153ps` · **Dataset:** `production`
- **Dev:** `npm run dev` (Studio at [http://localhost:3333](http://localhost:3333) by default)
- **Schema:** `schemaTypes/` — design-knowledge types (phase, tag, **source author**, framework, process, insight, principle, external resource). After schema edits run `npx sanity schema deploy`.
- **Seed data (optional):** `scripts/seed-data.ts` — example payloads; convert to NDJSON or import via the API when you are ready.

**Note:** The document type for annotated links is `externalResource` (studio title still “Reference”) because `reference` is reserved in Sanity.

### Host the Studio on Sanity (production dataset)

From the repo root, with your Sanity account logged in (`npx sanity login` if needed):

```bash
npm run deploy
```

The CLI builds the Studio and uploads it to **Sanity hosting**. The first run asks you to choose a **hostname** (e.g. `your-name` → `https://your-name.sanity.studio`). Later deploys update the same host. Your `sanity.config.ts` already targets project **`eff153ps`** and dataset **`production`**, so the hosted Studio edits the same dataset you use locally.

Optional: `npx sanity deploy --schema-required` so deploy fails if the schema cannot be stored. Add **`appId`** under `deployment` in `sanity.cli.ts` from [Manage → Studios](https://www.sanity.io/manage/project/eff153ps/studios) if you want pinned auto-updates instead of the generic warning.

If the **Next.js site** (or another origin) calls the Sanity API from the browser, add that site URL under **API → CORS origins** for project `eff153ps` in [Sanity Manage](https://www.sanity.io/manage).

## Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy `.env.example` to `.env.local` and paste **Project URL** and the **anon** key from **Project Settings → API**.
3. Use `lib/supabase.ts` from Node scripts (load dotenv first) or from a future web app. Prefer the anon client in user-facing code and **RLS on every table** in exposed schemas; reserve `createSupabaseServiceClient` for trusted servers only.
4. **Supabase MCP:** see the [MCP setup guide](https://supabase.com/docs/guides/getting-started/mcp); authenticate in Cursor so tools can reach your project.

Optional: install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase init` in this repo when you want local migrations and `supabase link`.

## Web app (`web/`)

Next.js marketing shell plus **Knowledge chat** (`/chat`): fetches a bounded slice of published Sanity documents on each request and answers with **Anthropic Claude** using that context only (no user-written GROQ).

1. `cd web && cp .env.example .env.local`
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `ANTHROPIC_API_KEY`. Optional: `ANTHROPIC_MODEL`, `SANITY_API_READ_TOKEN` for draft/private reads; `CHAT_ACCESS_TOKEN` plus the same value in the chat UI (once) to gate the API.
3. `npm run dev` from `web/` → [http://localhost:3000](http://localhost:3000)

Run Studio from repo root (`npm run dev`) on port **3333**; run the site from `web/` on **3000**.

**Schema note:** Insights and references now use a **Source author** document reference. If you had old plain-text author fields, copy those names into new **Source author** entries and pick them on each document.
