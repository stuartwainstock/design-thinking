# Design thinking — web

Next.js App Router app: **landing** and **knowledge chat** (`/chat`). Copy for marketing and chat chrome is editable in Sanity as **Site content** (singleton). The chat API uses Claude with RAG (optional Supabase) or GROQ fallback — see repo root **`../README.md`** and **`CLAUDE.md`**.

## Environment

```bash
cp .env.example .env.local
```

Required for local chat: `NEXT_PUBLIC_SANITY_*`, `ANTHROPIC_API_KEY`. Optional: `SANITY_API_READ_TOKEN`, Supabase keys for RAG, `CHAT_ACCESS_TOKEN`, `REVALIDATE_SECRET` (instant landing/chat copy after Studio publish), `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4), `CHROMATIC_PROJECT_TOKEN` (local Chromatic only).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js → [http://localhost:3000](http://localhost:3000) |
| `npm run build` / `npm start` | Production build and server |
| `npm run storybook` | Design system docs → [http://localhost:6006](http://localhost:6006) |
| `npm run build-storybook` | Static Storybook → `storybook-static/` (gitignored) |
| `npm run test:a11y` | Playwright + axe WCAG 2.1 AA checks on `/` and `/chat` |
| `npm run chromatic` | Publish Storybook to Chromatic (needs `CHROMATIC_PROJECT_TOKEN`) |

**Export as slides:** assistant replies include a CTA that calls `POST /api/export` (Claude structures content → PptxGenJS `.pptx` download). Same `ANTHROPIC_API_KEY` as chat.

Typography: **Nunito** (see `src/app/layout.tsx` + Storybook `preview-head.html`).

## Analytics

**GA4:** Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to enable pageview tracking. The `GoogleAnalytics` component renders nothing when unset.

**Query logging:** Every chat question is logged to Supabase `chat_queries` (question text, retrieval method, matched doc types). Requires Supabase keys; silently skips when unconfigured. Run the migration at `supabase/migrations/20260518_create_chat_queries.sql` to create the table.

**Admin dashboard:** Set `ADMIN_ACCESS_TOKEN` and open `/admin/queries` for an executive birds-eye view of question patterns (not linked from public nav; `noindex`).

## Accessibility testing

Automated WCAG 2.1 AA compliance checks run via **Playwright + @axe-core/playwright**. Tests scan the landing page and chat page (empty state + mocked conversation with loading and reply) and fail on any violation.

- **Config:** `playwright.config.ts`
- **Tests:** `e2e/accessibility.spec.ts`
- **CI:** `.github/workflows/accessibility.yml` (runs on `main` and PRs alongside Chromatic)
- **Run locally:** `npm run test:a11y` (starts the dev server automatically)

First-time setup: `npx playwright install chromium` after `npm install`.

## Storybook & Chromatic

Stories live under `src/stories/design-system/`. Token reference: `tokenData.ts` (keep aligned with `src/app/globals.css`).

**Chromatic** (CI): add GitHub secret **`CHROMATIC_PROJECT_TOKEN`** from [chromatic.com](https://www.chromatic.com). Workflow: `.github/workflows/chromatic.yml` (runs on `main` and PRs; `exitZeroOnChanges` — review visuals in Chromatic).

Local publish: `CHROMATIC_PROJECT_TOKEN=… npm run chromatic` from this directory.

## Site content cache (instant updates)

Landing and chat copy come from the Sanity **Site content** singleton. Pages use ISR (`revalidate = 60`) as a fallback; for instant updates on publish, set `REVALIDATE_SECRET` on Vercel and add a Sanity webhook:

1. Generate a secret: `openssl rand -hex 32`
2. Add `REVALIDATE_SECRET` to Vercel (Production + Preview) and `web/.env.local` for local tests
3. In [Sanity Manage → APIs → Webhooks](https://www.sanity.io/manage/project/eff153ps/api/webhooks), create a webhook:
   - **URL:** `https://<your-production-domain>/api/revalidate?secret=<REVALIDATE_SECRET>`
   - **Dataset:** production
   - **Trigger:** Create, Update, Delete (or at least Update)
   - **Filter:** `_type == "siteContent"`
   - **Projection:** `{_id, _type}` (minimal payload is fine)
   - **HTTP method:** POST

After publishing Site content, the next request to `/` or `/chat` should show new copy (no redeploy). Test locally:

```bash
curl -X POST "http://localhost:3000/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"_type":"siteContent","_id":"siteContent"}'
```

## Deploy

The marketing/chat site is typically deployed to **Vercel** from the `web/` app root; see [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying). Storybook/Chromatic are separate from the production URL.
