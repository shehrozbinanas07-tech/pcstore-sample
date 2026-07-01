'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type NavItem = {
  label: string
  href: string
  external?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard' }],
  },
  {
    title: 'Content Management',
    items: [
      { label: 'Products', href: '/admin/products' },
      { label: 'Blogs', href: '/admin/blogs' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings' },
      { label: 'View Live Site', href: '/', external: true },
    ],
  },
]

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const baseClass =
    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
  const activeClass = active
    ? 'bg-white/10 text-white shadow-[inset_2px_0_0_0_#d4764a]'
    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'

  const content = (
    <>
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          active ? 'bg-warm-light' : 'bg-zinc-600 group-hover:bg-zinc-400'
        }`}
        aria-hidden="true"
      />
      {item.label}
      {item.external && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="ml-auto opacity-50"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      )}
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${activeClass}`}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={item.href} className={`${baseClass} ${activeClass}`}>
      {content}
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/10 bg-[#12141a] text-zinc-100">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-white/10 text-white">
          <svg viewBox="0 0 32 32" fill="none" className="h-[20px] w-[20px]" aria-hidden="true">
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
        <div className="min-w-0 leading-tight">
          <p className="truncate font-display text-base font-semibold tracking-tight">PC Store</p>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-zinc-500">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-zinc-500">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={pathname === item.href} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-70"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.08em] text-zinc-600">
          PC Store · Islamabad
        </p>
      </div>
    </aside>
  )
}
