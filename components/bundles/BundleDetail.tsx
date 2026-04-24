'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'
import type { Bundle } from '@/lib/data/bundles'
import type { Product } from '@/types'

function BundleClient({ bundle, products }: { bundle: Bundle; products: Product[] }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAddBundle() {
    // Add each product in the bundle to cart
    bundle.items.forEach((item) => {
      const product = products.find((p) => p.slug === item.productSlug)
      if (!product) return
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          productId: product.id,
          slug:      product.slug,
          name:      product.name,
          sku:       product.sku,
          price:     bundle.bundlePrice / bundle.items.reduce((sum, i) => sum + i.quantity, 0),
          image:     product.images?.[0]?.src,
        })
      }
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const savingsPct = Math.round((bundle.savings / bundle.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/bundles" className="hover:text-white/60 transition-colors">Bundles</Link>
          <span>/</span>
          <span className="text-white/60">{bundle.name}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Visual */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] aspect-square flex items-center justify-center relative">
            {bundle.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bundle.coverImage} alt={bundle.name} className="w-full h-full object-contain p-8 rounded-2xl"/>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(Math.min(bundle.items.length, 4))].map((_, i) => (
                    <div key={i} className="w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/50">
                        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-white/30">{bundle.items.length} items included</span>
              </div>
            )}
            <span className="absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/20">
              Save {savingsPct}%
            </span>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Bundle</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-2">{bundle.name}</h1>
              <p className="text-lg text-white/50 leading-relaxed">{bundle.tagline}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 py-4 border-y border-white/[0.06]">
              <span className="text-3xl font-bold text-white">{formatPrice(bundle.bundlePrice, bundle.currency)}</span>
              <div>
                <span className="text-white/30 line-through text-sm">{formatPrice(bundle.originalPrice, bundle.currency)}</span>
                <span className="ml-2 text-emerald-400 text-sm font-semibold">Save {formatPrice(bundle.savings, bundle.currency)}</span>
              </div>
            </div>

            {/* What's included */}
            <div>
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">What's included</h2>
              <div className="space-y-3">
                {bundle.items.map((item, i) => {
                  const product = products.find((p) => p.slug === item.productSlug)
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60">
                          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{item.quantity > 1 ? `${item.quantity}× ` : ''}{item.label}</p>
                        {product && <p className="text-xs text-white/30 font-mono">{product.sku}</p>}
                      </div>
                      {product && (
                        <span className="text-xs text-white/30">{formatPrice(product.price * item.quantity, product.currency)}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            {bundle.description && (
              <p className="text-sm text-white/50 leading-relaxed">{bundle.description}</p>
            )}

            {/* Add bundle to cart */}
            <div className="space-y-3">
              <button
                onClick={handleAddBundle}
                className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
              >
                {added ? '✓ Bundle added to cart' : 'Add bundle to cart'}
              </button>
              <Link
                href="/checkout"
                className="flex items-center justify-center w-full py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-medium rounded-xl transition-all"
              >
                Buy now
              </Link>
            </div>

            {/* Trust */}
            <div className="space-y-2 pt-2">
              {['1-year warranty on all items', 'Free delivery in Phnom Penh', 'Real support — we actually respond'].map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs text-white/35">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60 flex-shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BundlePageWrapper({ bundle, products }: { bundle: Bundle; products: Product[] }) {
  if (!bundle) return notFound()
  return <BundleClient bundle={bundle} products={products}/>
}
