import Link from 'next/link'

/* ── Decorative floating shapes ── */
function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Large warm glow top-right */}
      <div className="bg-sunshine/25 absolute -right-20 -top-10 size-72 rounded-full blur-3xl md:size-96" />
      {/* Soft brand glow bottom-left */}
      <div className="bg-brand/10 absolute -left-24 bottom-12 size-56 rounded-full blur-3xl md:size-72" />
      {/* Pink accent blob */}
      <div className="bg-pink/15 absolute right-8 bottom-32 size-32 rounded-full blur-2xl md:right-20" />

      {/* Small floating shape accents */}
      <div className="animate-float absolute right-12 top-28 md:right-32 md:top-20">
        <div className="bg-sunshine blob-1 size-10 opacity-60 md:size-14" />
      </div>
      <div className="animate-float-slow absolute left-4 top-48 md:left-16 md:top-40">
        <div className="bg-pink blob-2 size-7 opacity-40 md:size-10" />
      </div>
      <div className="animate-bounce-gentle absolute right-4 bottom-48 md:right-24 md:bottom-40">
        <div className="bg-brand blob-3 size-6 opacity-30 md:size-9" />
      </div>
      <div className="animate-wiggle absolute left-8 bottom-20 md:left-32 md:bottom-24">
        <div className="bg-green size-5 rounded-full opacity-40 md:size-7" />
      </div>
      <div className="animate-pulse-soft absolute right-24 top-56 md:right-48">
        <div className="bg-purple size-4 rounded-full opacity-35 md:size-6" />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-12 overflow-hidden px-4 py-16 md:py-28">
      <FloatingShapes />

      {/* ── Hero ── */}
      <div className="relative">
        <p className="text-cta flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
          <span className="bg-sunshine inline-block size-2 rounded-full" aria-hidden />
          Design thinking
        </p>
        <h1 className="text-foreground mt-4 text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.08]">
          Your team&apos;s
          <br />
          <span className="text-brand">design wisdom,</span>
          <br />
          always within reach
        </h1>
        <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed font-semibold md:text-xl">
          Frameworks, processes, principles, and insights — curated by your design
          leaders, ready whenever you need them. Ask a question, get an opinionated answer
          grounded in what your team actually believes.
        </p>
      </div>

      {/* ── CTAs ── */}
      <div className="relative flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="bg-cta hover:bg-cta-hover hover-lift inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-extrabold tracking-wide text-white uppercase shadow-lg transition-all"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Open knowledge chat
        </Link>
        <a
          href="https://www.sanity.io/docs"
          className="border-border-playful text-brand hover:bg-sunshine-wash hover-lift inline-flex items-center justify-center rounded-full border-2 border-dashed bg-transparent px-6 py-4 text-sm font-bold transition-all"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sanity docs
        </a>
      </div>

      {/* ── Feature hints ── */}
      <div className="relative grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: '💡',
            label: 'Frameworks & models',
            desc: 'Mental models your team uses daily',
            color: 'bg-sunshine/20 border-sunshine/40',
          },
          {
            icon: '🧭',
            label: 'Processes & steps',
            desc: 'How we actually do things here',
            color: 'bg-brand-light border-brand/20',
          },
          {
            icon: '✨',
            label: 'Principles & insights',
            desc: 'Hard-won opinions, not platitudes',
            color: 'bg-pink/10 border-pink/25',
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`hover-lift rounded-2xl border-2 ${item.color} px-5 py-4`}
          >
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <p className="text-foreground mt-2 text-sm font-extrabold">{item.label}</p>
            <p className="text-muted mt-0.5 text-xs font-semibold leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
