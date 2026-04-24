'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import type { Product } from '@/types'

const COMPARE_KEY = 'atoms-compare'
const MAX_COMPARE = 3

// ── Compare context helpers ───────────────────────────────────
export function getCompareList(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) ?? '[]') } catch { return [] }
}

export function toggleCompare(slug: string): boolean {
  const list = getCompareList()
  const idx  = list.indexOf(slug)
  if (idx > -1) {
    list.splice(idx, 1)
  } else {
    if (list.length >= MAX_COMPARE) return false // max reached
    list.push(slug)
  }
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('compare-updated'))
  return true
}

export function isInCompare(slug: string): boolean {
  return getCompareList().includes(slug)
}

// ── Compare bar (floating) ────────────────────────────────────
export function CompareBar() {
  const [slugs, setSlugs]       = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    function update() {
      const list = getCompareList()
      setSlugs(list)
      if (list.length > 0) {
        fetch(`/api/products/compare?slugs=${list.join(',')}`)
          .then((r) => r.json())
          .then((d) => setProducts(d.products ?? []))
          .catch(() => {})
      } else {
        setProducts([])
      }
    }
    update()
    window.addEventListener('compare-updated', update)
    return () => window.removeEventListener('compare-updated', update)
  }, [])

  if (slugs.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080d1a]/95 backdrop-blur-md border-t border-white/[0.08] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex gap-3 flex-1 overflow-x-auto scrollbar-hide">
          {products.map((p) => (
            <div key={p.slug} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] flex-shrink-0">
              <span className="text-sm text-white/80">{p.name}</span>
              <button
                onClick={() => { toggleCompare(p.slug) }}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-white/30">{slugs.length}/{MAX_COMPARE}</span>
          <Link
            href="/compare"
            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-lg transition-colors"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Compare toggle button ─────────────────────────────────────
export function CompareButton({ slug }: { slug: string }) {
  const [inList, setInList] = useState(false)

  useEffect(() => {
    function update() { setInList(isInCompare(slug)) }
    update()
    window.addEventListener('compare-updated', update)
    return () => window.removeEventListener('compare-updated', update)
  }, [slug])

  return (
    <button
      onClick={() => { const ok = toggleCompare(slug); if (!ok) alert(`Max ${MAX_COMPARE} products`) }}
      className={`flex items-center gap-1.5 text-xs font-medium transition-all ${
        inList ? 'text-cyan-400' : 'text-white/30 hover:text-white/60'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {inList
          ? <polyline points="20 6 9 17 4 12"/>
          : <><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></>
        }
      </svg>
      {inList ? 'Added to compare' : 'Add to compare'}
    </button>
  )
}

// ── Compare page ──────────────────────────────────────────────
export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const slugs = getCompareList()
    if (slugs.length === 0) { setLoading(false); return }
    fetch(`/api/products/compare?slugs=${slugs.join(',')}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"/>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/40 text-sm mb-2">No products selected for comparison.</p>
        <Link href="/shop" className="text-cyan-400 text-sm hover:underline">Browse products →</Link>
      </div>
    )
  }

  // All unique spec labels
  const allSpecs = Array.from(new Set(products.flatMap((p) => p.specs.map((s) => s.label))))

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Compare</p>
          <h1 className="text-3xl font-bold text-white">Product comparison</h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">

            {/* Product headers */}
            <thead>
              <tr>
                <th className="text-left py-4 pr-6 w-40">
                  <span className="text-xs text-white/30 font-normal">Comparing {products.length} products</span>
                </th>
                {products.map((p) => (
                  <th key={p.slug} className="text-left py-4 px-4">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                      </div>
                      <div>
                        <Link href={`/products/${p.slug}`} className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors block">{p.name}</Link>
                        <p className="text-xs text-white/30 mt-0.5">{p.sku}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price row */}
              <tr className="border-t border-white/[0.06]">
                <td className="py-4 pr-6 text-xs font-semibold text-white/40 uppercase tracking-widest">Price</td>
                {products.map((p) => (
                  <td key={p.slug} className="py-4 px-4">
                    <span className="text-xl font-bold text-white">{formatPrice(p.price, p.currency)}</span>
                  </td>
                ))}
              </tr>

              {/* Status row */}
              <tr className="border-t border-white/[0.06]">
                <td className="py-4 pr-6 text-xs font-semibold text-white/40 uppercase tracking-widest">Status</td>
                {products.map((p) => (
                  <td key={p.slug} className="py-4 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.status === 'in_stock'  ? 'bg-emerald-400/10 text-emerald-400' :
                      p.status === 'low_stock' ? 'bg-amber-400/10 text-amber-400' :
                      'bg-white/[0.05] text-white/30'
                    }`}>{getStatusLabel(p.status)}</span>
                  </td>
                ))}
              </tr>

              {/* Specs rows */}
              {allSpecs.map((label, i) => (
                <tr key={label} className={`border-t border-white/[0.06] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-3 pr-6 text-xs text-white/40">{label}</td>
                  {products.map((p) => {
                    const spec = p.specs.find((s) => s.label === label)
                    return (
                      <td key={p.slug} className="py-3 px-4 text-sm text-white/70">
                        {spec?.value ?? <span className="text-white/20">—</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Works with */}
              <tr className="border-t border-white/[0.06]">
                <td className="py-4 pr-6 text-xs font-semibold text-white/40 uppercase tracking-widest">Works with</td>
                {products.map((p) => (
                  <td key={p.slug} className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.worksWithPlatforms.map((platform) => (
                        <span key={platform} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA row */}
              <tr className="border-t border-white/[0.06]">
                <td className="py-4 pr-6"/>
                {products.map((p) => (
                  <td key={p.slug} className="py-4 px-4">
                    <Link href={`/products/${p.slug}`} className="inline-flex items-center px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-xs rounded-lg transition-colors">
                      View product →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
