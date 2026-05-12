import type {Metadata} from 'next'
import {ChatPanel} from '@/components/ChatPanel'

export const metadata: Metadata = {
  title: 'Knowledge chat',
  description: 'Ask questions grounded in the team design knowledge base.',
}

export default function ChatPage() {
  const requiresAccessToken = Boolean(process.env.CHAT_ACCESS_TOKEN)
  return (
    <div className="mx-auto max-w-3xl flex-1 px-4 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Knowledge chat
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Answers are generated from published Sanity entries (frameworks, processes, insights, and
          more). They are not arbitrary database queries—context is refreshed on each message.
        </p>
      </header>
      <ChatPanel requiresAccessToken={requiresAccessToken} />
    </div>
  )
}
