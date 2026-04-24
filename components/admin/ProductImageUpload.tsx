'use client'

import { useState, useRef } from 'react'

interface UploadedImage {
  url: string
  alt: string
  type: string
}

export default function ProductImageUpload({ productSlugs }: { productSlugs: string[] }) {
  const [productSlug, setProductSlug] = useState(productSlugs[0] ?? '')
  const [imageType, setImageType]     = useState('photo')
  const [alt, setAlt]                 = useState('')
  const [files, setFiles]             = useState<File[]>([])
  const [previews, setPreviews]       = useState<string[]>([])
  const [uploaded, setUploaded]       = useState<UploadedImage[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(selected: FileList | null) {
    if (!selected) return
    const arr = Array.from(selected)
    setFiles(arr)
    setPreviews(arr.map((f) => URL.createObjectURL(f)))
    setError('')
  }

  async function handleUpload() {
    if (!files.length || !productSlug) return
    setLoading(true)
    setError('')

    const results: UploadedImage[] = []

    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('productSlug', productSlug)
      fd.append('type', imageType)
      fd.append('alt', alt || file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))

      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Upload failed')
        setLoading(false)
        return
      }
      results.push({ url: data.url, alt: fd.get('alt') as string, type: imageType })
    }

    setUploaded((prev) => [...prev, ...results])
    setFiles([])
    setPreviews([])
    if (inputRef.current) inputRef.current.value = ''
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Config */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Product <span className="text-cyan-400">*</span></label>
          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all"
          >
            {productSlugs.map((s) => <option key={s} value={s} className="bg-[#0d1525]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Image type</label>
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-all"
          >
            <option value="photo"   className="bg-[#0d1525]">Photo</option>
            <option value="render"  className="bg-[#0d1525]">Render / 3D</option>
            <option value="diagram" className="bg-[#0d1525]">Diagram / wiring</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Alt text</label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Auto-generated from filename"
            className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 transition-all"
          />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        className="border-2 border-dashed border-white/[0.10] hover:border-cyan-400/30 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/50 transition-colors mb-3">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
          {files.length > 0 ? `${files.length} file(s) selected` : 'Click or drag images here'}
        </p>
        <p className="text-xs text-white/20 mt-1">JPG, PNG, WebP — multiple files supported</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Preview ${i+1}`} className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20">{error}</p>}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Uploading...</>
          ) : `Upload ${files.length} image${files.length > 1 ? 's' : ''}`}
        </button>
      )}

      {/* Uploaded results */}
      {uploaded.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Uploaded</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {uploaded.map((img, i) => (
              <div key={i} className="space-y-1">
                <div className="aspect-square rounded-xl overflow-hidden border border-emerald-400/20 bg-white/[0.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover"/>
                </div>
                <p className="text-[10px] text-white/30 truncate">{img.type}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-400 mt-3">✓ Images uploaded and linked to product. They will appear on the product page.</p>
        </div>
      )}
    </div>
  )
}
