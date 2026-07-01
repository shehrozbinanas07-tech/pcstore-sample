import { AdminSidebar } from './admin-sidebar'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-paper-2 text-ink">
      <AdminSidebar />

      <div className="min-h-screen pl-[260px]">
        <main className="min-h-screen px-8 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  )
}
