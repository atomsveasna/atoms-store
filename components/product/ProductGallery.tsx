'use client'

import { useState, useEffect } from 'react'
import type { Product, ProductImage } from '@/types'

export default function ProductGallery({ product }: { product: Product }) {
  const [images, setImages] = useState<ProductImage[]>(product.images ?? [])
  const [active, setActive] = useState(0)

  // Fetch images from Supabase
  useEffect(() => {
    fetch(`/api/products/images?slug=${product.slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.images?.length > 0) {
          setImages(data.images.map((img: { src: string; alt: string; type: string }) => ({
            src: img.src, alt: img.alt, type: img.type,
          })))
        }
      })
      .catch(() => {})
  }, [product.slug])

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-[3/4] rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center overflow-hidden relative">
        {images[active] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[active].src}
            alt={images[active].alt}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <span className="text-xs">Product image coming soon</span>
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-4 left-4 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">
            New
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl border overflow-hidden flex items-center justify-center transition-all ${
                i === active
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-xl"/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
