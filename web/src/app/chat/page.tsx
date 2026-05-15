import type {Metadata} from 'next'
import {ChatPanel} from '@/components/ChatPanel'

export const metadata: Metadata = {
  title: 'Knowledge chat',
  description: 'Ask questions grounded in the team design knowledge base.',
}

export default function ChatPage() {
  const requiresAccessToken = Boolean(process.env.CHAT_ACCESS_TOKEN)
  return (
    <section className="relative flex flex-1 flex-col overflow-x-clip">
      {/* Full-bleed background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-sunshine/20 absolute -top-8 right-[8%] size-64 rounded-full blur-3xl md:size-80" />
        <div className="bg-brand/8 absolute bottom-20 left-[5%] size-48 rounded-full blur-3xl md:size-64" />
      </div>

      <div className="relative mx-auto max-w-3xl flex-1 px-4 py-10 md:py-14">
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
    </section>
  )
}
