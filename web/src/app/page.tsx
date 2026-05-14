import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-10 overflow-hidden px-4 py-16 md:py-24">
      <div
        className="bg-sun/35 pointer-events-none absolute -right-16 top-8 size-48 rounded-full blur-2xl md:size-64"
        aria-hidden
      />
      <div
        className="bg-brand/15 pointer-events-none absolute -left-20 bottom-24 size-40 rounded-full blur-2xl"
        aria-hidden
      />
      <div className="relative">
        <p className="text-brand font-extrabold uppercase tracking-[0.2em]">Design thinking</p>
        <h1 className="text-foreground mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
          Team knowledge base
        </h1>
        <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed font-semibold">
          A small external-facing space for your design frameworks, processes, principles, and
          insights—backed by Sanity, with a chat assistant for team members.
        </p>
      </div>
      <div className="relative flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="bg-cta hover:bg-cta-hover inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-extrabold tracking-wide text-white uppercase shadow-md transition-colors"
        >
          Open knowledge chat
        </Link>
        <a
          href="https://www.sanity.io/docs"
          className="border-border-playful text-brand hover:bg-sun-wash inline-flex items-center justify-center rounded-full border-2 border-dashed bg-transparent px-6 py-3.5 text-sm font-bold transition-colors"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sanity docs
        </a>
      </div>
    </div>
  )
}
