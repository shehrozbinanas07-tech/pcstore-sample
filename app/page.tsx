import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'PC Store — Performance Tech, Curated for Pakistan',
  description:
    'Custom gaming PCs, laptops, Sony cameras and pro audio. Two Islamabad showrooms. Nationwide delivery across Pakistan.',
}

type StorefrontProduct = {
  id: string
  name: string
  description: string | null
  base_price: number
  sale_price: number | null
  is_on_sale: boolean
  image_url: string | null
  category: string | null
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, base_price, sale_price, is_on_sale, image_url, category')
    .order('created_at', { ascending: false })
    .limit(8)

  const featured = (products as StorefrontProduct[] | null) ?? []

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

      <header className="relative border-b border-line/80 bg-paper/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[11px] bg-ink text-paper">
              <svg viewBox="0 0 32 32" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
                <rect x="4" y="6" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 26h8M16 22v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="14" r="3" fill="currentColor" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-display text-xl font-semibold tracking-tight">PC Store</p>
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted">
                est. Canon Link
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
            <a href="#catalog" className="transition hover:text-ink">
              Shop
            </a>
            <a href="#stores" className="transition hover:text-ink">
              Stores
            </a>
            <Link href="/login" className="transition hover:text-ink">
              Staff login
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90 md:hidden"
          >
            Staff login
          </Link>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">
            / Islamabad · since the Canon Link era
          </p>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                The right gear,
                <span className="block italic text-warm">chosen with care.</span>
              </h1>
              <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
                Custom gaming rigs, MacBooks, Sony cameras and studio audio — hand-curated and
                supported by people who actually know the gear.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center gap-2 rounded-xl bg-warm px-6 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(184,80,43,0.35)] transition hover:bg-warm-light"
                >
                  Browse the store
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a
                  href="tel:+92512150227"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-paper-2"
                >
                  Call (051) 215-0227
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_14px_36px_rgba(24,26,31,0.08)]">
              <img
                src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1000&q=80&auto=format&fit=crop"
                alt="Custom gaming PC setup with ambient lighting"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="border-t border-line bg-paper-2/80 px-6 py-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                  Featured build
                </p>
                <p className="mt-1 font-display text-xl font-semibold tracking-tight">Aurora RTX</p>
              </div>
            </div>
          </div>

          <dl className="mt-16 grid gap-6 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Showrooms', value: '2 in Islamabad' },
              { label: 'Catalogue', value: '10,000+ products' },
              { label: 'Delivery', value: 'Nationwide · 24h dispatch' },
              { label: 'Support', value: 'Expert advice in-store' },
            ].map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.06em] text-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="catalog" className="border-t border-line bg-paper-2/60 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">/ Catalog</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Latest from the showroom
            </h2>

            {featured.length === 0 ? (
              <p className="mt-8 max-w-lg text-ink-soft">
                New inventory is being added. Visit our Islamabad showrooms or call us for current
                availability.
              </p>
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(24,26,31,0.04),0_4px_16px_rgba(24,26,31,0.05)]"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="grid aspect-square place-items-center bg-paper text-muted">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      {product.category && (
                        <p className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-warm">
                          {product.category}
                        </p>
                      )}
                      <h3 className="mt-1 font-medium text-ink">{product.name}</h3>
                      {product.is_on_sale && product.sale_price != null ? (
                        <div className="mt-2">
                          <p className="font-medium text-warm">{formatPrice(product.sale_price)}</p>
                          <p className="text-xs text-muted line-through">{formatPrice(product.base_price)}</p>
                        </div>
                      ) : (
                        <p className="mt-2 font-medium text-ink">{formatPrice(product.base_price)}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="stores" className="border-t border-line py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">/ Visit us</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Islamabad showrooms</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                { name: 'Blue Area', hours: 'Mon–Sat · 10:30 AM – 8:30 PM' },
                { name: 'F-10 Markaz', hours: 'Mon–Sat · 10:30 AM – 8:30 PM' },
              ].map((store) => (
                <div
                  key={store.name}
                  className="rounded-2xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(24,26,31,0.04),0_4px_16px_rgba(24,26,31,0.05)]"
                >
                  <h3 className="font-display text-xl font-semibold tracking-tight">{store.name}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{store.hours}</p>
                  <p className="mt-1 text-sm text-muted">Closed Sundays</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-ink py-10 text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-paper/70 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} PC Store · Islamabad, Pakistan</p>
          <Link href="/login" className="transition hover:text-paper">
            Staff portal
          </Link>
        </div>
      </footer>
    </div>
  )
}
