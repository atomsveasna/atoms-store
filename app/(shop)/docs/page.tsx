import Link from 'next/link'
import { getAllProducts } from '@/lib/data/products'
import { getDocsByProduct } from '@/lib/data/docs'

export const metadata = {
  title: 'Documentation',
  description: 'Setup guides, API references, firmware notes, and troubleshooting for all Atoms products.',
}

const CATEGORY_LABELS: Record<string, string> = {
  'getting-started':  'Getting started',
  'installation':     'Installation',
  'configuration':    'Configuration',
  'api':              'API reference',
  'firmware':         'Firmware',
  'troubleshooting':  'Troubleshooting',
  'downloads':        'Downloads',
}

export default async function DocsIndexPage() {
  const products = await getAllProducts()

  const productDocs = await Promise.all(
    products.map(async (p) => ({
      product: p,
      docs: await getDocsByProduct(p.slug),
    }))
  )

  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Documentation</p>
          <h1 className="text-4xl font-bold text-white mb-4">Docs center</h1>
          <p className="text-white/40 text-lg max-w-xl">
            Setup guides, API references, firmware notes, and troubleshooting — for every Atoms product.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <span key={key} className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-xs text-white/40 hover:text-white hover:border-white/20 transition-all cursor-pointer">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Product docs */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {productDocs.map(({ product, docs }) => (
            <div key={product.slug}>
              {/* Product header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/70">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{product.name}</h2>
                    <p className="text-xs text-white/30 font-mono">{product.sku}</p>
                  </div>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="text-xs text-white/30 hover:text-cyan-400 transition-colors"
                >
                  View product →
                </Link>
              </div>

              {/* Doc links */}
              {docs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {docs.map((doc) => (
                    <Link
                      key={doc.slug}
                      href={`/docs/${doc.slug}`}
                      className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0 mt-0.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{doc.title}</p>
                        {doc.description && (
                          <p className="text-xs text-white/30 mt-0.5 line-clamp-1">{doc.description}</p>
                        )}
                        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/30">
                          {CATEGORY_LABELS[doc.category] ?? doc.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-white/[0.05] border-dashed text-center">
                  <p className="text-sm text-white/25">Documentation coming soon for this product.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
