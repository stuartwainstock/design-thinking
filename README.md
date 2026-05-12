# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## This repo

- **Project:** `eff153ps` · **Dataset:** `production`
- **Dev:** `npm run dev` (Studio at [http://localhost:3333](http://localhost:3333) by default)
- **Schema:** `schemaTypes/` — design-knowledge types (phase, tag, framework, process, insight, principle, external resource). After schema edits run `npx sanity schema deploy`.
- **Seed data (optional):** `scripts/seed-data.ts` — example payloads; convert to NDJSON or import via the API when you are ready.

**Note:** The document type for annotated links is `externalResource` (studio title still “Reference”) because `reference` is reserved in Sanity.

## Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy `.env.example` to `.env.local` and paste **Project URL** and the **anon** key from **Project Settings → API**.
3. Use `lib/supabase.ts` from Node scripts (load dotenv first) or from a future web app. Prefer the anon client in user-facing code and **RLS on every table** in exposed schemas; reserve `createSupabaseServiceClient` for trusted servers only.
4. **Supabase MCP:** see the [MCP setup guide](https://supabase.com/docs/guides/getting-started/mcp); authenticate in Cursor so tools can reach your project.

Optional: install the [Supabase CLI](https://supabase.com/docs/guides/cli) and run `supabase init` in this repo when you want local migrations and `supabase link`.
