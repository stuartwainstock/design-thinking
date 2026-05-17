# Design thinking — web

Next.js App Router app: **landing** and **knowledge chat** (`/chat`). Copy for marketing and chat chrome is editable in Sanity as **Site content** (singleton). The chat API uses Claude with RAG (optional Supabase) or GROQ fallback — see repo root **`../README.md`** and **`CLAUDE.md`**.

## Environment

```bash
cp .env.example .env.local
```

Required for local chat: `NEXT_PUBLIC_SANITY_*`, `ANTHROPIC_API_KEY`. Optional: `SANITY_API_READ_TOKEN`, Supabase keys for RAG, `CHAT_ACCESS_TOKEN`, `CHROMATIC_PROJECT_TOKEN` (local Chromatic only).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Next.js → [http://localhost:3000](http://localhost:3000) |
| `npm run build` / `npm start` | Production build and server |
| `npm run storybook` | Design system docs → [http://localhost:6006](http://localhost:6006) |
| `npm run build-storybook` | Static Storybook → `storybook-static/` (gitignored) |
| `npm run chromatic` | Publish Storybook to Chromatic (needs `CHROMATIC_PROJECT_TOKEN`) |

**Export as slides:** assistant replies include a CTA that calls `POST /api/export` (Claude structures content → PptxGenJS `.pptx` download). Same `ANTHROPIC_API_KEY` as chat.

Typography: **Nunito** (see `src/app/layout.tsx` + Storybook `preview-head.html`).

## Storybook & Chromatic

Stories live under `src/stories/design-system/`. Token reference: `tokenData.ts` (keep aligned with `src/app/globals.css`).

**Chromatic** (CI): add GitHub secret **`CHROMATIC_PROJECT_TOKEN`** from [chromatic.com](https://www.chromatic.com). Workflow: `.github/workflows/chromatic.yml` (runs on `main` and PRs; `exitZeroOnChanges` — review visuals in Chromatic).

Local publish: `CHROMATIC_PROJECT_TOKEN=… npm run chromatic` from this directory.

## Deploy

The marketing/chat site is typically deployed to **Vercel** from the `web/` app root; see [Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying). Storybook/Chromatic are separate from the production URL.
