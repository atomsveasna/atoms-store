import Link from 'next/link'
import { getAllProducts } from '@/lib/data/products'
import { getAllDocs } from '@/lib/data/docs'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import AddProductForm from '@/components/admin/AddProductForm'
import AddDocForm from '@/components/admin/AddDocForm'

export default async function AdminPage() {
  const products = await getAllProducts()
  const docs     = await getAllDocs()

  return (
    <div className="space-y-12">

      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
        <p className="text-sm text-white/40">Manage products and documentation.</p>
      </div>

      {/* Products list */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Products</h2>
          <span className="text-xs text-white/30">{products.length} total</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {products.map((p) => (
            <div key={p.slug} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-cyan-400/60">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-white/30 font-mono">{p.sku}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">{formatPrice(p.price, p.currency)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${
                  p.status === 'in_stock'  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                  p.status === 'low_stock' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                  'bg-white/[0.05] text-white/30 border-white/10'
                }`}>{getStatusLabel(p.status)}</span>
                <Link href={`/products/${p.slug}`} target="_blank" className="text-xs text-white/20 hover:text-cyan-400 transition-colors">View →</Link>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="px-6 py-8 text-center text-sm text-white/30">No products yet</div>}
        </div>
      </div>

      {/* Add product */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6">Add new product</h2>
        <AddProductForm />
      </div>

      {/* Docs list */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Documentation</h2>
          <span className="text-xs text-white/30">{docs.length} docs</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {docs.map((d) => (
            <div key={d.slug} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{d.title}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">{d.slug} · {d.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.isPublished ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/[0.05] text-white/30'}`}>
                  {d.isPublished ? 'Published' : 'Draft'}
                </span>
                <Link href={`/docs/${d.slug}`} target="_blank" className="text-xs text-white/20 hover:text-cyan-400 transition-colors">View →</Link>
              </div>
            </div>
          ))}
          {docs.length === 0 && <div className="px-6 py-8 text-center text-sm text-white/30">No docs yet — add your first below</div>}
        </div>
      </div>

      {/* Add doc */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6">Add new doc</h2>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <AddDocForm productSlugs={products.map((p) => p.slug)} />
        </div>
      </div>
    </div>
  )
}
