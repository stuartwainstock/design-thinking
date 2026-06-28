import type {Metadata} from 'next'
import {getSiteContent} from '@/lib/sanity'
import {JsonLd} from '@/components/JsonLd'
import {faqSchema, graph} from '@/lib/structuredData'

export async function generateMetadata(): Promise<Metadata> {
  const {seo} = await getSiteContent()
  return {
    title: {absolute: seo.aboutMetaTitle},
    description: seo.aboutMetaDescription,
    alternates: {canonical: '/about'},
    openGraph: {title: seo.aboutMetaTitle, description: seo.aboutMetaDescription, url: '/about'},
    twitter: {title: seo.aboutMetaTitle, description: seo.aboutMetaDescription},
  }
}

const STACK_CARD_COLORS = [
  'bg-brand-light border-brand/20',
  'bg-sunshine/20 border-sunshine/40',
  'bg-pink/10 border-pink/25',
  'bg-green/10 border-green/30',
  'bg-purple/10 border-purple/30',
]

export default async function About() {
  const site = await getSiteContent()

  return (
    <section className="relative flex flex-1 flex-col overflow-x-clip">
      {site.faq.length > 0 && <JsonLd data={graph(faqSchema(site.faq))} />}
      {/* ── Full-bleed background glows ── */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        <div className="bg-sunshine/20 absolute -top-10 right-[6%] size-64 rounded-full blur-3xl md:size-96" />
        <div className="bg-brand/10 absolute bottom-24 left-[3%] size-56 rounded-full blur-3xl md:size-80" />
        <div className="bg-pink/12 absolute top-1/2 right-[18%] size-36 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-1 flex-col gap-16 px-4 py-16 md:py-24">
        {/* ── About / Mission ── */}
        <div className="relative">
          {site.aboutEyebrow && (
            <p className="text-brand flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.2em]">
              <span className="bg-pink inline-block size-2 rounded-full" aria-hidden />
              {site.aboutEyebrow}
            </p>
          )}
          {site.aboutHeadline && (
            <h1 className="text-foreground mt-4 text-4xl font-extrabold tracking-tight md:text-5xl md:leading-[1.1]">
              {site.aboutHeadline}
            </h1>
          )}
          {site.aboutBody && (
            <p className="text-muted mt-6 max-w-xl whitespace-pre-line text-lg font-semibold leading-relaxed">
              {site.aboutBody}
            </p>
          )}
          {site.aboutSubline && (
            <p className="text-brand mt-5 text-lg font-extrabold">{site.aboutSubline}</p>
          )}
        </div>

        {/* ── Architecture ── */}
        {site.stackCards.length > 0 && (
          <div className="relative">
            {site.stackSectionTitle && (
              <h2 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
                {site.stackSectionTitle}
              </h2>
            )}
            <div className="mt-6 flex flex-col gap-3">
              {site.stackCards.map((card, i) => (
                <div
                  key={`${card.name}-${i}`}
                  className={`hover-lift rounded-2xl border-2 ${STACK_CARD_COLORS[i % STACK_CARD_COLORS.length]} px-6 py-5`}
                >
                  <p className="text-foreground text-xl font-extrabold tracking-tight">{card.name}</p>
                  {card.descriptor && (
                    <p className="text-foreground/80 mt-1 text-base font-bold">{card.descriptor}</p>
                  )}
                  {card.role && (
                    <p className="text-muted mt-1 text-sm font-semibold leading-relaxed">{card.role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Convictions ── */}
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
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {site.convictions.map((conviction, i) => (
                <div
                  key={`${conviction.label}-${i}`}
                  className="border-border-playful bg-surface rounded-2xl border-2 px-5 py-5"
                >
                  {conviction.label && (
                    <code className="text-brand font-mono text-sm font-bold">{conviction.label}</code>
                  )}
                  {conviction.question && (
                    <p className="text-foreground mt-2 text-base font-extrabold">{conviction.question}</p>
                  )}
                  {conviction.description && (
                    <p className="text-muted mt-1.5 text-sm font-semibold leading-relaxed">
                      {conviction.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {site.faq.length > 0 && (
          <div className="relative">
            {site.faqSectionTitle && (
              <h2 className="text-foreground text-3xl font-extrabold tracking-tight md:text-4xl">
                {site.faqSectionTitle}
              </h2>
            )}
            <div className="mt-6 flex flex-col gap-4">
              {site.faq.map((item, i) => (
                <div
                  key={`${item.question}-${i}`}
                  className="border-border-playful bg-surface rounded-2xl border-2 px-6 py-5"
                >
                  <h3 className="text-foreground text-lg font-extrabold tracking-tight">
                    {item.question}
                  </h3>
                  <p className="text-muted mt-2 whitespace-pre-line text-base font-semibold leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
