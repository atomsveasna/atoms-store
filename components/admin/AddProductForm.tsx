'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Field = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number'
  placeholder?: string
  hint?: string
  options?: { value: string; label: string }[]
  required?: boolean
}

const FIELDS: Field[] = [
  // ── Core info ────────────────────────────────────────────────
  { key: 'name',        label: 'Product name',     type: 'text',     placeholder: 'Atoms Smart Switch 2G', required: true },
  { key: 'slug',        label: 'URL slug',          type: 'text',     placeholder: 'atoms-smart-switch-2g', required: true, hint: 'Used in the URL: /products/your-slug' },
  { key: 'sku',         label: 'SKU',               type: 'text',     placeholder: 'ATM-SW2G-V1', required: true },
  { key: 'tagline',     label: 'Tagline',           type: 'text',     placeholder: 'Two gang. Full control.', required: true, hint: 'Short line shown under the product name' },
  { key: 'description', label: 'Short description', type: 'textarea', placeholder: 'A professional-grade...', required: true, hint: 'Used in search results and meta tags' },
  { key: 'longDescription', label: 'Long description', type: 'textarea', placeholder: 'Full product story...', hint: 'Shown in the Overview tab' },

  // ── Category & status ─────────────────────────────────────────
  {
    key: 'category', label: 'Category', type: 'select', required: true,
    options: [
      { value: 'switches',    label: 'Smart switches' },
      { value: 'sockets',     label: 'Smart sockets' },
      { value: 'sensors',     label: 'Sensors' },
      { value: 'accessories', label: 'Accessories' },
      { value: 'bundles',     label: 'Bundles & kits' },
    ]
  },
  {
    key: 'status', label: 'Stock status', type: 'select', required: true,
    options: [
      { value: 'in_stock',     label: 'In stock' },
      { value: 'low_stock',    label: 'Low stock' },
      { value: 'out_of_stock', label: 'Out of stock' },
      { value: 'preorder',     label: 'Pre-order' },
      { value: 'coming_soon',  label: 'Coming soon' },
    ]
  },
  { key: 'price',           label: 'Price (USD)',      type: 'number',   placeholder: '18', required: true },
  { key: 'firmwareVersion', label: 'Firmware version', type: 'text',     placeholder: '1.0.0', hint: 'e.g. 1.0.0' },

  // ── Flags ─────────────────────────────────────────────────────
  { key: 'isNew',      label: 'Mark as New',      type: 'checkbox' },
  { key: 'isFeatured', label: 'Mark as Featured', type: 'checkbox', hint: 'Shows on the homepage' },

  // ── Content ───────────────────────────────────────────────────
  {
    key: 'features', label: 'Key features', type: 'textarea', required: true,
    placeholder: 'Local-first — works without internet\nCompatible with Home Assistant\nREST API built-in',
    hint: 'One feature per line'
  },
  {
    key: 'specs', label: 'Specifications', type: 'textarea', required: true,
    placeholder: 'Input voltage: 100–240V AC\nMax load: 10A / 2200W\nWireless: Wi-Fi 802.11 b/g/n',
    hint: 'One spec per line in format: Label: Value'
  },
  {
    key: 'packageContents', label: 'Package contents', type: 'textarea', required: true,
    placeholder: '1× Switch unit\n1× Switch plate\n4× M3 screws\n1× Quick Start card',
    hint: 'One item per line'
  },
  {
    key: 'worksWithPlatforms', label: 'Works with', type: 'text',
    placeholder: 'Home Assistant, ESPHome, Tasmota',
    hint: 'Comma-separated list'
  },
  {
    key: 'faqs', label: 'FAQs', type: 'textarea',
    placeholder: 'Does it work offline?\nYes, it works locally after setup.\n---\nDoes it need a neutral wire?\nYes, a neutral wire is required.',
    hint: 'Format: Question on line 1, answer on line 2. Separate each FAQ with ---'
  },
]

function Label({ label, hint, required }: { label: string; hint?: string; required?: boolean }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </span>
      {hint && <p className="text-xs text-white/30 mt-0.5">{hint}</p>}
    </div>
  )
}

export default function AddProductForm() {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string | boolean>>({
    category: 'switches',
    status: 'in_stock',
    isNew: false,
    isFeatured: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function set(key: string, value: string | boolean) {
    setValues((v) => ({ ...v, [key]: value }))

    // Auto-generate slug from name
    if (key === 'name' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setValues((v) => ({ ...v, name: value, slug }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to save product')

      setSuccess(`Product "${values.name}" saved successfully. Slug: /products/${data.slug}`)
      setValues({ category: 'switches', status: 'in_stock', isNew: false, isFeatured: false })

      // Refresh after 2s so the new product appears
      setTimeout(() => router.refresh(), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section groups */}
      {[
        { title: 'Core info',        keys: ['name', 'slug', 'sku', 'tagline', 'description', 'longDescription'] },
        { title: 'Category & pricing', keys: ['category', 'status', 'price', 'firmwareVersion'] },
        { title: 'Flags',            keys: ['isNew', 'isFeatured'] },
        { title: 'Content',          keys: ['features', 'specs', 'packageContents', 'worksWithPlatforms', 'faqs'] },
      ].map((section) => (
        <div key={section.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">{section.title}</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {section.keys.map((key) => {
              const field = FIELDS.find((f) => f.key === key)!
              const value = values[key] ?? ''

              if (field.type === 'checkbox') {
                return (
                  <div key={key} className="flex items-start gap-3 sm:col-span-1">
                    <button
                      type="button"
                      onClick={() => set(key, !value)}
                      className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        value ? 'bg-cyan-400 border-cyan-400' : 'border-white/20 bg-white/[0.04]'
                      }`}
                    >
                      {value && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080d1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                    <Label label={field.label} hint={field.hint} />
                  </div>
                )
              }

              if (field.type === 'select') {
                return (
                  <div key={key} className="sm:col-span-1">
                    <Label label={field.label} hint={field.hint} required={field.required} />
                    <select
                      value={value as string}
                      onChange={(e) => set(key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                    >
                      {field.options!.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0d1525]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }

              if (field.type === 'textarea') {
                return (
                  <div key={key} className="sm:col-span-2">
                    <Label label={field.label} hint={field.hint} required={field.required} />
                    <textarea
                      value={value as string}
                      onChange={(e) => set(key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={key === 'specs' || key === 'features' ? 6 : key === 'faqs' ? 8 : 4}
                      required={field.required}
                      className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all resize-none font-mono"
                    />
                  </div>
                )
              }

              return (
                <div key={key} className={field.type === 'text' && (key === 'tagline' || key === 'sku') ? 'sm:col-span-1' : 'sm:col-span-1'}>
                  <Label label={field.label} hint={field.hint} required={field.required} />
                  <input
                    type={field.type}
                    value={value as string}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    step={field.type === 'number' ? '0.01' : undefined}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Status messages */}
      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-400/10 border border-red-400/20 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="px-5 py-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-sm text-emerald-400">
          ✓ {success}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-white/20">
          Saves directly to <code className="font-mono">lib/seed/products.ts</code>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add product
            </>
          )}
        </button>
      </div>
    </form>
  )
}
