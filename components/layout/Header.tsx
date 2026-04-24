'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/lib/cart'
import { useTheme } from '@/lib/theme'

const NAV = [
  { label: 'Shop',    href: '/shop' },
  { label: 'Bundles', href: '/bundles' },
  { label: 'Docs',    href: '/docs' },
  { label: 'Learn',   href: '/learn' },
  { label: 'Support', href: '/support' },
  { label: 'About',   href: '/about' },
]

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ color: 'var(--text-secondary)' }}
      className="p-2 rounded-md hover:opacity-80 transition-opacity"
    >
      {theme === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { cart } = useCart()

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <span className="font-bold text-xs font-display" style={{ color: '#080d1a' }}>A</span>
            </div>
            <span className="font-display font-semibold text-[15px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Atoms
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm rounded-md transition-all duration-150 hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            {/* Search */}
            <Link href="/search" className="hidden sm:flex p-2 rounded-md transition-all" style={{ color: 'var(--text-secondary)' }} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            {/* Account */}
            <Link href={user ? '/account' : '/auth/login'} className="hidden sm:flex p-2 rounded-md transition-all" style={{ color: 'var(--text-secondary)' }} aria-label="Account">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-md transition-all" style={{ color: 'var(--text-secondary)' }} aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center" style={{ background: 'var(--accent)', color: '#080d1a' }}>
                  {cart.itemCount > 9 ? '9+' : cart.itemCount}
                </span>
              )}
            </Link>

            {/* Shop CTA */}
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ml-1"
              style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
            >
              Shop now
            </Link>

            {/* Mobile burger */}
            <button className="md:hidden p-2 rounded-md" style={{ color: 'var(--text-secondary)' }} onClick={() => setOpen(!open)}>
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
          <div className="md:hidden py-3" style={{ borderTop: '1px solid var(--border)' }}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm rounded-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? '/account' : '/auth/login'}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm rounded-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              {user ? 'My account' : 'Sign in'}
            </Link>
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Link
                href="/shop"
                className="block text-center px-4 py-2.5 text-sm font-semibold rounded-lg"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                Shop now
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
