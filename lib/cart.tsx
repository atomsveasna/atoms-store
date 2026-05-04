'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { CartItem, Cart } from '@/types'

interface CartContextType {
  cart: Cart
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

function calcCart(items: CartItem[]): Cart {
  return {
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('atoms-cart') : null
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('atoms-cart', JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) return removeItem(productId)
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ cart: calcCart(items), addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
