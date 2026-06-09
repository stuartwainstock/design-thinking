/**
 * Server-side aggregation for chat_queries (Supabase).
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */

export type ChatQueryRow = {
  id: string
  question: string
  retrieval: string
  matched_types: string[]
  created_at: string
}

export type QueryAnalytics = {
  generatedAt: string
  summary: {
    total: number
    last7Days: number
    last30Days: number
    uniqueDaysActive: number
  }
  byDocumentType: {type: string; count: number}[]
  byRetrieval: {method: string; count: number}[]
  activityByDay: {date: string; count: number}[]
  recent: {
    id: string
    question: string
    retrieval: string
    matchedTypes: string[]
    createdAt: string
  }[]
  configured: boolean
}

function getSupabaseConfig(): {url: string; key: string} | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return {url, key}
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

export async function fetchChatQueryRows(limit = 500): Promise<ChatQueryRow[]> {
  const config = getSupabaseConfig()
  if (!config) return []

  const params = new URLSearchParams({
    select: 'id,question,retrieval,matched_types,created_at',
    order: 'created_at.desc',
    limit: String(limit),
  })

  const res = await fetch(`${config.url}/rest/v1/chat_queries?${params}`, {
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
    },
    next: {revalidate: 0},
  })

  if (!res.ok) {
    throw new Error(`chat_queries fetch failed: ${res.status}`)
  }

  return (await res.json()) as ChatQueryRow[]
}

export function buildQueryAnalytics(rows: ChatQueryRow[]): QueryAnalytics {
  const now = Date.now()
  const ms7 = 7 * 24 * 60 * 60 * 1000
  const ms30 = 30 * 24 * 60 * 60 * 1000

  const last7Days = rows.filter((r) => now - Date.parse(r.created_at) <= ms7).length
  const last30Days = rows.filter((r) => now - Date.parse(r.created_at) <= ms30).length

  const activeDays = new Set(rows.map((r) => toDateKey(r.created_at)))

  const docTypeCounts = new Map<string, number>()
  for (const row of rows) {
    for (const t of row.matched_types ?? []) {
      docTypeCounts.set(t, (docTypeCounts.get(t) ?? 0) + 1)
    }
  }

  const retrievalCounts = new Map<string, number>()
  for (const row of rows) {
    retrievalCounts.set(row.retrieval, (retrievalCounts.get(row.retrieval) ?? 0) + 1)
  }

  const activityMap = new Map<string, number>()
  for (let i = 13; i >= 0; i--) {
    const key = toDateKey(daysAgo(i).toISOString())
    activityMap.set(key, 0)
  }
  for (const row of rows) {
    const key = toDateKey(row.created_at)
    if (activityMap.has(key)) {
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1)
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: rows.length,
      last7Days,
      last30Days,
      uniqueDaysActive: activeDays.size,
    },
    byDocumentType: [...docTypeCounts.entries()]
      .map(([type, count]) => ({type, count}))
      .sort((a, b) => b.count - a.count),
    byRetrieval: [...retrievalCounts.entries()]
      .map(([method, count]) => ({method, count}))
      .sort((a, b) => b.count - a.count),
    activityByDay: [...activityMap.entries()].map(([date, count]) => ({date, count})),
    recent: rows.slice(0, 25).map((r) => ({
      id: r.id,
      question: r.question,
      retrieval: r.retrieval,
      matchedTypes: r.matched_types ?? [],
      createdAt: r.created_at,
    })),
    configured: true,
  }
}

export async function getQueryAnalytics(): Promise<QueryAnalytics> {
  const config = getSupabaseConfig()
  if (!config) {
    return {
      generatedAt: new Date().toISOString(),
      summary: {total: 0, last7Days: 0, last30Days: 0, uniqueDaysActive: 0},
      byDocumentType: [],
      byRetrieval: [],
      activityByDay: [],
      recent: [],
      configured: false,
    }
  }

  const rows = await fetchChatQueryRows()
  return buildQueryAnalytics(rows)
}

export function checkAdminToken(request: Request): boolean {
  const expected = process.env.ADMIN_ACCESS_TOKEN
  if (!expected) return false
  return request.headers.get('x-admin-access-token') === expected
}
