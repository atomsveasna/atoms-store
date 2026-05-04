'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'

export default function EditProductButton({ product }: { product: Product }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<{ src: string; alt: string; type: string }[]>(product.images ?? [])
  const [uploadingImg, setUploadingImg] = useState(false)
  const imgInputRef = useRef<HTMLInputElement>(null)

  const [values, setValues] = useState({
    name:               product.name,
    slug:               product.slug,
    sku:                product.sku,
    tagline:            product.tagline,
    description:        product.description,
    longDescription:    product.longDescription ?? '',
    category:           product.category,
    status:             product.status,
    price:              String(product.price),
    firmwareVersion:    product.firmwareVersion ?? '',
    isNew:              product.isNew,
    isFeatured:         product.isFeatured,
    features:           product.features.join('\n'),
    specs:              product.specs.map((s: { label: string; value: string }) => `${s.label}: ${s.value}`).join('\n'),
    packageContents:    product.packageContents.join('\n'),
    worksWithPlatforms: product.worksWithPlatforms.join(', '),
    faqs:               product.faqs?.map((f: { question: string; answer: string }) => `${f.question}\n${f.answer}`).join('\n---\n') ?? '',
  })

  function set(key: string, value: string | boolean) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || !files.length) return
    setUploadingImg(true)
    const results: { src: string; alt: string; type: string }[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('productSlug', product.slug)
      fd.append('type', 'photo')
      fd.append('alt', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) results.push({ src: data.url, alt: fd.get('alt') as string, type: 'photo' })
    }
    setImages((prev) => [...prev, ...results])
    setUploadingImg(false)
    if (imgInputRef.current) imgInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/products/${product.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      setOpen(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"
  const textareaCls = "w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all resize-none font-mono"

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-cyan-400/50 hover:text-cyan-400 transition-colors">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl bg-[#0d1525] border border-white/[0.08] rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold">Edit: {product.name}</h2>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="text-xs text-white/40 block mb-2">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/[0.08] group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-lg">×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploadingImg}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-white/[0.10] hover:border-cyan-400/30 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50">
                    {uploadingImg ? (
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span className="text-[10px] text-white/30">Add</span>
                      </>
                    )}
                  </button>
                  <input ref={imgInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-white/40 block mb-1.5">Name</label><input value={values.name} onChange={e => set('name', e.target.value)} className={inputCls} required /></div>
                <div><label className="text-xs text-white/40 block mb-1.5">Slug</label><input value={values.slug} onChange={e => set('slug', e.target.value)} className={inputCls} required /></div>
                <div><label className="text-xs text-white/40 block mb-1.5">SKU</label><input value={values.sku} onChange={e => set('sku', e.target.value)} className={inputCls} required /></div>
                <div><label className="text-xs text-white/40 block mb-1.5">Price (USD)</label><input type="number" step="0.01" value={values.price} onChange={e => set('price', e.target.value)} className={inputCls} required /></div>
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Category</label>
                  <select value={values.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    {['switches','sockets','sensors','accessories','bundles'].map(c => <option key={c} value={c} className="bg-[#0d1525]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 block mb-1.5">Status</label>
                  <select value={values.status} onChange={e => set('status', e.target.value)} className={inputCls}>
                    {['in_stock','low_stock','out_of_stock','preorder','coming_soon'].map(s => <option key={s} value={s} className="bg-[#0d1525]">{s}</option>)}
                  </select>
                </div>
              </div>

              <div><label className="text-xs text-white/40 block mb-1.5">Tagline</label><input value={values.tagline} onChange={e => set('tagline', e.target.value)} className={inputCls} required /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Short description</label><textarea value={values.description} onChange={e => set('description', e.target.value)} rows={3} className={textareaCls} required /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Long description</label><textarea value={values.longDescription} onChange={e => set('longDescription', e.target.value)} rows={3} className={textareaCls} /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Features (one per line)</label><textarea value={values.features} onChange={e => set('features', e.target.value)} rows={5} className={textareaCls} /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Specs (Label: Value per line)</label><textarea value={values.specs} onChange={e => set('specs', e.target.value)} rows={5} className={textareaCls} /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Package contents (one per line)</label><textarea value={values.packageContents} onChange={e => set('packageContents', e.target.value)} rows={4} className={textareaCls} /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Works with (comma separated)</label><input value={values.worksWithPlatforms} onChange={e => set('worksWithPlatforms', e.target.value)} className={inputCls} /></div>
              <div><label className="text-xs text-white/40 block mb-1.5">Firmware version</label><input value={values.firmwareVersion} onChange={e => set('firmwareVersion', e.target.value)} className={inputCls} /></div>

              <div className="flex gap-6">
                {[['isNew', 'Mark as New'], ['isFeatured', 'Mark as Featured']].map(([key, label]) => (
                  <button key={key} type="button" onClick={() => set(key, !values[key as keyof typeof values])} className="flex items-center gap-2 text-sm text-white/60">
                    <span className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${values[key as keyof typeof values] ? 'bg-cyan-400 border-cyan-400' : 'border-white/20'}`}>
                      {values[key as keyof typeof values] && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080d1a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </span>
                    {label}
                  </button>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/50 text-sm hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm transition-colors">
                  {loading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
