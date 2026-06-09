import type {Metadata} from 'next'
import {AdminQueriesDashboard} from '@/components/AdminQueriesDashboard'

export const metadata: Metadata = {
  title: 'Query insights — Admin',
  description: 'Executive view of knowledge agent chat queries.',
  robots: {index: false, follow: false},
}

export default function AdminQueriesPage() {
  const requiresAccessToken = Boolean(process.env.ADMIN_ACCESS_TOKEN)

  return (
    <section className="relative flex flex-1 flex-col overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        <div className="bg-brand/8 absolute -top-10 left-[10%] size-64 rounded-full blur-3xl md:size-80" />
        <div className="bg-sunshine/15 absolute right-[8%] bottom-24 size-56 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:py-14">
        <AdminQueriesDashboard requiresAccessToken={requiresAccessToken} />
      </div>
    </section>
  )
}
