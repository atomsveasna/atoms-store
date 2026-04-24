'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'

const NAV = [
  { label: 'Shop',    href: '/shop' },
  { label: 'Bundles', href: '/bundles' },
  { label: 'Docs',    href: '/docs' },
  { label: 'Learn',   href: '/learn' },
  { label: 'Support', href: '/support' },
  { label: 'About',   href: '/about' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { cart } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080d1a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-cyan-400 flex items-center justify-center">
              <span className="text-[#080d1a] font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-white text-[15px] tracking-tight">Atoms</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="px-3.5 py-2 text-sm text-white/60 hover:text-white rounded-md hover:bg-white/[0.06] transition-all duration-150">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link
              href="/search"
              className="hidden sm:flex p-2 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-md transition-all"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            {/* Account */}
            <Link
              href={user ? '/account' : '/auth/login'}
              className="hidden sm:flex p-2 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-md transition-all"
              aria-label="Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-md transition-all"
              aria-label="Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-400 text-[#080d1a] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.itemCount > 9 ? '9+' : cart.itemCount}
                </span>
              )}
            </Link>

            {/* Shop CTA */}
            <Link href="/shop" className="hidden sm:inline-flex items-center px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] text-sm font-semibold rounded-lg transition-colors">
              Shop now
            </Link>

            {/* Mobile burger */}
            <button className="md:hidden p-2 text-white/60 hover:text-white rounded-md" onClick={() => setOpen(!open)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-white/[0.06] py-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm text-white/70 hover:text-white rounded-md">
                {item.label}
              </Link>
            ))}
            <Link href={user ? '/account' : '/auth/login'} onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm text-white/70 hover:text-white rounded-md">
              {user ? 'My account' : 'Sign in'}
            </Link>
            <div className="pt-3 mt-3 border-t border-white/[0.06]">
              <Link href="/shop" className="block text-center px-4 py-2.5 bg-cyan-400 text-[#080d1a] text-sm font-semibold rounded-lg">
                Shop now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
