import type {Metadata} from 'next'
import Link from 'next/link'
import {getSiteContent} from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Design thinking knowledge — Home',
  description:
    "Your team's design wisdom — frameworks, processes, principles, and insights curated by your design leaders.",
}

const CARD_COLORS = [
  'bg-sunshine/20 border-sunshine/40',
  'bg-brand-light border-brand/20',
  'bg-pink/10 border-pink/25',
]

const STACK_CARD_COLORS = [
  'bg-brand-light border-brand/20',
  'bg-sunshine/20 border-sunshine/40',
  'bg-pink/10 border-pink/25',
  'bg-green/10 border-green/30',
  'bg-purple/10 border-purple/30',
]

export default async function Home() {
  const site = await getSiteContent()

  /* Split headline on newlines so we can style the second line as brand-colored */
  const headlineLines = site.landingHeadline.split('\n')

  return (
    <section className="relative flex flex-1 flex-col overflow-x-clip">
      {/* ── Full-bleed background glows ── */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        <div className="bg-sunshine/25 absolute -top-10 right-[5%] size-72 rounded-full blur-3xl md:size-112" />
        <div className="bg-brand/10 absolute bottom-12 left-[2%] size-56 rounded-full blur-3xl md:size-80" />
        <div className="bg-pink/12 absolute bottom-36 right-[15%] size-36 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-12 px-4 py-16 md:py-28">
        {/* Small animated accent shapes */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
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

        {/* ── Hero ── */}
        <div className="relative">
          {/* Second line (index 1) uses brand color; keep in sync with Site content headline field description */}
          <p className="text-brand flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
            <span className="bg-sunshine inline-block size-2 rounded-full" aria-hidden />
            {site.landingEyebrow}
          </p>
          <h1 className="text-foreground mt-4 text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.08]">
            {headlineLines.map((line, i) =>
              i === 1 ? (
                <span key={i}>
                  <span className="text-brand">{line}</span>
                  <br />
                </span>
              ) : (
                <span key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </span>
              ),
            )}
          </h1>
          <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed font-semibold md:text-xl">
            {site.landingDescription}
          </p>
        </div>

        {/* ── CTA ── */}
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
            {site.landingCta}
          </Link>
        </div>

        {/* ── About / Mission ── */}
        {(site.aboutHeadline || site.aboutBody) && (
          <div className="relative">
            {site.aboutEyebrow && (
              <p className="text-brand flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
                <span className="bg-pink inline-block size-2 rounded-full" aria-hidden />
                {site.aboutEyebrow}
              </p>
            )}
            {site.aboutHeadline && (
              <h2 className="text-foreground mt-4 text-3xl font-extrabold tracking-tight md:text-4xl md:leading-[1.12]">
                {site.aboutHeadline}
              </h2>
            )}
            {site.aboutBody && (
              <p className="text-muted mt-5 max-w-xl whitespace-pre-line text-lg font-semibold leading-relaxed">
                {site.aboutBody}
              </p>
            )}
            {site.aboutSubline && (
              <p className="text-brand mt-4 text-base font-extrabold">{site.aboutSubline}</p>
            )}
          </div>
        )}

        {/* ── Tech stack ── */}
        {site.stackCards.length > 0 && (
          <div className="relative">
            {site.stackSectionTitle && (
              <h2 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
                {site.stackSectionTitle}
              </h2>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {site.stackCards.map((card, i) => (
                <div
                  key={`${card.name}-${i}`}
                  className={`hover-lift rounded-2xl border-2 ${STACK_CARD_COLORS[i % STACK_CARD_COLORS.length]} px-5 py-5`}
                >
                  <p className="text-brand text-xs font-extrabold uppercase tracking-[0.2em]">
                    {card.name}
                  </p>
                  {card.descriptor && (
                    <p className="text-foreground mt-2 text-base font-extrabold">{card.descriptor}</p>
                  )}
                  {card.role && (
                    <p className="text-foreground/75 mt-1 text-sm font-semibold leading-relaxed">
                      {card.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Design convictions ── */}
        {site.convictions.length > 0 && (
          <div className="relative">
            {site.convictionsSectionTitle && (
              <h2 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
                {site.convictionsSectionTitle}
              </h2>
            )}
            {site.convictionsIntro && (
              <p className="text-muted mt-4 max-w-xl whitespace-pre-line text-lg font-semibold leading-relaxed">
                {site.convictionsIntro}
              </p>
            )}
            <ul className="mt-6 space-y-3">
              {site.convictions.map((conviction, i) => (
                <li
                  key={`${conviction.label}-${i}`}
                  className="border-border-playful bg-surface rounded-2xl border-2 px-5 py-4"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {conviction.label && (
                      <span className="text-brand font-mono text-sm font-bold">
                        {conviction.label}
                      </span>
                    )}
                    {conviction.question && (
                      <span className="text-foreground text-base font-extrabold">
                        {conviction.question}
                      </span>
                    )}
                  </div>
                  {conviction.description && (
                    <p className="text-muted mt-1.5 text-sm font-semibold leading-relaxed">
                      {conviction.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Feature cards ── */}
        {site.featureCards.length > 0 && (
          <div className="relative grid gap-4 sm:grid-cols-3">
            {site.featureCards.map((card, i) => (
              <div
                key={`${card.label}-${i}`}
                className={`hover-lift rounded-2xl border-2 ${CARD_COLORS[i % CARD_COLORS.length]} px-5 py-4`}
              >
                <span className="text-2xl" aria-hidden>
                  {card.icon}
                </span>
                <p className="text-foreground mt-2 text-sm font-extrabold">{card.label}</p>
                <p className="text-foreground/75 mt-0.5 text-xs font-semibold leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
