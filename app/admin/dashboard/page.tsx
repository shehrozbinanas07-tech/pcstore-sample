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
    <div className="min-h-screen bg-paper px-6 py-12 text-ink">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">
          / Admin
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-3 text-ink-soft">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>
      </div>
    </div>
  )
}
