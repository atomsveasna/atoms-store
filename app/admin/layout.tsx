import LogoutButton from '@/components/admin/LogoutButton'

export const metadata = {
  title: 'Admin — Atoms',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060b17] text-white">
      <div className="border-b border-white/[0.06] bg-[#080d1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-cyan-400 flex items-center justify-center">
            <span className="text-[#080d1a] font-bold text-[10px]">A</span>
          </div>
          <span className="text-sm font-semibold text-white">Atoms</span>
          <span className="text-white/20 text-sm">/</span>
          <span className="text-sm text-white/50">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/admin" className="text-xs text-white/40 hover:text-white transition-colors">Products & Orders</a>
          <a href="/admin/analytics" className="text-xs text-white/40 hover:text-white transition-colors">Analytics</a>
          <a href="/" className="text-xs text-white/30 hover:text-white transition-colors">← Back to site</a>
          <LogoutButton />
        </div>
      </div>
      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
