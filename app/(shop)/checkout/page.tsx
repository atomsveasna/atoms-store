'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import { formatPrice, generateOrderNumber } from '@/lib/utils'

type Step = 'details' | 'payment' | 'confirm'

interface FormData {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  province: string
  notes: string
}

const EMPTY_FORM: FormData = {
  fullName: '', phone: '', email: '',
  addressLine1: '', addressLine2: '',
  city: 'Phnom Penh', province: '', notes: '',
}

// ── Step indicator ────────────────────────────────────────────
function StepBar({ step }: { step: Step }) {
  const steps = [
    { id: 'details', label: 'Your details' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ]
  const idx = steps.findIndex((s) => s.id === step)

  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              i < idx  ? 'bg-cyan-400 text-[#080d1a]' :
              i === idx ? 'bg-cyan-400 text-[#080d1a]' :
              'bg-white/[0.06] text-white/30'
            }`}>
              {i < idx ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === idx ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-3 ${i < idx ? 'bg-cyan-400/40' : 'bg-white/[0.06]'}`}/>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Order summary sidebar ─────────────────────────────────────
function OrderSummary({ subtotal, itemCount }: { subtotal: number; itemCount: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-3 sticky top-24">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">Order summary</h3>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Items ({itemCount})</span>
        <span className="text-white">{formatPrice(subtotal, 'USD')}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Shipping</span>
        <span className="text-cyan-400 text-xs">Free — Phnom Penh</span>
      </div>
      <div className="border-t border-white/[0.06] pt-3 flex justify-between">
        <span className="font-semibold text-white">Total</span>
        <span className="font-bold text-white text-lg">{formatPrice(subtotal, 'USD')}</span>
      </div>
    </div>
  )
}

// ── Step 1: Details form ──────────────────────────────────────
function StepDetails({ form, setForm, onNext }: {
  form: FormData
  setForm: (f: FormData) => void
  onNext: () => void
}) {
  function set(key: keyof FormData, value: string) {
    setForm({ ...form, [key]: value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Full name <span className="text-cyan-400">*</span></label>
          <input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Phone <span className="text-cyan-400">*</span></label>
          <input required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+855 XX XXX XXXX" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Delivery address <span className="text-cyan-400">*</span></label>
        <input required value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} placeholder="Street, building, floor" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all mb-2"/>
        <input value={form.addressLine2} onChange={(e) => set('addressLine2', e.target.value)} placeholder="Landmark, extra info (optional)" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">City <span className="text-cyan-400">*</span></label>
          <input required value={form.city} onChange={(e) => set('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Province</label>
          <input value={form.province} onChange={(e) => set('province', e.target.value)} placeholder="Optional" className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"/>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Delivery notes</label>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any notes for delivery (optional)" rows={2} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"/>
      </div>
      <button type="submit" className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
        Continue to payment →
      </button>
    </form>
  )
}

// ── Step 2: Payment ───────────────────────────────────────────
function StepPayment({ total, orderNumber, onNext, onBack }: {
  total: number
  orderNumber: string
  onNext: () => void
  onBack: () => void
}) {
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="space-y-6">
      {/* ABA payment details */}
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <h3 className="font-semibold text-white">ABA Bank Transfer</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Account name',   value: process.env.NEXT_PUBLIC_ABA_ACCOUNT_NAME  ?? 'Atoms Co., Ltd.' },
            { label: 'Account number', value: process.env.NEXT_PUBLIC_ABA_ACCOUNT_NUMBER ?? '000XXXXXXXXX' },
            { label: 'Bank',           value: 'ABA Bank' },
            { label: 'Amount',         value: formatPrice(total, 'USD') },
            { label: 'Reference',      value: orderNumber },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
              <span className="text-sm text-white/40">{label}</span>
              <span className={`text-sm font-semibold ${label === 'Reference' ? 'text-cyan-400 font-mono' : 'text-white'}`}>{value}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/20">
          <p className="text-xs text-amber-400 leading-relaxed">
            ⚠️ Use the reference number <strong>{orderNumber}</strong> in your transfer note so we can match your payment.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        {[
          'Open your ABA Mobile app or visit any ABA branch',
          `Transfer exactly ${formatPrice(total, 'USD')} to the account above`,
          `Include "${orderNumber}" as the transfer reference`,
          'Take a screenshot of your transfer confirmation',
          'Click "I have paid" below to submit your order',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-white/50">
            <span className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-white/40 flex-shrink-0 mt-0.5">{i + 1}</span>
            {step}
          </div>
        ))}
      </div>

      {/* Confirm checkbox */}
      <button
        onClick={() => setConfirmed(!confirmed)}
        className="flex items-start gap-3 text-left w-full"
      >
        <div className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${confirmed ? 'bg-cyan-400 border-cyan-400' : 'border-white/20 bg-white/[0.04]'}`}>
          {confirmed && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080d1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
        <span className="text-sm text-white/60">I have completed the ABA transfer and understand my order will be confirmed after payment verification.</span>
      </button>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium text-sm rounded-xl transition-all">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!confirmed}
          className="flex-1 py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
        >
          I have paid →
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Confirm ───────────────────────────────────────────
function StepConfirm({ form, orderNumber, total, onSubmit, loading }: {
  form: FormData
  orderNumber: string
  total: number
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05] overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Order number</p>
          <p className="font-mono font-bold text-cyan-400">{orderNumber}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Deliver to</p>
          <p className="text-sm text-white">{form.fullName}</p>
          <p className="text-sm text-white/60">{form.phone}</p>
          <p className="text-sm text-white/60">{form.addressLine1}{form.addressLine2 ? `, ${form.addressLine2}` : ''}, {form.city}</p>
        </div>
        <div className="px-5 py-4 flex justify-between">
          <p className="text-xs text-white/40 uppercase tracking-widest">Total paid</p>
          <p className="font-bold text-white">{formatPrice(total, 'USD')}</p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Placing order...</>
        ) : 'Confirm order'}
      </button>
    </div>
  )
}

// ── Main checkout page ────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState<Step>('details')
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [orderNumber] = useState(() => generateOrderNumber())

  if (cart.items.length === 0) {
    if (typeof window !== 'undefined') {
      window.location.href = '/shop'
    }
    return null
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: form.fullName,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            province: form.province,
            country: 'Cambodia',
            notes: form.notes,
          },
          items: cart.items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price,
            totalPrice: i.price * i.quantity,
          })),
          subtotal: cart.subtotal,
          shippingFee: 0,
          total: cart.subtotal,
          paymentMethod: 'aba_transfer',
          status: 'payment_submitted',
        }),
      })
      clearCart()
      router.push(`/order-success?order=${orderNumber}`)
    } catch {
      alert('Something went wrong. Please contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <StepBar step={step} />
            {step === 'details' && <StepDetails form={form} setForm={setForm} onNext={() => setStep('payment')} />}
            {step === 'payment' && <StepPayment total={cart.subtotal} orderNumber={orderNumber} onNext={() => setStep('confirm')} onBack={() => setStep('details')} />}
            {step === 'confirm'  && <StepConfirm form={form} orderNumber={orderNumber} total={cart.subtotal} onSubmit={handleSubmit} loading={loading} />}
          </div>
          <div>
            <OrderSummary subtotal={cart.subtotal} itemCount={cart.itemCount} />
          </div>
        </div>
      </div>
    </div>
  )
}
