import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-warm/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-line-strong/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:flex-row lg:items-center lg:gap-16 lg:px-10">
        <section className="mb-12 flex-1 lg:mb-0">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[11px] bg-ink text-paper">
              <svg viewBox="0 0 32 32" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
                <rect
                  x="4"
                  y="6"
                  width="24"
                  height="16"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 26h8M16 22v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="14" r="3" fill="currentColor" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-display text-xl font-semibold tracking-tight">PC Store</p>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted">
                Admin portal
              </p>
            </div>
          </div>

          <p className="mb-4 font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">
            / Secure access
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Welcome back to the
            <span className="block italic text-warm">control room.</span>
          </h1>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
            Sign in to manage inventory, orders, and showroom operations across both Islamabad
            locations.
          </p>

          <dl className="mt-10 grid max-w-sm grid-cols-2 gap-4 border-t border-line pt-8">
            <div>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.06em] text-muted">
                Locations
              </dt>
              <dd className="mt-1 text-sm font-medium">F-10 · Blue Area</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.06em] text-muted">
                Coverage
              </dt>
              <dd className="mt-1 text-sm font-medium">Nationwide delivery</dd>
            </div>
          </dl>
        </section>

        <section className="w-full max-w-md">
          <div className="rounded-[28px] border border-line bg-white/80 p-8 shadow-[0_14px_36px_rgba(24,26,31,0.08)] backdrop-blur-sm sm:p-10">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Sign in</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Use your staff credentials to access the dashboard.
              </p>
            </div>

            <LoginForm />

            <p className="mt-8 text-center text-xs text-muted">
              Need access? Contact your store administrator.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
