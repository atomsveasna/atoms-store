'use client'
import Link from 'next/link'
import { useState } from 'react'
import { getAllProducts } from '@/lib/data/products'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import type { Product, ProductCategory } from '@/types'

const CATEGORIES: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all',         label: 'All products' },
  { value: 'switches',    label: 'Smart switches' },
  { value: 'sockets',     label: 'Smart sockets' },
  { value: 'sensors',     label: 'Sensors' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bundles',     label: 'Bundles & kits' },
]

function ImageCarousel({ images, isNew, status }: {
  images: { src: string; alt: string; type: string }[]
  isNew: boolean
  status: string
}) {
  const [active, setActive] = useState(0)
  return (
    <div className="aspect-[3/4] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative flex-shrink-0 overflow-hidden">
      {images.length > 0 ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active].src} alt={images[active].alt} className="w-full h-full object-cover transition-opacity duration-300" />
          {images.length > 1 && (
            <>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.preventDefault(); setActive(i) }}
                    className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-cyan-400 w-3' : 'bg-white/30 w-1.5'}`} />
                ))}
              </div>
              <button onClick={(e) => { e.preventDefault(); setActive((active - 1 + images.length) % images.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button onClick={(e) => { e.preventDefault(); setActive((active + 1) % images.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
        </>
      ) : (
        <div className="w-20 h-20 rounded-xl bg-cyan-400/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/50">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        </div>
      )}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10">
        {isNew && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">New</span>}
        {status === 'low_stock' && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/20">Low stock</span>}
        {status === 'preorder' && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-400/15 text-purple-400 border border-purple-400/20">Pre-order</span>}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}
      className="group flex flex-col border border-white/[0.08] hover:border-cyan-400/30 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all duration-200">
      <ImageCarousel images={product.images ?? []} isNew={product.isNew ?? false} status={product.status} />
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">{product.category}</p>
        <h3 className="font-semibold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors leading-snug">{product.name}</h3>
        <p className="text-sm text-white/40 mb-4 line-clamp-2 flex-1">{product.tagline}</p>
        {product.worksWithPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.worksWithPlatforms.slice(0, 3).map((p) => (
              <span key={p} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/30">{p}</span>
            ))}
            {product.worksWithPlatforms.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/30">+{product.worksWithPlatforms.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="font-bold text-white text-lg">{formatPrice(product.price, product.currency)}</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            product.status === 'in_stock' ? 'text-emerald-400' :
            product.status === 'low_stock' ? 'text-amber-400' : 'text-white/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              product.status === 'in_stock' ? 'bg-emerald-400' :
              product.status === 'low_stock' ? 'bg-amber-400' : 'bg-white/20'
            }`}/>
            {getStatusLabel(product.status)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <p className="text-white/40 text-sm mb-2">No products in this category yet</p>
      <p className="text-white/20 text-xs">Check back soon — more products are on the way</p>
    </div>
  )
}

interface Props {
  searchParams: { category?: string; sort?: string }
}

export default async function ShopPage({ searchParams }: Props) {
  const allProducts = await getAllProducts()
  const activeCategory = searchParams.category ?? 'all'
  const filtered = activeCategory === 'all' ? allProducts : allProducts.filter((p) => p.category === activeCategory)
  const sort = searchParams.sort ?? 'featured'
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc')  return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'newest')     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
  })

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Shop</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">All products</h1>
            <p className="text-sm text-white/30 pb-1">{sorted.length} {sorted.length === 1 ? 'product' : 'products'}</p>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Link key={cat.value} href={cat.value === 'all' ? '/shop' : `/shop?category=${cat.value}`}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    activeCategory === cat.value
                      ? 'bg-cyan-400 text-[#080d1a]'
                      : 'border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 bg-white/[0.02]'
                  }`}>
                  {cat.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-white/30">Sort:</span>
              <div className="flex gap-1">
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'newest',   label: 'Newest' },
                  { value: 'price-asc', label: 'Price ↑' },
                  { value: 'price-desc', label: 'Price ↓' },
                ].map((s) => (
                  <Link key={s.value} href={`/shop?${activeCategory !== 'all' ? `category=${activeCategory}&` : ''}sort=${s.value}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sort === s.value ? 'bg-white/[0.1] text-white' : 'text-white/30 hover:text-white/60'}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.length > 0 ? sorted.map((product) => <ProductCard key={product.slug} product={product} />) : <EmptyState />}
            <div className="border border-white/[0.05] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <p className="text-sm text-white/25">More coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
