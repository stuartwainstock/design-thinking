import type {Metadata} from 'next'
import Link from 'next/link'
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 text-sm">
            <Link href="/" className="font-medium text-zinc-900 dark:text-zinc-50">
              Home
            </Link>
            <Link
              href="/chat"
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-white dark:bg-zinc-100 dark:text-zinc-900"
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
