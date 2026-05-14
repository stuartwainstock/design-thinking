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
      <div
        className="bg-sun/30 pointer-events-none absolute right-0 top-0 size-56 -translate-y-1/4 translate-x-1/4 rounded-full blur-3xl"
        aria-hidden
      />
      <header className="relative mb-8">
        <h1 className="text-brand text-3xl font-extrabold tracking-tight">Knowledge chat</h1>
        <p className="text-muted mt-3 max-w-2xl text-sm font-semibold leading-relaxed">
          Answers use your published Sanity entries (frameworks, processes, insights, and more) as
          context for Claude. Context is refreshed on each message; the assistant does not run
          arbitrary database queries.
        </p>
      </header>
      <ChatPanel requiresAccessToken={requiresAccessToken} />
    </div>
  )
}
