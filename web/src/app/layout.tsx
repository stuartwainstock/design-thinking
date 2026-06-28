import type {Metadata} from 'next'
import Link from 'next/link'
import {Geist_Mono, Nunito} from 'next/font/google'
import {GoogleAnalytics} from '@/components/GoogleAnalytics'
import {getSiteContent} from '@/lib/sanity'
import {getSiteUrl} from '@/lib/siteUrl'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'fieldnotes — your design team’s knowledge, on demand',
  description: 'fieldnotes — your design team’s knowledge base and chat.',
}

/** Fallback ISR if the Sanity → /api/revalidate webhook misses; primary refresh is on publish. */
export const revalidate = 60

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const site = await getSiteContent()
  const brandLabel = site.navBrandLabel || 'fieldnotes.design'
  const ctaLabel = site.navCtaLabel || 'Chat'
  const ctaHref = site.navCtaHref || '/chat'

  return (
    <html lang="en" className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="text-foreground flex min-h-full flex-col">
        <GoogleAnalytics />
        <a href="#main-content" className="skip-link sr-only">
          Skip to main content
        </a>
        {/* ── Nav ── */}
        <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
          <nav
            aria-label="Main"
            className="border-border-playful bg-surface/90 text-foreground mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border-2 px-3 py-2 pl-5 text-sm font-semibold shadow-md backdrop-blur-md"
          >
            <Link
              href="/"
              className="text-brand hover:text-brand-muted group inline-flex items-center gap-2.5 lowercase transition-colors"
            >
              {/* Decorative dots */}
              <span className="flex flex-col gap-0.5" aria-hidden>
                <span className="flex gap-0.5">
                  <span className="bg-cta-accent size-1.5 rounded-full transition-transform group-hover:scale-125" />
                  <span className="bg-sunshine size-1.5 rounded-full transition-transform group-hover:scale-125" />
                </span>
                <span className="flex gap-0.5">
                  <span className="bg-brand size-1.5 rounded-full transition-transform group-hover:scale-125" />
                  <span className="bg-pink size-1.5 rounded-full transition-transform group-hover:scale-125" />
                </span>
              </span>
              <span className="text-base font-extrabold leading-none tracking-tight">
                {brandLabel}
              </span>
            </Link>
            <Link
              href={ctaHref}
              className="bg-cta hover:bg-cta-hover hover-lift rounded-full px-5 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-sm transition-colors"
            >
              {ctaLabel}
            </Link>
          </nav>
        </header>

        {/* ── Main ── */}
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-border-playful mt-auto border-t-2 px-4 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5">
            {/* Decorative divider dots */}
            <div className="flex gap-2" aria-hidden>
              <span className="bg-pink size-2.5 rounded-full" />
              <span className="bg-sunshine size-2.5 rounded-full" />
              <span className="bg-brand size-2.5 rounded-full" />
              <span className="bg-green size-2.5 rounded-full" />
              <span className="bg-purple size-2.5 rounded-full" />
            </div>
            <nav aria-label="Footer">
              <Link
                href="/about"
                className="text-brand hover:text-brand-muted text-xs font-bold transition-colors"
              >
                About
              </Link>
            </nav>
            <p className="text-muted text-center text-xs font-semibold leading-relaxed">
              Built with care on{' '}
              <a
                href="https://www.sanity.io"
                className="text-brand hover:text-brand-muted font-bold transition-colors"
                rel="noopener noreferrer"
                target="_blank"
              >
                Sanity
              </a>
              {' · '}
              Powered by{' '}
              <a
                href="https://www.anthropic.com"
                className="text-brand hover:text-brand-muted font-bold transition-colors"
                rel="noopener noreferrer"
                target="_blank"
              >
                Claude
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
