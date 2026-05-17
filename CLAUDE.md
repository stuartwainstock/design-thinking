# Design Knowledge Agent — Project Rules

This is the authoritative reference for anyone (human or AI) working in this codebase. Read it before writing code, adding schemas, or modifying the pipeline. If something here conflicts with a quick-fix instinct, this document wins.

## What this project is

A **second brain for a product design team** — not a generic chatbot, not a wiki search. The goal is to make institutional design leadership knowledge self-service so that quality standards are implicit rather than explicit for the end user. A designer asks a question; the agent answers with the team's own judgment, frameworks, and principles — cited, opinionated, and calibrated to the asker's experience level.

The north star: **if the design lead would say it in a critique, the agent should be able to say it too.**

## Architecture

```
Sanity Studio (authoring) → Webhook → Supabase Edge Function (embed + store)
                                              ↓
User question → Next.js API route → Supabase Edge Function (embed + search)
                                              ↓
                              Claude API ← RAG context ← pgvector similarity
```

### Why each piece exists

- **Sanity CMS** — structured content with rich field types, Portable Text, real-time collaboration, and GROQ for flexible querying. The team authors knowledge here; they never touch code to update what the agent knows.
- **Supabase (pgvector)** — vector storage and similarity search. Edge Functions handle embedding on ingest and query. RLS is enabled; tables are locked to `service_role` only — no anonymous access, ever.
- **OpenAI `text-embedding-3-small`** — embedding model. Anthropic does not offer an embeddings API. We use OpenAI solely for embeddings; all reasoning is Claude.
- **Claude API** — the reasoning layer. Receives RAG context in the system prompt and answers only from that context. Default model id in code is **`claude-sonnet-4-6`** (override with `ANTHROPIC_MODEL`).
- **Next.js on Vercel** — the web surface. Server-side API route handles retrieval and Claude calls. No sensitive keys reach the browser.

### Data flow: publish → embed → store

1. Author publishes/updates a document in Sanity Studio.
2. Sanity webhook fires (filtered to `framework`, `process`, `insight`, `principle`, `externalResource`).
3. `sanity-webhook` Edge Function receives the event, fetches the full document from Sanity API, flattens all content (Portable Text blocks, string arrays, step objects) into a single `content_text`.
4. Calls OpenAI to generate a 1536-dimension embedding.
5. Upserts into `knowledge_embeddings` (keyed on `sanity_id`). Stores `document_type`, `title`, `content_text`, `metadata` (confidence, maturity, phases, tags), and the embedding vector.
6. Logs the event to `webhook_log` for debugging.
7. On delete/unpublish: removes the embedding row.

### Data flow: question → answer

1. User sends a message through the chat UI.
2. `POST /api/chat` extracts the latest user question.
3. Calls the `rag-query` Edge Function: embeds the question via OpenAI, runs `match_knowledge` (pgvector cosine similarity with optional filters).
4. Returns top matches with similarity scores.
5. If RAG returns results → format as context JSON. If RAG returns empty → fall back to Sanity GROQ (top 40 recent docs). If RAG errors → fall back to Sanity GROQ. If no question available → fall back to Sanity GROQ.
6. Context is injected into Claude's system prompt. Claude answers only from that context.

### The fallback chain matters

The retrieval function `retrieveChatContext` in `route.ts` implements a deliberate degradation path:

```
RAG (semantic search) → sanity-groq-empty-rag → sanity-groq-fallback → sanity-groq-no-question → error
```

This means the chat **always works** even without Supabase configured. Never break this fallback. Every new retrieval strategy should slot into this chain, not replace it.

### Export to slides (web only)

Separate from chat retrieval — does **not** read Sanity or Supabase again.

1. User clicks **Export as slides** under an assistant message in `ChatPanel`.
2. `POST /api/export` receives `{ content, question }` (assistant markdown + preceding user question).
3. Claude restructures the text into 1–3 slides as JSON (`web/src/lib/exportSlides.ts` validates the shape).
4. `web/src/lib/renderPptx.ts` builds a branded `.pptx` via PptxGenJS; browser downloads the file.

Uses the same `ANTHROPIC_API_KEY` and optional `CHAT_ACCESS_TOKEN` as `/api/chat`. Content is truncated at 24,000 chars before structuring. Build spec: `prompts/export-to-pptx.md`.

## Repository structure

```
/                           Sanity Studio (root workspace)
├── sanity.config.ts        Studio configuration (project: eff153ps, dataset: production)
├── schemaTypes/
│   ├── index.ts            Exports all types — order matters for Studio sidebar
│   ├── documents/          One file per document type
│   │   ├── framework.ts    Mental models, methods ("what to use when")
│   │   ├── process.ts      Step-by-step procedures ("how we do things")
│   │   ├── insight.ts      Learnings from research or experience
│   │   ├── principle.ts    Opinionated one-liners, core beliefs
│   │   ├── externalResource.ts  Annotated external references
│   │   ├── phase.ts        Design process phases (taxonomy)
│   │   ├── tag.ts          Cross-cutting tags with categories (taxonomy)
│   │   └── sourceAuthor.ts Reusable author references
│   └── objects/
│       ├── sharedFields.ts Shared field definitions — the single source of truth
│       └── step.ts         Inline object for Process steps
├── lib/
│   └── supabase.ts         Supabase client helpers (anon + service role)
├── scripts/
│   ├── seed-data.ts            Seed phases, tags, and example documents
│   └── import-mymind.ts        One-off MyMind → Sanity import (reads local JSON; see .gitignore)
├── web/                    Next.js app (separate workspace)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/chat/route.ts   The core API — retrieval + Claude
│   │   │   ├── chat/page.tsx       Chat page with token gating
│   │   │   ├── page.tsx            Landing page
│   │   │   └── layout.tsx          Root layout with nav
│   │   ├── components/
│   │   │   └── ChatPanel.tsx       Client-side chat UI
│   │   └── lib/
│   │       ├── knowledge.ts        RAG + GROQ retrieval logic
│   │       └── sanity.ts           Sanity client singleton
│   ├── e2e/
│   │   └── accessibility.spec.ts   axe WCAG 2.1 AA tests
│   ├── playwright.config.ts        Playwright config for a11y tests
│   ├── .env.example                Template for required env vars
│   └── CLAUDE.md → AGENTS.md      Next.js-specific agent rules
└── CLAUDE.md               ← You are here
```

## Schema & content design

### Sanity Studio: single-page field layout

Knowledge document types (**framework**, **process**, **insight**, **principle**, **externalResource**) intentionally use **one flat `fields` list** — no `groups` on `defineType`, so the Studio is a **single scrollable page** per document. Taxonomy and attribution still come from **`sharedFields.ts`**; add them by importing the exported field objects (`confidenceField`, `phaseField`, …) and listing them in sensible order (core content first, then attribution, then taxonomy).

If you ever bring back tabs, add a `groups` array to the type and set `group` on each field (typically via `{ ...sharedField, group: 'taxonomy' }`).

### Document types and their purpose

Every document type encodes a different kind of knowledge. This is intentional — the type tells the agent how to present the information.

- **Framework** — mental models, structured thinking tools. Has `whenToUse`, `antiPatterns`, quality signals. The agent should present these as recommendations with clear applicability criteria.
- **Process** — step-by-step procedures with `steps[]` (inline `step` objects containing tips, watch-outs, outputs). The agent should walk through these sequentially.
- **Insight** — learnings from research or experience. Has `quote` (the raw material) and `myTake` (the interpretation). `myTake` is the most valuable field — it's what makes this a knowledge base, not a bookmark list.
- **Principle** — opinionated one-liners with `elaboration`, `goodExample`, `antiExample`, `tension`. The agent should state these with conviction, not hedging.
- **External Resource** — annotated links. Has `whyItMatters` and `keyTakeaways`. The agent uses `whyItMatters` to decide when to surface a reference.
- **Phase** — taxonomy only. Represents stages of the design process (Discovery, Definition, Delivery, etc.).
- **Tag** — taxonomy with `category` (discipline, activity, mindset, stakeholder, quality, tool). Used for cross-cutting classification.
- **Source Author** — reusable author records. Create once, reference everywhere.

### The shared fields contract

All knowledge document types (framework, process, insight, principle, externalResource) share a common set of fields defined in `sharedFields.ts`. This is non-negotiable:

- **`confidence`** — evergreen / evolving / experimental / retired. Shapes how the agent talks about the entry. Evergreen = state with conviction. Experimental = caveat clearly. Retired = flag as historical.
- **`maturity`** — universal / onboarding / practitioner / senior. Calibrates response depth. Onboarding = give more foundational context. Senior = be concise and nuanced.
- **`phases`** — references to Phase documents. Which stage(s) of the design process this applies to.
- **`tags`** — references to Tag documents. Cross-cutting classification.
- **`relatedEntries`** — weak references to other knowledge documents. This is the connective tissue of the knowledge graph. Use it generously.
- **Attribution** — On **framework**, **process**, **insight**, and **principle**: `sourceAuthor` (reference), `sourceTitle`, `sourceUrl` from `sharedFields.ts`. On **externalResource**, the person link is the **`author`** field (same `sourceAuthor` document type); there is no separate `sourceAuthor` field name on that type.

### Adding shared fields to a new document type

Import from `sharedFields.ts` and append the field exports to `fields` in the order editors should see them. **Do not** copy-paste duplicate `defineField` definitions for confidence, tags, etc.

Never redefine a shared field inline — that creates drift between document types.

### Adding a new document type

1. Create the file in `schemaTypes/documents/`.
2. Import and use all applicable shared fields from `sharedFields.ts`.
3. Add it to the `KNOWLEDGE_TYPES` set in the `sanity-webhook` Edge Function if it should be embedded.
4. Add it to the webhook filter in Sanity (`_type in [...]`).
5. Add it to the `relatedEntriesField.of` array in `sharedFields.ts` so other entries can link to it.
6. Add it to the GROQ fallback query `$types` array in `knowledge.ts`.
7. Export it from `schemaTypes/index.ts`.
8. Update the `match_knowledge` function if the new type needs special filtering.

Missing any of these steps means the type either won't be embedded, won't appear in search, or won't be linkable from other entries.

### Content authoring principles

These are the rules for writing good knowledge base entries, not code:

- **`myTake` and `elaboration` are the most valuable fields.** A quote without interpretation is just a bookmark. The interpretation is what makes this a knowledge base.
- **`whyItMatters` must be specific.** "Interesting read" is not useful. "Explains why user interviews fail when you ask leading questions — directly applicable to our discovery process" is.
- **`tension` fields are what make principles real.** A principle without tensions is a platitude. Good principles have edges and occasionally conflict with each other.
- **Quality signals (`signalsOfGoodWork`, `signalsOfPoorWork`, `commonMistakes`) are the teaching tools.** They're what let the agent say "here's what good looks like" instead of just "here's the theory."
- **Set `confidence` honestly.** If you're not sure yet, mark it `experimental`. The agent will caveat accordingly. That's better than presenting a half-formed idea as settled truth.
- **Use `relatedEntries` generously.** Every connection makes the knowledge graph richer and helps the agent draw connections the author might not have explicitly stated.

## Code conventions

### Environment variables

- **Never prefix Supabase secrets with `NEXT_PUBLIC_`**. The service role key bypasses RLS — it must stay server-side.
- Server-only secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `CHAT_ACCESS_TOKEN`.
- Public (browser-safe): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.
- Always check for env vars at runtime and fail with a clear error message. See `getSupabaseConfig()` in `knowledge.ts` for the pattern: return `null` when unconfigured rather than throwing, so callers can fall back gracefully.

### Error handling and fallbacks

The project uses a deliberate pattern of **graceful degradation**:

```typescript
// ✅ The pattern: try the best option, fall back, never crash
if (isRAGAvailable() && question) {
  try {
    const matches = await fetchRAGContext(question)
    if (matches.length > 0) return ragResult(matches)
    return fallback('sanity-groq-empty-rag')
  } catch {
    return fallback('sanity-groq-fallback')
  }
}
return fallback('sanity-groq')
```

Every retrieval path should label its method (the `retrievalMethod` string) so it shows up in the system prompt and can be debugged. When adding a new retrieval strategy, follow this pattern.

### TypeScript style

- Use `type` over `interface` for data shapes.
- Prefer `async`/`await` over `.then()` chains.
- Use nullish coalescing (`??`) for defaults, not `||`.
- Keep Sanity schema definitions using `defineType` and `defineField` — they provide validation and IDE support.
- Portable Text fields use `type: 'array', of: [{ type: 'block' }]`.
- String array fields use `type: 'array', of: [{ type: 'string' }]`.

### Supabase Edge Functions

- Runtime is Deno, not Node. Imports use URL-based module resolution.
- Environment variables are accessed via `Deno.env.get()`, not `process.env`.
- The `sanity-webhook` function has JWT verification disabled (Sanity calls it directly). Webhook signature verification is a TODO — disabled after debugging HMAC format issues.
- The `rag-query` function has JWT verification enabled (called from the app with the service role key).
- Both functions log to `webhook_log` for observability.

### The system prompt contract

The system prompt in `route.ts` is carefully constructed. When modifying it:

- The agent must answer **only from context**. If the answer isn't in the context, it should say so and suggest what kind of entry would help.
- Confidence levels must shape language: evergreen = confident, evolving = directional, experimental = caveated, retired = flagged.
- Maturity levels must shape depth: onboarding = more foundational context, senior = concise and nuanced.
- The agent should cite entry types and titles (e.g., "The framework 'How Might We' suggests…").
- The agent should be **opinionated, not neutral**. The knowledge base embodies judgment.
- The `retrievalMethod` label is included in the prompt for transparency and debugging.

## Scaling principles

### What "reusable" means here

- Shared fields live in `sharedFields.ts`. Period. If two document types need the same field, extract it there.
- Attribution: **`sourceAuthor`** + **`sourceTitle`** + **`sourceUrl`** on framework, process, insight, principle. On **externalResource**, use **`author`** (reference to the same `sourceAuthor` type) — keep naming consistent with the schema, not a second pattern.
- The `relatedEntries` field accepts weak references to all knowledge types. When adding a new type, add it to the `to` array.
- Taxonomy (phases, tags) is reference-based, not string-based. This means renaming a phase updates everywhere automatically.

### What "scalable" means here

- The GROQ fallback caps at 40 documents. As the knowledge base grows, RAG becomes essential — it retrieves the 8 most relevant entries regardless of total count.
- The embedding content flattener in the webhook must handle every field type that could appear in a new document type. When adding rich content fields, ensure the flattener extracts their text.
- Context JSON is truncated at 24,000 chars (RAG) or 14,000 chars (GROQ). These limits exist to stay within Claude's effective context window for grounded answers. Don't raise them without reason.
- The `match_knowledge` SQL function supports optional filters (type, confidence, phase). New filter dimensions should follow the same pattern: nullable parameter, conditional WHERE clause, no impact when null.

### Future surfaces

The current surface is a web chat. Planned future surfaces include:

- **Slack bot** — same retrieval pipeline, different delivery surface.
- **Figma plugin** — contextual knowledge surfacing during design work.
- **CLI / Cursor integration** — knowledge available during development.

All surfaces should share the retrieval layer (`knowledge.ts` and the Edge Functions). The system prompt may vary per surface, but the context format should not. Design retrieval changes with multiple consumers in mind.

## Things not to do

- Don't hardcode knowledge in the system prompt. Everything the agent knows comes from the content in Sanity, retrieved via RAG or GROQ.
- Don't expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Ever.
- Don't skip the fallback chain. If you add a new retrieval method, it must degrade gracefully.
- Don't create inline field definitions when a shared field exists. Drift between document types is a bug.
- Don't raise context truncation limits without measuring the impact on answer quality.
- Don't add document types to the webhook without also adding them to the GROQ fallback, the `relatedEntries` reference list, and the `schemaTypes/index.ts` export.
- Don't use Anthropic for embeddings — they don't offer an embeddings API. Embeddings are OpenAI; reasoning is Claude. These are different concerns.
- Don't make the agent neutral. It's supposed to have opinions. That's the whole point.

---

# Memory

## Me
Stuart, Design Leader. Building a design knowledge agent — a second brain for a product design team that makes institutional design leadership knowledge self-service.

## People
| Who | Role |
|-----|------|
→ Full list: memory/glossary.md, profiles: memory/people/

## Terms
| Term | Meaning |
|------|---------|
| RAG | Retrieval-Augmented Generation — semantic search + Claude answering |
| pgvector | PostgreSQL vector extension in Supabase for similarity search |
| GROQ | Sanity's query language (not Groq the AI company) |
| Portable Text | Sanity's rich text format (array of blocks) |
| Edge Functions | Supabase Deno-based serverless functions (embed + search) |
| knowledge embeddings | The Supabase table storing vectorized design knowledge |
| match_knowledge | SQL function for cosine similarity search |
| text-embedding-3-small | OpenAI model used for 1536-dim embeddings |
| retrieval method | Label in system prompt showing which fallback path was used |
| confidence | Content maturity: evergreen / evolving / experimental / retired |
| maturity | Audience level: universal / onboarding / practitioner / senior |
| myTake | The interpretation field on Insights — the most valuable part |
→ Full glossary: memory/glossary.md

## Projects
| Name | What |
|------|------|
| **Design Knowledge Agent** | RAG-powered chat for design team (Sanity → Supabase → Claude) |

## Tools
| Tool | Used for |
|------|----------|
| Sanity Studio | CMS for authoring knowledge (project: eff153ps, dataset: production) |
| Supabase | Vector storage + Edge Functions for embed/search |
| Next.js / Vercel | Web app hosting the chat interface |
| Claude API | Reasoning layer (claude-sonnet-4-6 default) |
| OpenAI | Embeddings only (text-embedding-3-small) |
| Figma | Design work |
| GitHub | Code repository |
| Cursor | Primary code editor |
| Slack | Team communication |
| HEY | Personal email |
| Google Docs | Shared documents and notes |

## Preferences
- Async-first workflow
- Cursor + Claude Cowork for development
- Opinions > neutrality (the knowledge base should have a point of view)
