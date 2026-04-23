'use client'

import { useState } from 'react'

type Category = 'pre-sales' | 'installation' | 'firmware' | 'warranty' | 'other'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'pre-sales',    label: 'Pre-sales question' },
  { value: 'installation', label: 'Installation help' },
  { value: 'firmware',     label: 'Firmware / software' },
  { value: 'warranty',     label: 'Warranty claim' },
  { value: 'other',        label: 'Other' },
]

const CONTACT_DETAILS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: 'Phone / Telegram',
    value: '+855 XX XXX XXXX',
    href: 'tel:+855XXXXXXXXX',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@atomsiot.com',
    href: 'mailto:hello@atomsiot.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
    label: 'Telegram',
    value: '@atomsiot',
    href: 'https://t.me/atomsiot',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Location',
    value: 'Phnom Penh, Cambodia',
    href: 'https://maps.google.com/?q=Phnom+Penh,Cambodia',
  },
]

function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', category: 'pre-sales', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
    } catch {
      setError('Something went wrong. Please email us directly at hello@atomsiot.com')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
        <p className="text-white/40 text-sm max-w-xs">
          We'll get back to you within 24 hours. For urgent issues, reach us on Telegram.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Name <span className="text-cyan-400">*</span></label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+855 XX XXX XXXX"
            className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Email <span className="text-cyan-400">*</span></label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Topic</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#0d1525]">{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Message <span className="text-cyan-400">*</span></label>
        <textarea
          required
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          placeholder="Tell us how we can help..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Sending...</>
        ) : 'Send message'}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Contact</p>
          <h1 className="text-4xl font-bold text-white mb-4">Get in touch</h1>
          <p className="text-white/40 text-lg max-w-xl">
            Pre-sales question, installation help, or warranty claim — we respond to every message.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact details */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-6">Contact details</h2>

            {CONTACT_DETAILS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-cyan-400/20 hover:bg-white/[0.04] group transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 group-hover:text-cyan-400 transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.value}</p>
                </div>
              </a>
            ))}

            {/* Response time */}
            <div className="p-4 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] mt-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>
                <p className="text-xs font-semibold text-cyan-400">Response time</p>
              </div>
              <p className="text-sm text-white/50">
                We typically respond within <strong className="text-white/70">24 hours</strong>. For urgent issues, reach us on Telegram.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-6">Send a message</h2>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div className="max-w-7xl mx-auto mt-12">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-6">Location</h2>
          <div className="rounded-2xl border border-white/[0.07] overflow-hidden h-72">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125219.35652073082!2d104.78801899999999!3d11.5563738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sPhnom%20Penh%2C%20Cambodia!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
