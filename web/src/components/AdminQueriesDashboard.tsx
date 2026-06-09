'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {QueryAnalytics} from '@/lib/queryAnalytics'

const DOC_TYPE_LABELS: Record<string, string> = {
  framework: 'Frameworks',
  process: 'Processes',
  insight: 'Insights',
  principle: 'Principles',
  externalResource: 'References',
}

const DOC_TYPE_COLORS: Record<string, string> = {
  framework: 'bg-sunshine/60',
  process: 'bg-brand/40',
  insight: 'bg-pink/50',
  principle: 'bg-green/50',
  externalResource: 'bg-purple/50',
}

function formatDocType(type: string): string {
  return DOC_TYPE_LABELS[type] ?? type
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatShortDate(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric'}).format(d)
}

type AdminQueriesDashboardProps = {
  requiresAccessToken: boolean
}

export function AdminQueriesDashboard({requiresAccessToken}: AdminQueriesDashboardProps) {
  const [tokenInput, setTokenInput] = useState('')
  const [storedToken, setStoredToken] = useState('')
  const [data, setData] = useState<QueryAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveToken = useMemo(() => {
    if (typeof window === 'undefined') return ''
    if (storedToken) return storedToken
    try {
      return sessionStorage.getItem('adminAccessToken') ?? ''
    } catch {
      return ''
    }
  }, [storedToken])

  const loadWithToken = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/queries', {
        headers: {'x-admin-access-token': token},
      })
      const body = await res.json()
      if (!res.ok) {
        throw new Error((body as {error?: string}).error ?? res.statusText)
      }
      setData(body as QueryAnalytics)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveToken = useCallback(() => {
    const v = tokenInput.trim()
    if (!v) return
    try {
      sessionStorage.setItem('adminAccessToken', v)
    } catch {
      /* ignore */
    }
    setStoredToken(v)
    setTokenInput('')
    void loadWithToken(v)
  }, [tokenInput, loadWithToken])

  const load = useCallback(() => {
    if (effectiveToken) void loadWithToken(effectiveToken)
  }, [effectiveToken, loadWithToken])

  const initialLoadDone = useRef(false)
  useEffect(() => {
    if (!effectiveToken || initialLoadDone.current) return
    initialLoadDone.current = true
    const timer = window.setTimeout(() => {
      void loadWithToken(effectiveToken)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [effectiveToken, loadWithToken])

  if (!requiresAccessToken) {
    return (
      <div className="border-border-playful bg-surface mx-auto max-w-lg rounded-3xl border-2 p-7 shadow-lg">
        <h2 className="text-brand text-lg font-extrabold">Admin not configured</h2>
        <p className="text-muted mt-3 text-sm font-semibold leading-relaxed">
          Set <code className="font-mono text-xs">ADMIN_ACCESS_TOKEN</code> on the server to
          enable this dashboard.
        </p>
      </div>
    )
  }

  if (requiresAccessToken && !effectiveToken) {
    return (
      <div className="border-border-playful bg-surface mx-auto max-w-lg space-y-5 rounded-3xl border-2 p-7 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="bg-brand-light flex size-10 items-center justify-center rounded-full text-lg">
            📊
          </span>
          <h2 className="text-brand text-lg font-extrabold">Executive access</h2>
        </div>
        <p className="text-muted text-sm font-semibold leading-relaxed">
          Enter the admin token configured as{' '}
          <code className="bg-sunshine-wash text-brand font-mono rounded-md px-1.5 py-0.5 text-xs font-bold">
            ADMIN_ACCESS_TOKEN
          </code>{' '}
          on the server.
        </p>
        <label htmlFor="admin-access-token" className="sr-only">
          Admin access token
        </label>
        <input
          id="admin-access-token"
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && saveToken()}
          className="border-border-playful w-full rounded-xl border-2 bg-transparent px-4 py-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand"
          placeholder="Admin token"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={saveToken}
          disabled={!tokenInput.trim()}
          className="bg-cta hover:bg-cta-hover w-full rounded-full py-3 text-sm font-extrabold tracking-wide text-white uppercase shadow-sm transition-colors disabled:opacity-40"
        >
          View dashboard
        </button>
      </div>
    )
  }

  const maxActivity = Math.max(1, ...(data?.activityByDay.map((d) => d.count) ?? [1]))
  const maxDocType = Math.max(1, ...(data?.byDocumentType.map((d) => d.count) ?? [1]))

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-brand flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em]">
            <span className="bg-sunshine inline-block size-1.5 rounded-full" aria-hidden />
            Knowledge agent
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Query insights
          </h1>
          <p className="text-muted mt-2 max-w-2xl text-sm font-semibold leading-relaxed">
            What your team is asking — patterns from chat, not page views. Updated on each load.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="border-border-playful hover:bg-surface-elevated rounded-full border-2 px-5 py-2.5 text-sm font-extrabold transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="border-pink/40 bg-pink/10 text-foreground rounded-2xl border-2 px-4 py-3 text-sm font-semibold"
        >
          {error}
        </div>
      )}

      {data && !data.configured && (
        <div className="border-border-playful bg-surface rounded-2xl border-2 p-5 text-sm font-semibold">
          Supabase is not configured — query logging requires{' '}
          <code className="font-mono text-xs">SUPABASE_URL</code> and{' '}
          <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>.
        </div>
      )}

      {data?.configured && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total questions" value={data.summary.total} accent="sunshine" />
            <StatCard label="Last 7 days" value={data.summary.last7Days} accent="brand" />
            <StatCard label="Last 30 days" value={data.summary.last30Days} accent="pink" />
            <StatCard
              label="Days with activity"
              value={data.summary.uniqueDaysActive}
              accent="green"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="border-border-playful bg-surface rounded-3xl border-2 p-6 shadow-md">
              <h2 className="text-foreground text-sm font-extrabold uppercase tracking-wide">
                Activity — last 14 days
              </h2>
              {data.summary.total === 0 ? (
                <p className="text-muted mt-4 text-sm font-semibold">No questions logged yet.</p>
              ) : (
                <div className="mt-6 flex h-36 items-end gap-1.5">
                  {data.activityByDay.map((day) => (
                    <div key={day.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className="bg-brand/70 w-full min-h-[4px] rounded-t-md transition-all"
                        style={{height: `${Math.max(8, (day.count / maxActivity) * 100)}%`}}
                        title={`${day.count} question${day.count === 1 ? '' : 's'}`}
                      />
                      <span className="text-muted text-[10px] font-bold leading-none">
                        {formatShortDate(day.date)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="border-border-playful bg-surface rounded-3xl border-2 p-6 shadow-md">
              <h2 className="text-foreground text-sm font-extrabold uppercase tracking-wide">
                Knowledge types retrieved
              </h2>
              <p className="text-muted mt-1 text-xs font-semibold">
                How often each entry type appeared in search results
              </p>
              {data.byDocumentType.length === 0 ? (
                <p className="text-muted mt-4 text-sm font-semibold">No retrieval data yet.</p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {data.byDocumentType.map((item) => (
                    <li key={item.type}>
                      <div className="mb-1 flex justify-between text-sm font-extrabold">
                        <span>{formatDocType(item.type)}</span>
                        <span className="text-muted">{item.count}</span>
                      </div>
                      <div className="bg-sunshine-wash h-2.5 overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full ${DOC_TYPE_COLORS[item.type] ?? 'bg-brand/50'}`}
                          style={{width: `${(item.count / maxDocType) * 100}%`}}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {data.byRetrieval.length > 0 && (
            <section className="border-border-playful bg-surface rounded-3xl border-2 p-6 shadow-md">
              <h2 className="text-foreground text-sm font-extrabold uppercase tracking-wide">
                Retrieval method
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.byRetrieval.map((item) => (
                  <span
                    key={item.method}
                    className="bg-brand-light text-brand rounded-full px-4 py-1.5 text-xs font-extrabold"
                  >
                    {item.method}{' '}
                    <span className="text-brand-muted">({item.count})</span>
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="border-border-playful bg-surface overflow-hidden rounded-3xl border-2 shadow-md">
            <div className="border-border-playful border-b-2 px-6 py-4">
              <h2 className="text-foreground text-sm font-extrabold uppercase tracking-wide">
                Recent questions
              </h2>
              <p className="text-muted mt-1 text-xs font-semibold">
                Latest {data.recent.length} — full text as asked
              </p>
            </div>
            {data.recent.length === 0 ? (
              <p className="text-muted px-6 py-8 text-sm font-semibold">No questions yet.</p>
            ) : (
              <ul className="divide-border-playful divide-y-2">
                {data.recent.map((row) => (
                  <li key={row.id} className="px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <time
                        dateTime={row.createdAt}
                        className="text-muted text-xs font-extrabold uppercase tracking-wide"
                      >
                        {formatDateTime(row.createdAt)}
                      </time>
                      <div className="flex flex-wrap gap-1.5">
                        {row.matchedTypes.map((t) => (
                          <span
                            key={t}
                            className="bg-sunshine-wash text-brand rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase"
                          >
                            {formatDocType(t)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground mt-3 text-sm font-semibold leading-relaxed">
                      {row.question}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="text-muted text-center text-xs font-semibold">
            Snapshot generated {formatDate(data.generatedAt)} · Data from Supabase{' '}
            <code className="font-mono">chat_queries</code>
          </p>
        </>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent: 'sunshine' | 'brand' | 'pink' | 'green'
}) {
  const accentClass = {
    sunshine: 'bg-sunshine/25 border-sunshine/40',
    brand: 'bg-brand-light border-brand/20',
    pink: 'bg-pink/10 border-pink/25',
    green: 'bg-green/10 border-green/30',
  }[accent]

  return (
    <div className={`hover-lift rounded-2xl border-2 px-5 py-4 ${accentClass}`}>
      <p className="text-muted text-xs font-extrabold uppercase tracking-wide">{label}</p>
      <p className="text-foreground mt-2 text-3xl font-extrabold tabular-nums">{value}</p>
    </div>
  )
}
