'use client'

import { useState } from 'react'
import Link from 'next/link'

const PRODUCTS = [
  { value: 'atoms-smart-switch-1g', label: 'Atoms Smart Switch 1G' },
]

export default function RegisterPage() {
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', productSlug: 'atoms-smart-switch-1g',
    serialNumber: '', purchaseOrderId: '', purchaseDate: '', notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed'); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#080d1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Device registered!</h1>
          <p className="text-white/50 text-sm mb-2">
            Your warranty is now active. We've recorded your device registration.
          </p>
          <p className="text-white/30 text-xs mb-8">
            For warranty claims, contact us at <a href="mailto:hello@atomsiot.com" className="text-cyan-400">hello@atomsiot.com</a>
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/support/warranty" className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm rounded-xl transition-all">
              Warranty info
            </Link>
            <Link href="/shop" className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Warranty</p>
          <h1 className="text-3xl font-bold text-white mb-3">Register your device</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Register your Atoms device to activate your 12-month warranty and get priority support.
            Registration takes less than a minute.
          </p>
        </div>

        {/* Warranty badge */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">12-month hardware warranty</p>
            <p className="text-xs text-white/40 mt-0.5">Covers manufacturing defects and hardware failures under normal use</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Customer info */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Full name <span className="text-cyan-400">*</span></label>
                <input required value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email <span className="text-cyan-400">*</span></label>
                <input required type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} placeholder="your@email.com" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
              </div>
            </div>
          </div>

          {/* Device info */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Device details</h2>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Product <span className="text-cyan-400">*</span></label>
              <select value={form.productSlug} onChange={(e) => set('productSlug', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all">
                {PRODUCTS.map((p) => <option key={p.value} value={p.value} className="bg-[#0d1525]">{p.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Serial number</label>
                <input value={form.serialNumber} onChange={(e) => set('serialNumber', e.target.value)} placeholder="Found on back of device" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Purchase date</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => set('purchaseDate', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Order number</label>
              <input value={form.purchaseOrderId} onChange={(e) => set('purchaseOrderId', e.target.value)} placeholder="e.g. ATM-250401-1234" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
              <p className="text-xs text-white/20 mt-1">From your order confirmation</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Installation location or anything else useful (optional)" rows={2} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none"/>
            </div>
          </div>

          {error && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Registering...</>
            ) : 'Register device & activate warranty'}
          </button>
        </form>
      </div>
    </div>
  )
}
