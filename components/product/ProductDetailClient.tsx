'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import ProductGallery from '@/components/product/ProductGallery'
import AddToCart from '@/components/product/AddToCart'
import { TabOverview, TabSpecs, TabSetup, TabDownloads, TabFAQ } from '@/components/product/ProductTabs'
import type { Product } from '@/types'

type Tab = 'overview' | 'specs' | 'setup' | 'downloads' | 'faq'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'specs',     label: 'Specifications' },
  { id: 'setup',     label: 'Setup & Docs' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'faq',       label: 'FAQ' },
]

export default function ProductDetailClient({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-white/30">
          <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white/60 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          <ProductGallery product={product} />
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30 uppercase tracking-widest">{product.category}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"/>
              <span className="text-xs font-mono text-white/20">{product.sku}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">{product.name}</h1>
            <p className="text-lg text-white/50 leading-relaxed">{product.tagline}</p>
            <div className="flex items-center gap-4 py-4 border-y border-white/[0.06]">
              <span className="text-3xl font-bold text-white">{formatPrice(product.price, product.currency)}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                product.status === 'in_stock'  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                product.status === 'low_stock' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                'bg-white/[0.06] text-white/40 border-white/10'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'in_stock' ? 'bg-emerald-400' : product.status === 'low_stock' ? 'bg-amber-400' : 'bg-white/30'}`}/>
                {getStatusLabel(product.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {product.specs.slice(0, 4).map((spec) => (
                <div key={spec.label} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-white/30 mb-1">{spec.label}</p>
                  <p className="text-sm font-medium text-white/80">{spec.value}</p>
                </div>
              ))}
            </div>
            <AddToCart product={product} />
            {product.docSlug && (
              <Link href={`/docs/${product.docSlug}`} className="flex items-center gap-2 text-sm text-white/30 hover:text-cyan-400 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                View full documentation
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide pt-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-5 py-3 text-sm font-medium rounded-t-lg transition-all duration-150 border-b-2 ${tab === t.id ? 'text-white border-cyan-400 bg-white/[0.03]' : 'text-white/40 hover:text-white/70 border-transparent'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          {tab === 'overview'  && <TabOverview  product={product} />}
          {tab === 'specs'     && <TabSpecs     product={product} />}
          {tab === 'setup'     && <TabSetup     product={product} />}
          {tab === 'downloads' && <TabDownloads product={product} />}
          {tab === 'faq'       && <TabFAQ       product={product} />}
        </div>
      </div>
    </div>
  )
}
