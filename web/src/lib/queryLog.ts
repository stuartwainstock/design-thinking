/**
 * Chat query logging — writes to `chat_queries` in Supabase.
 *
 * Fire-and-forget: never blocks the chat response, never throws.
 * Silently skips when Supabase is not configured.
 *
 * Table schema (create via the migration in supabase/migrations/):
 *
 *   chat_queries (
 *     id            uuid default gen_random_uuid() primary key,
 *     question      text not null,
 *     retrieval     text not null,        -- rag | sanity-groq | sanity-groq-fallback | ...
 *     matched_types text[],               -- document types returned by retrieval
 *     created_at    timestamptz default now()
 *   )
 */

type QueryLogEntry = {
  question: string
  retrievalMethod: string
  matchedTypes?: string[]
}

function getSupabaseConfig(): {url: string; key: string} | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return {url, key}
}

/**
 * Log a chat query to Supabase. Call this without `await` —
 * it handles its own errors and never rejects.
 */
export async function logQuery(entry: QueryLogEntry): Promise<void> {
  try {
    const config = getSupabaseConfig()
    if (!config) return

    const body = {
      question: entry.question.slice(0, 2000),
      retrieval: entry.retrievalMethod,
      matched_types: entry.matchedTypes ?? [],
    }

    const res = await fetch(`${config.url}/rest/v1/chat_queries`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.warn(`[queryLog] Insert failed: ${res.status} ${await res.text().catch(() => '')}`)
    }
  } catch (err) {
    console.warn('[queryLog] Error:', err instanceof Error ? err.message : err)
  }
}
