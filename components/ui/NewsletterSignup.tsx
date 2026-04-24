'use client'

import { useState } from 'react'

export default function NewsletterSignup({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    const data = await res.json()
    if (!res.ok && !data.success) {
      setError('Something went wrong. Try again.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        You're subscribed — thanks!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
      <input
        required type="email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all min-w-0"
      />
      <button
        type="submit" disabled={loading}
        className="flex-shrink-0 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {error && <p className="w-full text-xs text-red-400 mt-1">{error}</p>}
    </form>
  )
}
