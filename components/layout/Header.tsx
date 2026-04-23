'use client'
import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'Docs', href: '/docs' },
  { label: 'Learn', href: '/learn' },
  { label: 'Support', href: '/support' },
  { label: 'About', href: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080d1a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-cyan-400 flex items-center justify-center">
              <span className="text-[#080d1a] font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-white text-[15px] tracking-tight">Atoms</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="px-3.5 py-2 text-sm text-white/60 hover:text-white rounded-md hover:bg-white/[0.06] transition-all duration-150">{item.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="hidden sm:inline-flex items-center px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] text-sm font-semibold rounded-lg transition-colors">Shop now</Link>
            <button className="md:hidden p-2 text-white/60 hover:text-white rounded-md" onClick={() => setOpen(!open)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-white/[0.06] py-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm text-white/70 hover:text-white rounded-md">{item.label}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
