import type {Metadata} from 'next'
import {ChatPanel} from '@/components/ChatPanel'

export const metadata: Metadata = {
  title: 'Knowledge chat',
  description: 'Ask questions grounded in the team design knowledge base.',
}

export default function ChatPage() {
  const requiresAccessToken = Boolean(process.env.CHAT_ACCESS_TOKEN)
  return (
    <div className="relative mx-auto max-w-3xl flex-1 overflow-hidden px-4 py-10 md:py-14">
      {/* Decorative glows */}
      <div
        className="bg-sunshine/25 pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="bg-brand/10 pointer-events-none absolute -left-12 bottom-24 size-40 rounded-full blur-3xl"
        aria-hidden
      />

      <header className="relative mb-8">
        <p className="text-cta flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em]">
          <span className="bg-sunshine inline-block size-1.5 rounded-full" aria-hidden />
          Knowledge chat
        </p>
        <h1 className="text-brand mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
          Ask your team&apos;s brain
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-sm font-semibold leading-relaxed">
          Every answer is grounded in your published frameworks, processes, and insights.
          Think of it as a conversation with your team&apos;s collected wisdom.
        </p>
      </header>
      <ChatPanel requiresAccessToken={requiresAccessToken} />
    </div>
  )
}
