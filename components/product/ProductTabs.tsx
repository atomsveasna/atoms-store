'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Product, ProductSpec } from '@/types'

export function TabOverview({ product }: { product: Product }) {
  return (
    <div className="space-y-10">
      {product.longDescription && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">About this product</h3>
          <p className="text-white/60 leading-relaxed text-[15px]">{product.longDescription}</p>
        </div>
      )}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Key features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {product.features.map((f) => (
            <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="text-sm text-white/70">{f}</span>
            </div>
          ))}
        </div>
      </div>
      {product.worksWithPlatforms.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Works with</h3>
          <div className="flex flex-wrap gap-2">
            {product.worksWithPlatforms.map((p) => (
              <span key={p} className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/60">{p}</span>
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Package contents</h3>
        <ul className="space-y-2">
          {product.packageContents.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
              <span className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0"/>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function TabSpecs({ product }: { product: Product }) {
  const groups = product.specs.reduce<Record<string, ProductSpec[]>>((acc, spec) => {
    const g = spec.group ?? 'General'
    if (!acc[g]) acc[g] = []
    acc[g].push(spec)
    return acc
  }, {})
  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, specs]) => (
        <div key={group}>
          <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">{group}</h3>
          <div className="rounded-xl border border-white/[0.07] overflow-hidden">
            {specs.map((spec, i) => (
              <div key={spec.label} className={`flex items-center gap-4 px-5 py-3.5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                <span className="text-sm text-white/40 w-44 flex-shrink-0">{spec.label}</span>
                <span className="text-sm text-white/80 font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {product.firmwareVersion && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-400/[0.04] border border-cyan-400/10">
          <div>
            <p className="text-sm font-medium text-white">Current firmware</p>
            <p className="text-xs text-white/40 mt-0.5">Latest stable release</p>
          </div>
          <span className="font-mono text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg">v{product.firmwareVersion}</span>
        </div>
      )}
    </div>
  )
}

export function TabSetup({ product }: { product: Product }) {
  const links = [
    { label: 'Quick start guide',     href: `/docs/${product.docSlug}/quick-start`,     desc: 'Provision in under 2 minutes' },
    { label: 'Installation guide',    href: `/docs/${product.docSlug}/installation`,    desc: 'Full wiring and mounting' },
    { label: 'Home Assistant setup',  href: `/docs/${product.docSlug}/home-assistant`,  desc: 'Native REST + MQTT integration' },
    { label: 'REST API reference',    href: `/docs/${product.docSlug}/api`,             desc: 'All endpoints documented' },
    { label: 'Firmware update guide', href: `/docs/${product.docSlug}/firmware`,        desc: 'OTA via web UI' },
    { label: 'Troubleshooting',       href: `/docs/${product.docSlug}/troubleshooting`, desc: 'Common issues and fixes' },
  ]
  return (
    <div className="space-y-6">
      <p className="text-white/50 text-sm leading-relaxed">Complete setup documentation is available in the Atoms docs center.</p>
      <div className="space-y-2">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <div>
                <p className="text-sm text-white/70 group-hover:text-white transition-colors">{item.label}</p>
                <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        ))}
      </div>
      {product.revisionHistory && product.revisionHistory.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Firmware changelog</h3>
          <div className="space-y-3">
            {product.revisionHistory.map((rev, i) => (
              <div key={rev.version} className="flex gap-4 items-start">
                <span className={`font-mono text-xs px-2 py-1 rounded-md flex-shrink-0 mt-0.5 ${i === 0 ? 'bg-cyan-400/10 text-cyan-400' : 'bg-white/[0.04] text-white/30'}`}>v{rev.version}</span>
                <div>
                  <p className="text-sm text-white/60">{rev.notes}</p>
                  <p className="text-xs text-white/25 mt-0.5">{rev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function TabDownloads({ product }: { product: Product }) {
  return (
    <div className="space-y-3">
      {product.downloads.map((dl) => (
        <a key={dl.filename} href={dl.url} download className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 group-hover:text-cyan-400/70 transition-colors flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <p className="text-sm text-white/70 group-hover:text-white transition-colors">{dl.label}</p>
              <p className="text-xs text-white/25 mt-0.5 font-mono">{dl.filename}{dl.size ? ` · ${dl.size}` : ''}</p>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </a>
      ))}
      <p className="text-xs text-white/25 pt-2 px-1">All files are free. No registration required.</p>
    </div>
  )
}

export function TabFAQ({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {product.faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-white/[0.07] overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors">
            <span className="text-sm font-medium text-white/80 pr-4">{faq.question}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-5 border-t border-white/[0.05]">
              <p className="text-sm text-white/50 leading-relaxed pt-4">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
