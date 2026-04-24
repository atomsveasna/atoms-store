'use client'

import { useState } from 'react'
import Link from 'next/link'

const BENEFITS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    title: 'Wholesale pricing',
    body: 'Volume discounts starting from 5 units. Better margins on every project.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Priority support',
    body: 'Dedicated support channel. Technical help for installation and integration.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    title: 'Technical resources',
    body: 'Full wiring diagrams, API docs, integration guides. Everything you need on site.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: 'Fast delivery',
    body: 'Same-day Phnom Penh delivery for approved partners. Stock for your projects, not delays.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: 'Partner listing',
    body: 'Get listed as a certified Atoms installer. We refer customers to our partner network.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Extended warranty',
    body: 'Partner-installed devices get extended warranty coverage for your clients.',
  },
]

const TIERS = [
  {
    name: 'Starter',
    volume: '5–19 units/month',
    discount: '10% off',
    features: ['Volume discount', 'Priority email support', 'Technical resources'],
    color: 'border-white/[0.08]',
    badge: '',
  },
  {
    name: 'Professional',
    volume: '20–49 units/month',
    discount: '18% off',
    features: ['Volume discount', 'Priority support', 'Technical resources', 'Partner listing', 'Extended warranty'],
    color: 'border-cyan-400/30',
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    volume: '50+ units/month',
    discount: 'Custom pricing',
    features: ['Custom pricing', 'Dedicated account manager', 'All Professional benefits', 'Custom firmware support', 'White-label options'],
    color: 'border-white/[0.08]',
    badge: '',
  },
]

function ApplicationForm() {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    city: '', experience: 'intermediate', projects: '', monthlyVolume: '',
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
    const res  = await fetch('/api/installer', {
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
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Application submitted!</h3>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          We'll review your application and get back to you within 2 business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'name',    label: 'Full name',    placeholder: 'Your name',       required: true },
          { key: 'company', label: 'Company',      placeholder: 'Company or trading name', required: true },
          { key: 'email',   label: 'Email',        placeholder: 'your@email.com',  required: true, type: 'email' },
          { key: 'phone',   label: 'Phone',        placeholder: '+855 XX XXX XXXX', required: true },
          { key: 'city',    label: 'City',         placeholder: 'Phnom Penh',      required: true },
          { key: 'monthlyVolume', label: 'Est. monthly volume', placeholder: 'e.g. 20 units', required: false },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-white/50 mb-1.5">
              {field.label} {field.required && <span className="text-cyan-400">*</span>}
            </label>
            <input
              required={field.required}
              type={field.type ?? 'text'}
              value={(form as Record<string, string>)[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Experience level</label>
        <select value={form.experience} onChange={(e) => set('experience', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all">
          <option value="beginner"     className="bg-[#0d1525]">Beginner — new to smart home installation</option>
          <option value="intermediate" className="bg-[#0d1525]">Intermediate — some smart home projects</option>
          <option value="professional" className="bg-[#0d1525]">Professional — full-time installer</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Tell us about your typical projects</label>
        <textarea
          value={form.projects}
          onChange={(e) => set('projects', e.target.value)}
          placeholder="e.g. Residential smart home setups, commercial office automation, hospitality..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}

      <button type="submit" disabled={loading} className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
        {loading ? 'Submitting...' : 'Apply to become a partner'}
      </button>
    </form>
  )
}

export default function InstallerPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(0,229,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.5) 1px,transparent 1px)`, backgroundSize: '48px 48px' }}/>
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Partner program</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Built for professional installers.
          </h1>
          <p className="text-lg text-white/50 leading-relaxed max-w-xl mb-8">
            Volume pricing, priority support, and technical resources for installers and integrators who build with Atoms.
          </p>
          <a href="#apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
            Apply now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">Partner benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-4">{b.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-2">{b.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-10">Partner tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`p-6 rounded-2xl border bg-white/[0.02] relative ${tier.color}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold px-3 py-1 rounded-full bg-cyan-400 text-[#080d1a]">
                    {tier.badge}
                  </span>
                )}
                <h3 className="font-bold text-white text-lg mb-1">{tier.name}</h3>
                <p className="text-xs text-white/40 mb-3">{tier.volume}</p>
                <p className="text-2xl font-bold text-cyan-400 mb-5">{tier.discount}</p>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application form */}
      <div id="apply" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Apply to become a partner</h2>
          <p className="text-white/40 text-sm mb-8">
            We review all applications within 2 business days. Questions?{' '}
            <Link href="/contact" className="text-cyan-400 hover:underline">Contact us</Link>.
          </p>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
            <ApplicationForm />
          </div>
        </div>
      </div>
    </div>
  )
}
