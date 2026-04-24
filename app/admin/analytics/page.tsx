import { getAllOrders } from '@/lib/data/orders'
import { getAllProducts } from '@/lib/data/products'
import { getAnalyticsSummary } from '@/lib/data/analytics'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [summary, orders, products] = await Promise.all([
    getAnalyticsSummary(30),
    getAllOrders(),
    getAllProducts(),
  ])

  // Order stats
  const totalRevenue  = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => ['pending_payment', 'payment_submitted'].includes(o.status)).length
  const delivered     = orders.filter((o) => o.status === 'delivered').length

  // Revenue by product
  const productRevenue: Record<string, number> = {}
  orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
    o.items.forEach((item) => {
      productRevenue[item.productName] = (productRevenue[item.productName] ?? 0) + item.totalPrice
    })
  })
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#080d1a] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Last 30 days</p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total revenue',   value: formatPrice(totalRevenue, 'USD'), sub: `${orders.length} orders` },
            { label: 'Page views',      value: summary?.pageViews.toLocaleString() ?? '—', sub: '30 days' },
            { label: 'Pending orders',  value: pendingOrders, sub: 'Need attention' },
            { label: 'Delivered',       value: delivered, sub: 'Completed orders' },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <p className="text-xs text-white/40 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/25">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Traffic stats */}
          {summary && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Traffic (30 days)</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Page views',    value: summary.pageViews },
                  { label: 'Add to carts',  value: summary.addToCarts },
                  { label: 'Orders placed', value: summary.ordersPlaced },
                  { label: 'Subscribers',   value: summary.newsletters },
                  { label: 'Registrations', value: summary.registers },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-xs text-white/30 mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Conversion rate */}
              {summary.pageViews > 0 && (
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-white/30 mb-1">Order conversion rate</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {((summary.ordersPlaced / summary.pageViews) * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Top pages */}
          {summary && summary.topPages.length > 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Top pages</h2>
              <div className="space-y-3">
                {summary.topPages.map((page, i) => {
                  const maxViews = summary.topPages[0].views
                  const pct = (page.views / maxViews) * 100
                  return (
                    <div key={page.path}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60 truncate max-w-[200px]">{page.path || '/'}</span>
                        <span className="text-xs text-white/40 flex-shrink-0 ml-2">{page.views}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full bg-cyan-400/50 rounded-full" style={{ width: `${pct}%` }}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top products by revenue */}
        {topProducts.length > 0 && (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">Revenue by product</h2>
            <div className="space-y-3">
              {topProducts.map(([name, revenue]) => {
                const maxRev = topProducts[0][1]
                const pct    = (revenue / maxRev) * 100
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/70">{name}</span>
                      <span className="text-sm font-semibold text-white">{formatPrice(revenue, 'USD')}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-emerald-400/50 rounded-full" style={{ width: `${pct}%` }}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Recent orders</h2>
            <a href="/admin" className="text-xs text-cyan-400 hover:underline">Manage all →</a>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {orders.slice(0, 8).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-mono text-cyan-400">{order.orderNumber}</p>
                  <p className="text-xs text-white/30">{order.customerName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">{formatPrice(order.total, order.currency)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered'         ? 'bg-emerald-400/10 text-emerald-400' :
                    order.status === 'payment_submitted' ? 'bg-amber-400/10 text-amber-400' :
                    order.status === 'shipped'           ? 'bg-cyan-400/10 text-cyan-400' :
                    'bg-white/[0.05] text-white/30'
                  }`}>{order.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-white/30">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
