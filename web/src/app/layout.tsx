import type {Metadata} from 'next'
import Link from 'next/link'
import {Geist_Mono, Nunito} from 'next/font/google'
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
  title: 'Design thinking knowledge',
  description: 'Design knowledge base and team chat.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="text-foreground flex min-h-full flex-col">
        <header className="sticky top-0 z-10 px-4 pt-4 pb-2">
          <nav className="border-border-playful bg-surface/90 text-foreground mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border px-2 py-2 pl-5 text-sm font-semibold shadow-sm backdrop-blur-md">
            <Link
              href="/"
              className="text-brand hover:text-brand-muted inline-flex flex-col items-start gap-0.5 lowercase transition-colors"
            >
              <span className="flex gap-1 pl-1" aria-hidden>
                <span className="bg-brand size-1.5 rounded-full" />
                <span className="bg-brand size-1.5 rounded-full" />
              </span>
              <span className="leading-none tracking-tight">design thinking</span>
            </Link>
            <Link
              href="/chat"
              className="bg-cta hover:bg-cta-hover rounded-full px-4 py-2 text-white shadow-sm transition-colors"
            >
              Chat
            </Link>
          </nav>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  )
}
