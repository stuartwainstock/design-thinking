import Link from 'next/link'

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-10 px-4 py-20">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Design thinking
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Team knowledge base
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          A small external-facing space for your design frameworks, processes, principles, and
          insights—backed by Sanity, with a chat assistant for team members.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Open knowledge chat
        </Link>
        <a
          href="https://www.sanity.io/docs"
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sanity docs
        </a>
      </div>
    </div>
  )
}
