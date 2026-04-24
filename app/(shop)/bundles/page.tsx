import Link from 'next/link'
import { getAllBundles, calcSavings, calcSavingsPct } from '@/lib/data/bundles'
import { formatPrice } from '@/lib/utils'

export const metadata = {
  title: 'Bundles & Kits',
  description: 'Save more with Atoms product bundles and starter kits.',
}

export default async function BundlesPage() {
  const bundles = await getAllBundles()

  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Bundles & Kits</p>
          <h1 className="text-4xl font-bold text-white mb-4">More for less.</h1>
          <p className="text-white/40 text-lg max-w-xl">Curated product bundles — everything you need for a project, at a better price.</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {bundles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => {
                const savings = calcSavings(bundle)
                const pct     = calcSavingsPct(bundle)
                return (
                  <Link key={bundle.slug} href={`/bundles/${bundle.slug}`} className="group flex flex-col border border-white/[0.08] hover:border-cyan-400/30 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all duration-200">
                    <div className="aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative">
                      {bundle.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={bundle.coverImage} alt={bundle.name} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/15">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 001 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                          </svg>
                          <span className="text-xs">{bundle.items.length} products</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">Save {pct}%</span>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h2 className="font-semibold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">{bundle.name}</h2>
                      <p className="text-sm text-white/40 mb-4 line-clamp-2 flex-1">{bundle.tagline}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {bundle.items.map((item, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/30">
                            {item.quantity}× {item.label ?? item.productSlug}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-end justify-between pt-3 border-t border-white/[0.06]">
                        <div>
                          <p className="text-xs text-white/25 line-through mb-0.5">{formatPrice(bundle.originalPrice, bundle.currency)}</p>
                          <p className="text-xl font-bold text-white">{formatPrice(bundle.bundlePrice, bundle.currency)}</p>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium">Save {formatPrice(savings, bundle.currency)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-white/30 text-sm mb-2">No bundles yet.</p>
              <Link href="/shop" className="text-cyan-400 text-sm hover:underline">Browse individual products →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
