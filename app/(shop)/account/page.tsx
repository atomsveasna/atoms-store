'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/lib/data/orders'

const STATUS_COLORS: Record<string, string> = {
  pending_payment:   'bg-white/[0.05] text-white/40',
  payment_submitted: 'bg-amber-400/10 text-amber-400',
  payment_confirmed: 'bg-blue-400/10 text-blue-400',
  processing:        'bg-purple-400/10 text-purple-400',
  shipped:           'bg-cyan-400/10 text-cyan-400',
  delivered:         'bg-emerald-400/10 text-emerald-400',
  cancelled:         'bg-red-400/10 text-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  pending_payment:   'Pending payment',
  payment_submitted: 'Payment submitted',
  payment_confirmed: 'Payment confirmed',
  processing:        'Processing',
  shipped:           'Shipped',
  delivered:         'Delivered',
  cancelled:         'Cancelled',
}

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [orders, setOrders]   = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetch(`/api/account/orders?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }, [user])

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">Account</p>
            <h1 className="text-3xl font-bold text-white">{user.email}</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm rounded-xl transition-all"
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl w-fit mb-8">
          {(['orders', 'profile'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                activeTab === tab ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="py-12 text-center text-white/30 text-sm">Loading orders...</div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
                    <div>
                      <p className="font-mono font-bold text-cyan-400 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-bold text-white">{formatPrice(order.total, order.currency)}</span>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{item.quantity}× {item.productName}</span>
                        <span className="text-white/40">{formatPrice(item.totalPrice, order.currency)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-white/[0.05] bg-white/[0.01]">
                    <p className="text-xs text-white/30">
                      Deliver to: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center rounded-2xl border border-white/[0.05] border-dashed">
                <p className="text-white/30 text-sm mb-2">No orders yet</p>
                <Link href="/shop" className="text-cyan-400 text-sm hover:underline">Browse products →</Link>
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05]">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Email address</p>
                  <p className="text-sm font-medium text-white">{user.email}</p>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Member since</p>
                  <p className="text-sm font-medium text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Need help?</h3>
              <div className="space-y-2">
                <Link href="/support" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Help center & FAQ</span>
                  <span className="text-white/20 group-hover:text-white/50">→</span>
                </Link>
                <Link href="/contact" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Contact support</span>
                  <span className="text-white/20 group-hover:text-white/50">→</span>
                </Link>
                <Link href="/register" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Register a device</span>
                  <span className="text-white/20 group-hover:text-white/50">→</span>
                </Link>
                <Link href="/support/warranty" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Warranty policy</span>
                  <span className="text-white/20 group-hover:text-white/50">→</span>
                </Link>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 border border-red-400/20 text-red-400/70 hover:text-red-400 hover:border-red-400/40 text-sm font-medium rounded-xl transition-all"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
