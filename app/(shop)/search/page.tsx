'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  products: { slug: string; name: string; tagline: string; price: number; currency: string; category: string }[]
  docs:     { slug: string; title: string; description?: string; category: string; product_slug?: string }[]
  posts:    { slug: string; title: string; excerpt: string; category: string }[]
}

export default function SearchPage() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timer    = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (query.length < 2) { setResults(null); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
      setLoading(false)
    }, 300)
  }, [query])

  const total = results ? results.products.length + results.docs.length + results.posts.length : 0

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Search input */}
        <div className="relative mb-10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, docs, guides..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white text-lg placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
          />
          {loading && (
            <svg className="animate-spin absolute right-4 top-1/2 -translate-y-1/2 text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          )}
        </div>

        {/* Results */}
        {query.length < 2 && (
          <div className="text-center py-16 text-white/20 text-sm">
            Type at least 2 characters to search
          </div>
        )}

        {results && total === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm mb-2">No results for "{query}"</p>
            <p className="text-white/15 text-xs">Try a different term or browse the shop</p>
          </div>
        )}

        {results && total > 0 && (
          <div className="space-y-8">
            <p className="text-xs text-white/30">{total} result{total !== 1 ? 's' : ''} for "{query}"</p>

            {/* Products */}
            {results.products.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Products</p>
                <div className="space-y-2">
                  {results.products.map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-cyan-400/60">
                            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{p.name}</p>
                          <p className="text-xs text-white/30">{p.tagline}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white flex-shrink-0">{formatPrice(p.price, p.currency)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Docs */}
            {results.docs.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Documentation</p>
                <div className="space-y-2">
                  {results.docs.map((d) => (
                    <Link key={d.slug} href={`/docs/${d.slug}`} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0 mt-0.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{d.title}</p>
                        {d.description && <p className="text-xs text-white/30 mt-0.5">{d.description}</p>}
                        <span className="text-[10px] text-white/20 mt-1 inline-block">{d.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Tutorials & Guides</p>
                <div className="space-y-2">
                  {results.posts.map((p) => (
                    <Link key={p.slug} href={`/learn/${p.slug}`} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0 mt-0.5">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{p.title}</p>
                        <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{p.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
