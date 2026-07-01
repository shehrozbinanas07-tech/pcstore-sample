import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">/ Overview</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 text-ink-soft">
        Signed in as <span className="font-medium text-ink">{user.email}</span>
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Products', value: '—', hint: 'Catalog items' },
          { label: 'Orders', value: '—', hint: 'Pending review' },
          { label: 'Blog posts', value: '—', hint: 'Published' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_2px_rgba(24,26,31,0.04),0_4px_16px_rgba(24,26,31,0.05)]"
          >
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.06em] text-muted">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{stat.hint}</p>
          </div>
        ))}
      </div>
    </>
  )
}
