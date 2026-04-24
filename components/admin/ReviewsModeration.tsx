'use client'

import { useState } from 'react'
import type { Review } from '@/lib/data/reviews'

export default function ReviewsModeration({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(id: string, action: 'approve' | 'delete') {
    setLoading(id)
    const res = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id))
    }
    setLoading(null)
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-white/30 py-4">No pending reviews.</p>
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="p-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.03]">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-white">{r.authorName}</p>
              <p className="text-xs text-white/30 font-mono">{r.productSlug}</p>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                      className={s <= r.rating ? 'fill-amber-400 stroke-amber-400' : 'fill-transparent stroke-white/20'}
                    />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-xs text-white/25">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
          {r.title && <p className="text-sm font-medium text-white mb-1">{r.title}</p>}
          <p className="text-sm text-white/60 leading-relaxed mb-4">{r.body}</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(r.id, 'approve')}
              disabled={loading === r.id}
              className="px-4 py-1.5 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 text-xs font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading === r.id ? '...' : '✓ Approve'}
            </button>
            <button
              onClick={() => handleAction(r.id, 'delete')}
              disabled={loading === r.id}
              className="px-4 py-1.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 border border-red-400/20 text-xs font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading === r.id ? '...' : '✕ Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
