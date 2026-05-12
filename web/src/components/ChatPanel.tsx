'use client'

import {useCallback, useMemo, useState} from 'react'

type Msg = {role: 'user' | 'assistant'; content: string}

export function ChatPanel({requiresAccessToken}: {requiresAccessToken: boolean}) {
  const [token, setToken] = useState('')
  const [storedToken, setStoredToken] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveToken = useMemo(() => {
    if (typeof window === 'undefined') return ''
    if (storedToken) return storedToken
    try {
      return sessionStorage.getItem('chatAccessToken') ?? ''
    } catch {
      return ''
    }
  }, [storedToken])

  const saveToken = useCallback(() => {
    const v = token.trim()
    if (!v) return
    try {
      sessionStorage.setItem('chatAccessToken', v)
    } catch {
      /* ignore */
    }
    setStoredToken(v)
    setToken('')
  }, [token])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setError(null)
    const next: Msg[] = [...messages, {role: 'user', content: text}]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const headers: Record<string, string> = {'Content-Type': 'application/json'}
      if (requiresAccessToken && effectiveToken) {
        headers['x-chat-access-token'] = effectiveToken
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({messages: [...next]}),
      })
      const data = (await res.json()) as {reply?: string; error?: string}
      if (!res.ok) {
        throw new Error(data.error ?? res.statusText)
      }
      if (!data.reply) throw new Error('No reply')
      setMessages((m) => [...m, {role: 'assistant', content: data.reply!}])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [effectiveToken, input, loading, messages, requiresAccessToken])

  if (requiresAccessToken && !effectiveToken) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Team access</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter the shared token your admin configured (<code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">CHAT_ACCESS_TOKEN</code> on the server).
        </p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Access token"
        />
        <button
          type="button"
          onClick={saveToken}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}
      <div className="min-h-[320px] space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Ask about frameworks, processes, principles, or insights. Answers use your published Sanity content only.
          </p>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === 'user'
                ? 'ml-8 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                : 'mr-8 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200'
            }
          >
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
              {m.role === 'user' ? 'You' : 'Assistant'}
            </span>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Thinking…</p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Ask the knowledge base…"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
        />
        <button
          type="button"
          disabled={loading || !input.trim()}
          onClick={() => void send()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Send
        </button>
      </div>
    </div>
  )
}
