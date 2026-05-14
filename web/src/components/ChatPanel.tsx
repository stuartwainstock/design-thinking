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
      const rawBody = await res.text()
      let data: {reply?: string; error?: string}
      try {
        data = JSON.parse(rawBody) as {reply?: string; error?: string}
      } catch {
        data = {error: rawBody.slice(0, 500) || res.statusText}
      }
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
      <div className="border-border-playful bg-surface mx-auto max-w-lg space-y-4 rounded-3xl border-2 p-6 shadow-md">
        <h2 className="text-brand text-lg font-extrabold">Team access</h2>
        <p className="text-muted text-sm font-semibold">
          Enter the shared token your admin configured (
          <code className="bg-sun-wash text-brand font-mono rounded-md px-1.5 py-0.5 text-xs font-bold">
            CHAT_ACCESS_TOKEN
          </code>{' '}
          on the server).
        </p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border-border-playful bg-surface-elevated focus:ring-cta/40 w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold outline-none transition-shadow focus:ring-4"
          placeholder="Access token"
        />
        <button
          type="button"
          onClick={saveToken}
          className="bg-cta hover:bg-cta-hover rounded-full px-5 py-2.5 text-sm font-extrabold text-white uppercase tracking-wide shadow-sm transition-colors"
        >
          Continue
        </button>
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col gap-4">
      {error ? (
        <p className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900 dark:border-red-800 dark:bg-red-950/80 dark:text-red-100">
          {error}
        </p>
      ) : null}
      <div className="border-border-playful bg-surface min-h-[320px] space-y-3 rounded-3xl border-2 p-5 shadow-md">
        {messages.length === 0 ? (
          <p className="text-muted text-sm font-semibold leading-relaxed">
            Ask about frameworks, processes, principles, or insights. Answers use your published Sanity content only.
          </p>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === 'user'
                ? 'bg-sun-wash text-foreground ml-6 rounded-2xl rounded-br-md px-4 py-3 text-sm font-medium shadow-sm md:ml-12'
                : 'border-border-playful bg-surface-elevated text-foreground mr-6 rounded-2xl rounded-bl-md border px-4 py-3 text-sm font-medium shadow-sm md:mr-12'
            }
          >
            <span className="text-brand mb-1.5 block text-[0.65rem] font-extrabold uppercase tracking-[0.15em]">
              {m.role === 'user' ? 'You' : 'Assistant'}
            </span>
            <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
          </div>
        ))}
        {loading ? (
          <p className="text-muted flex items-center gap-2 text-sm font-bold">
            <span className="bg-brand inline-flex size-2 animate-pulse rounded-full" aria-hidden />
            Thinking…
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <input
          className="border-border-playful bg-surface focus:ring-cta/35 flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-semibold outline-none transition-shadow focus:ring-4"
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
          className="bg-cta hover:bg-cta-hover rounded-2xl px-5 py-3 text-sm font-extrabold tracking-wide text-white uppercase shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
