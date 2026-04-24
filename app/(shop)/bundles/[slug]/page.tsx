'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import type { Product } from '@/types'

interface BundleItem { productSlug: string; quantity: number; label?: string }
interface Bundle {
  id: string; slug: string; name: string; tagline: string; description: string
  coverImage?: string; originalPrice: number; bundlePrice: number; currency: string
  items: BundleItem[]; includes: string[]
}

export default function BundleDetailPage({ params }: { params: { slug: string } }) {
  const { addItem }   = useCart()
  const [bundle, setBundle]     = useState<Bundle | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [added, setAdded]       = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/bundles/${params.slug}`).then((r) => r.json()),
      fetch('/api/products/list').then((r) => r.json()),
    ]).then(([b, p]) => {
      setBundle(b.bundle)
      setProducts(p.products ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.slug])

  function handleAddBundle() {
    if (!bundle) return
    const totalQty = bundle.items.reduce((sum, i) => sum + i.quantity, 0)
    bundle.items.forEach((item) => {
      const product = products.find((p) => p.slug === item.productSlug)
      if (!product) return
      const itemPrice = (bundle.bundlePrice / totalQty) * item.quantity
      for (let i = 0; i < item.quantity; i++) {
        addItem({ productId: product.id, slug: product.slug, name: product.name, sku: product.sku, price: itemPrice / item.quantity, image: product.images[0]?.src })
      }
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"/>
    </div>
  )

  if (!bundle) return (
    <div className="min-h-screen bg-[#080d1a] flex items-center justify-center text-center px-4">
      <div><p className="text-white/40 text-sm mb-3">Bundle not found.</p>
      <Link href="/bundles" className="text-cyan-400 text-sm hover:underline">View all bundles →</Link></div>
    </div>
  )

  const savings    = bundle.originalPrice - bundle.bundlePrice
  const savingsPct = Math.round((savings / bundle.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
          <Link href="/bundles" className="hover:text-white/60">Bundles</Link><span>/</span>
          <span className="text-white/60">{bundle.name}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          <div className="aspect-square rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center overflow-hidden">
            {bundle.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bundle.coverImage} alt={bundle.name} className="w-full h-full object-cover"/>
            ) : (
              <div className="text-white/15 text-center">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                <span className="text-sm">{bundle.items.length}-product bundle</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/25 mb-3">
                Save {savingsPct}% · {formatPrice(savings, bundle.currency)} off
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">{bundle.name}</h1>
              <p className="text-lg text-white/50">{bundle.tagline}</p>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-white/[0.06]">
              <div>
                <p className="text-sm text-white/25 line-through mb-1">{formatPrice(bundle.originalPrice, bundle.currency)}</p>
                <p className="text-3xl font-bold text-white">{formatPrice(bundle.bundlePrice, bundle.currency)}</p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <p className="text-xs text-emerald-400 font-semibold">You save</p>
                <p className="text-lg font-bold text-emerald-400">{formatPrice(savings, bundle.currency)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">What's included</h3>
              <div className="space-y-2">
                {bundle.items.map((item, i) => {
                  const product = products.find((p) => p.slug === item.productSlug)
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-cyan-400/60"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.quantity}× {product?.name ?? item.label ?? item.productSlug}</p>
                          {product && <p className="text-xs text-white/30 font-mono">{product.sku}</p>}
                        </div>
                      </div>
                      {product && <Link href={`/products/${product.slug}`} className="text-xs text-white/30 hover:text-cyan-400 transition-colors">View →</Link>}
                    </div>
                  )
                })}
                {bundle.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><polyline points="20 6 9 17 4 12"/></svg>
                    <span className="text-sm text-white/40">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleAddBundle} className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
              {added ? '✓ Added to cart' : `Add bundle to cart — ${formatPrice(bundle.bundlePrice, bundle.currency)}`}
            </button>

            <div className="space-y-2">
              {['1-year warranty on all devices', 'Free delivery in Phnom Penh', 'Real support'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-white/35">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60"><polyline points="20 6 9 17 4 12"/></svg>
                  {t}
                </div>
              ))}
            </div>

            {bundle.description && (
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">About this bundle</h3>
                <p className="text-sm text-white/50 leading-relaxed">{bundle.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
