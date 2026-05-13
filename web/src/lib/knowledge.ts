/**
 * Knowledge retrieval — two strategies:
 *
 * 1. RAG (primary): Embed the user's question via the Supabase `rag-query`
 *    Edge Function, which performs vector similarity search and returns the
 *    most relevant documents. Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 *
 * 2. Sanity GROQ (fallback): Fetch the most recent documents directly from
 *    Sanity. Used when Supabase isn't configured or the RAG call fails.
 */

import {getSanityReadClient} from './sanity'

// ── Types ────────────────────────────────────────────────────────────

export type KnowledgeMatch = {
  sanity_id: string
  document_type: string
  title: string
  content_text: string
  metadata: Record<string, unknown>
  similarity: number
}

export type KnowledgeSnippet = Record<string, unknown>

// ── RAG retrieval (primary) ──────────────────────────────────────────

function getSupabaseConfig(): {url: string; key: string} | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return {url, key}
}

/** Call the rag-query Edge Function for semantic search. */
export async function fetchRAGContext(
  question: string,
  options?: {
    matchCount?: number
    filterType?: string
    filterConfidence?: string
    filterPhase?: string
  },
): Promise<KnowledgeMatch[]> {
  const config = getSupabaseConfig()
  if (!config) throw new Error('Supabase not configured for RAG')

  const res = await fetch(`${config.url}/functions/v1/rag-query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: question,
      match_count: options?.matchCount ?? 8,
      filter_type: options?.filterType ?? null,
      filter_confidence: options?.filterConfidence ?? null,
      filter_phase: options?.filterPhase ?? null,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`rag-query failed: ${res.status} ${err}`)
  }

  const data = (await res.json()) as {matches: KnowledgeMatch[]}
  return data.matches ?? []
}

/** Format RAG matches as context for the Claude system prompt. */
export function matchesToContextJson(matches: KnowledgeMatch[], maxChars = 24000): string {
  const compact = matches.map((m) => ({
    type: m.document_type,
    title: m.title,
    content: m.content_text,
    confidence: (m.metadata?.confidence as string) ?? undefined,
    maturity: (m.metadata?.maturity as string) ?? undefined,
    similarity: Math.round(m.similarity * 1000) / 1000,
  }))
  let text = JSON.stringify(compact, null, 0)
  if (text.length > maxChars) {
    text = text.slice(0, maxChars) + '\n…(truncated)'
  }
  return text
}

// ── Sanity GROQ fallback ─────────────────────────────────────────────

const KNOWLEDGE_SNIPPET_QUERY = `*[_type in $types]|order(_updatedAt desc)[0...40]{
  _type,
  _id,
  title,
  name,
  statement,
  summary,
  quote,
  "slug": slug.current,
  "sourceAuthor": sourceAuthor->name,
  sourceTitle,
  sourceUrl,
  "author": author->name,
  "resourceType": resourceType
}`

export async function fetchSanityFallbackContext(): Promise<KnowledgeSnippet[]> {
  const sanity = getSanityReadClient()
  return sanity.fetch(KNOWLEDGE_SNIPPET_QUERY, {
    types: [
      'framework',
      'process',
      'insight',
      'principle',
      'externalResource',
      'phase',
      'tag',
      'sourceAuthor',
    ],
  })
}

export function snippetsToContextJson(rows: KnowledgeSnippet[], maxChars = 14000): string {
  const compact = rows.map((r) => {
    const label =
      (r.title as string) ||
      (r.name as string) ||
      (r.statement as string) ||
      (r._id as string)
    return {
      type: r._type,
      label,
      slug: r.slug,
      summary: r.summary,
      statement: r.statement,
      quote: r.quote,
      sourceAuthor: r.sourceAuthor,
      sourceTitle: r.sourceTitle,
      sourceUrl: r.sourceUrl,
      author: r.author,
      resourceType: r.resourceType,
    }
  })
  let text = JSON.stringify(compact, null, 0)
  if (text.length > maxChars) {
    text = text.slice(0, maxChars) + '\n…(truncated)'
  }
  return text
}

// ── Unified retrieval ────────────────────────────────────────────────

/** Returns true if Supabase RAG is available. */
export function isRAGAvailable(): boolean {
  return getSupabaseConfig() !== null
}
