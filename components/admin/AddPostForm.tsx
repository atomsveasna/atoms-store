'use client'

import { useState } from 'react'
import { CATEGORY_LABELS, type PostCategory } from '@/lib/data/blog'

export default function AddPostForm({ productSlugs }: { productSlugs: string[] }) {
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    category: 'tutorial' as PostCategory,
    author: 'Atoms Team', tags: '', productSlug: '',
    isPublished: true,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'title' && typeof value === 'string') {
      setForm((f) => ({
        ...f, title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          productSlug: form.productSlug || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(`Post "${form.title}" published at /learn/${form.slug}`)
      setForm((f) => ({ ...f, title: '', slug: '', excerpt: '', content: '', tags: '' }))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Title <span className="text-cyan-400">*</span></label>
          <input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="How to install Atoms Smart Switch 1G" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Slug <span className="text-cyan-400">*</span></label>
          <input required value={form.slug} onChange={(e) => set('slug', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all">
            {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((c) => (
              <option key={c} value={c} className="bg-[#0d1525]">{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Author</label>
          <input value={form.author} onChange={(e) => set('author', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Related product</label>
          <select value={form.productSlug} onChange={(e) => set('productSlug', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all">
            <option value="" className="bg-[#0d1525]">None</option>
            {productSlugs.map((s) => <option key={s} value={s} className="bg-[#0d1525]">{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Excerpt <span className="text-cyan-400">*</span></label>
        <textarea required value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short description shown in post listings and meta tags" rows={2} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none"/>
      </div>

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Content (Markdown) <span className="text-cyan-400">*</span></label>
        <textarea required value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="# Title&#10;&#10;Write your post in Markdown..." rows={14} className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none"/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Tags</label>
          <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="installation, switch, home-assistant" className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"/>
          <p className="text-xs text-white/20 mt-1">Comma-separated</p>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <button type="button" onClick={() => set('isPublished', !form.isPublished)} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${form.isPublished ? 'bg-cyan-400 border-cyan-400' : 'border-white/20 bg-white/[0.04]'}`}>
            {form.isPublished && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080d1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </button>
          <label className="text-sm text-white/60">Publish immediately</label>
        </div>
      </div>

      {error   && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}
      {success && <p className="text-sm text-emerald-400 px-4 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">✓ {success}</p>}

      <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
        {loading ? 'Publishing...' : 'Publish post'}
      </button>
    </form>
  )
}
