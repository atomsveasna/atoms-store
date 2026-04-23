'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getStatusLabel } from '@/lib/utils'
import type { Product } from '@/types'

export default function AddToCart({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const canBuy = product.status === 'in_stock' || product.status === 'low_stock'

  function handleAdd() {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span className="w-10 text-center text-white font-medium text-sm">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={!canBuy}
          className="flex-1 h-12 px-6 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
        >
          {added ? '✓ Added to cart' : canBuy ? 'Add to cart' : getStatusLabel(product.status)}
        </button>
      </div>

      {canBuy && (
        <Link href="/checkout" className="flex items-center justify-center w-full h-12 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-medium text-sm rounded-xl transition-all">
          Buy now
        </Link>
      )}

      <div className="pt-2 space-y-2">
        {['1-year hardware warranty', 'Free delivery in Phnom Penh', 'Real support — we actually respond'].map((t) => (
          <div key={t} className="flex items-center gap-2 text-xs text-white/35">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60 flex-shrink-0">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {t}
          </div>
        ))}
      </div>
    </div>
  )
}
