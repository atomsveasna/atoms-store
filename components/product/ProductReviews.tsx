'use client'

import { useState } from 'react'
import type { Review, ReviewStats } from '@/lib/data/reviews'

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className={`transition-colors ${
                star <= (hover || value)
                  ? 'fill-amber-400 stroke-amber-400'
                  : 'fill-transparent stroke-white/20'
              }`}
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

function StatsBar({ stats }: { stats: ReviewStats }) {
  return (
    <div className="flex gap-8 items-center p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] mb-6">
      {/* Average */}
      <div className="text-center flex-shrink-0">
        <p className="text-5xl font-bold text-white mb-1">{stats.average.toFixed(1)}</p>
        <StarRating value={Math.round(stats.average)} size={16}/>
        <p className="text-xs text-white/30 mt-1">{stats.total} review{stats.total !== 1 ? 's' : ''}</p>
      </div>

      {/* Breakdown */}
      <div className="flex-1 space-y-1.5">
        {[5,4,3,2,1].map((star) => {
          const count = stats.breakdown[star] ?? 0
          const pct   = stats.total > 0 ? (count / stats.total) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-white/40 w-4 text-right">{star}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400/60 flex-shrink-0">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-amber-400/60 rounded-full transition-all" style={{ width: `${pct}%` }}/>
              </div>
              <span className="text-xs text-white/25 w-4">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-white">{review.authorName}</p>
            {review.isVerified && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                Verified purchase
              </span>
            )}
          </div>
          <StarRating value={review.rating} size={14}/>
        </div>
        <p className="text-xs text-white/25 flex-shrink-0">
          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      </div>
      {review.title && <p className="text-sm font-medium text-white mb-1">{review.title}</p>}
      <p className="text-sm text-white/60 leading-relaxed">{review.body}</p>
    </div>
  )
}

function ReviewForm({ productSlug, onSubmitted }: { productSlug: string; onSubmitted: () => void }) {
  const [rating, setRating]   = useState(0)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [title, setTitle]     = useState('')
  const [body, setBody]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating'); return }
    setLoading(true)
    setError('')
    const res  = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productSlug, authorName: name, authorEmail: email, rating, title, body }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to submit'); setLoading(false); return }
    setLoading(false)
    onSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      <h3 className="text-base font-semibold text-white mb-1">Write a review</h3>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-2">Your rating <span className="text-cyan-400">*</span></label>
        <StarRating value={rating} onChange={setRating} size={24}/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Name <span className="text-cyan-400">*</span></label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional — not shown publicly" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Review title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary (optional)" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Review <span className="text-cyan-400">*</span></label>
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience with this product..." rows={4} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none"/>
      </div>

      {error && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}

      <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
        {loading ? 'Submitting...' : 'Submit review'}
      </button>
      <p className="text-xs text-white/25 text-center">Reviews are approved before being published.</p>
    </form>
  )
}

export default function ProductReviews({
  productSlug,
  initialReviews,
  stats,
}: {
  productSlug: string
  initialReviews: Review[]
  stats: ReviewStats
}) {
  const [showForm, setShowForm]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const reviews = initialReviews

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats.total > 0 && <StatsBar stats={stats}/>}

      {/* Submit CTA */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-white/[0.08] hover:border-cyan-400/20 text-white/50 hover:text-white text-sm font-medium rounded-xl transition-all"
        >
          + Write a review
        </button>
      )}

      {submitted && (
        <div className="p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-sm text-emerald-400">
          ✓ Review submitted — it will appear after approval. Thank you!
        </div>
      )}

      {showForm && !submitted && (
        <ReviewForm
          productSlug={productSlug}
          onSubmitted={() => { setShowForm(false); setSubmitted(true) }}
        />
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => <ReviewCard key={r.id} review={r}/>)}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-white/25">
          No reviews yet. Be the first to review this product.
        </div>
      )}
    </div>
  )
}
