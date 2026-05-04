import Link from 'next/link'
import { getAllProducts } from '@/lib/data/products'
import { getAllDocs } from '@/lib/data/docs'
import { getAllOrders } from '@/lib/data/orders'
import { getAllPosts, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/data/blog'
import { formatPrice, getStatusLabel } from '@/lib/utils'
import AddProductForm from '@/components/admin/AddProductForm'
import AddDocForm from '@/components/admin/AddDocForm'
import AddPostForm from '@/components/admin/AddPostForm'
import ProductImageUpload from '@/components/admin/ProductImageUpload'
import OrdersManager from '@/components/admin/OrdersManager'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import EditProductButton from '@/components/admin/EditProductButton'

export default async function AdminPage() {
  const [products, docs, orders, posts] = await Promise.all([
    getAllProducts(), getAllDocs(), getAllOrders(), getAllPosts(),
  ])
  const slugs = products.map((p) => p.slug)

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Admin</h1>
        <p className="text-sm text-white/40">Manage orders, products, images, docs, and blog posts.</p>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6">Orders</h2>
        <OrdersManager orders={orders} />
      </div>

      {/* Products list */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Products</h2>
          <span className="text-xs text-white/30">{products.length} total</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {products.map((p) => (
            <div key={p.slug} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-cyan-400/60"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-white/30 font-mono">{p.sku}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white">{formatPrice(p.price, p.currency)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${p.status === 'in_stock' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-white/[0.05] text-white/30 border-white/10'}`}>
                  {getStatusLabel(p.status)}
                </span>
                <Link href={`/products/${p.slug}`} target="_blank" className="text-xs text-white/20 hover:text-cyan-400">View →</Link>
                <EditProductButton product={p} />
                <DeleteProductButton slug={p.slug} />
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="px-6 py-8 text-center text-sm text-white/30">No products yet</div>}
        </div>
      </div>

      {/* Image upload */}
      {slugs.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Upload product images</h2>
          <p className="text-sm text-white/40 mb-6">Stored in Supabase Storage — appear on product pages immediately.</p>
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <ProductImageUpload productSlugs={slugs} />
          </div>
        </div>
      )}

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
            <div key={d.slug} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02]">
              <div>
                <p className="text-sm font-medium text-white">{d.title}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">{d.slug} · {d.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.isPublished ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/[0.05] text-white/30'}`}>
                  {d.isPublished ? 'Published' : 'Draft'}
                </span>
                <Link href={`/docs/${d.slug}`} target="_blank" className="text-xs text-white/20 hover:text-cyan-400">View →</Link>
              </div>
            </div>
          ))}
          {docs.length === 0 && <div className="px-6 py-8 text-center text-sm text-white/30">No docs yet</div>}
        </div>
      </div>

      {/* Add doc */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6">Add new doc</h2>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <AddDocForm productSlugs={slugs.length > 0 ? slugs : ['atoms-smart-switch-1g']} />
        </div>
      </div>

      {/* Blog posts list */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Blog / Tutorials</h2>
          <span className="text-xs text-white/30">{posts.length} posts</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {posts.map((p) => (
            <div key={p.slug} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02]">
              <div>
                <p className="text-sm font-medium text-white">{p.title}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">{p.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[p.category]}`}>
                  {CATEGORY_LABELS[p.category]}
                </span>
                <Link href={`/learn/${p.slug}`} target="_blank" className="text-xs text-white/20 hover:text-cyan-400">View →</Link>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div className="px-6 py-8 text-center text-sm text-white/30">No posts yet</div>}
        </div>
      </div>

      {/* Add post */}
      <div>
        <h2 className="text-lg font-bold text-white mb-6">Add new post</h2>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <AddPostForm productSlugs={slugs.length > 0 ? slugs : ['atoms-smart-switch-1g']} />
        </div>
      </div>
    </div>
  )
}
