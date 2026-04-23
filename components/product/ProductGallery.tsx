'use client'

import { useState } from 'react'
import type { Product } from '@/types'

export default function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center overflow-hidden relative">
        {product.images[active] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[active].src}
            alt={product.images[active].alt}
            className="w-full h-full object-contain p-8"
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
      {product.images.length > 1 && (
        <div className="flex gap-2">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl border flex items-center justify-center transition-all ${
                i === active
                  ? 'border-cyan-400/50 bg-cyan-400/10'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <span className="text-[10px] text-white/30">{img.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
