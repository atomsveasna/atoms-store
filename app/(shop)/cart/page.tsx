'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, removeItem, updateQty } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
        <p className="text-white/40 mb-8">Add some products to get started.</p>
        <Link href="/shop" className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-10">Your cart</h1>

        {/* Items */}
        <div className="space-y-3 mb-8">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              {/* Icon placeholder */}
              <div className="w-14 h-14 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/50">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{item.name}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">{item.sku}</p>
              </div>

              {/* Qty */}
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all text-sm">−</button>
                <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-all text-sm">+</button>
              </div>

              {/* Price */}
              <p className="font-bold text-white w-16 text-right">{formatPrice(item.price * item.quantity, 'USD')}</p>

              {/* Remove */}
              <button onClick={() => removeItem(item.productId)} className="text-white/20 hover:text-red-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Subtotal ({cart.itemCount} items)</span>
            <span className="text-white font-medium">{formatPrice(cart.subtotal, 'USD')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Shipping</span>
            <span className="text-cyan-400 text-xs font-medium">Calculated at checkout</span>
          </div>
          <div className="border-t border-white/[0.06] pt-4 flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="font-bold text-white text-xl">{formatPrice(cart.subtotal, 'USD')}</span>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
          >
            Proceed to checkout →
          </Link>
          <Link href="/shop" className="flex items-center justify-center w-full py-3 text-white/40 hover:text-white text-sm transition-colors">
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
