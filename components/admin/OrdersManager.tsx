'use client'

import { useState } from 'react'
import { type Order, type OrderStatus, STATUS_LABELS, STATUS_COLORS } from '@/lib/data/orders'
import { formatPrice } from '@/lib/utils'

const STATUS_FLOW: OrderStatus[] = [
  'pending_payment',
  'payment_submitted',
  'payment_confirmed',
  'processing',
  'shipped',
  'delivered',
]

function OrderRow({ order }: { order: Order }) {
  const [status, setStatus]   = useState<OrderStatus>(order.status)
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleStatus(newStatus: OrderStatus) {
    setLoading(true)
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status: newStatus }),
    })
    if (res.ok) setStatus(newStatus)
    setLoading(false)
  }

  return (
    <div className="border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Row header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-mono font-bold text-cyan-400">{order.orderNumber}</p>
            <p className="text-xs text-white/40 mt-0.5">{order.customerName} · {order.customerPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">{formatPrice(order.total, order.currency)}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
          </span>
          <span className="text-xs text-white/20">
            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-white/20 transition-transform ${open ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-t border-white/[0.06] p-5 space-y-5 bg-white/[0.01]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Customer */}
            <div>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Customer</p>
              <p className="text-sm text-white">{order.customerName}</p>
              <p className="text-sm text-white/60">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-sm text-white/60">{order.customerEmail}</p>}
            </div>

            {/* Delivery */}
            <div>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Delivery address</p>
              <p className="text-sm text-white/60">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p className="text-sm text-white/60">{order.shippingAddress.addressLine2}</p>}
              <p className="text-sm text-white/60">{order.shippingAddress.city}</p>
              {order.shippingAddress.notes && <p className="text-xs text-amber-400 mt-1">Note: {order.shippingAddress.notes}</p>}
            </div>

            {/* Payment */}
            <div>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Payment</p>
              <p className="text-sm text-white/60 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              <p className="text-sm font-bold text-white mt-1">{formatPrice(order.total, order.currency)}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{item.quantity}× {item.productName}</span>
                  <span className="text-white font-medium">{formatPrice(item.totalPrice, order.currency)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status update */}
          <div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">Update status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FLOW.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatus(s)}
                  disabled={loading || s === status}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all disabled:cursor-not-allowed ${
                    s === status
                      ? STATUS_COLORS[s] + ' opacity-100'
                      : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
              <button
                onClick={() => handleStatus('cancelled')}
                disabled={loading || status === 'cancelled'}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-400/20 text-red-400/70 hover:text-red-400 hover:border-red-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersManager({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter)

  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total orders',       value: orders.length },
          { label: 'Awaiting payment',   value: (counts['pending_payment'] ?? 0) + (counts['payment_submitted'] ?? 0) },
          { label: 'Processing',         value: (counts['payment_confirmed'] ?? 0) + (counts['processing'] ?? 0) },
          { label: 'Delivered',          value: counts['delivered'] ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-cyan-400 text-[#080d1a]' : 'border border-white/[0.08] text-white/40 hover:text-white'}`}
        >
          All ({orders.length})
        </button>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => counts[s] ? (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filter === s ? STATUS_COLORS[s] : 'border-white/[0.08] text-white/40 hover:text-white'
            }`}
          >
            {STATUS_LABELS[s]} ({counts[s]})
          </button>
        ) : null)}
      </div>

      {/* Orders */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((order) => <OrderRow key={order.id} order={order} />)}
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-white/30 border border-white/[0.05] border-dashed rounded-2xl">
          {orders.length === 0 ? 'No orders yet' : 'No orders with this status'}
        </div>
      )}
    </div>
  )
}
