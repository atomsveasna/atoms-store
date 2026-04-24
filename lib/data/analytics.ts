const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

export type AnalyticsEvent =
  | 'page_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'order_placed'
  | 'review_submitted'
  | 'doc_view'
  | 'download'
  | 'register'
  | 'newsletter'

export async function trackEvent(
  event: AnalyticsEvent,
  data: { path?: string; referrer?: string; metadata?: Record<string, unknown> } = {}
) {
  if (!supabaseUrl || !serviceKey) return
  try {
    await fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        apikey:         serviceKey,
        Authorization:  `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        event,
        path:     data.path     ?? null,
        referrer: data.referrer ?? null,
        metadata: data.metadata ?? {},
      }),
    })
  } catch {}
}

export async function getAnalyticsSummary(days = 30) {
  if (!supabaseUrl || !serviceKey) return null
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/analytics_events?created_at=gte.${since}&select=event,path,created_at`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    )
    if (!res.ok) return null
    const events: { event: string; path: string; created_at: string }[] = await res.json()

    // Calculate summaries
    const pageViews    = events.filter((e) => e.event === 'page_view').length
    const addToCarts   = events.filter((e) => e.event === 'add_to_cart').length
    const ordersPlaced = events.filter((e) => e.event === 'order_placed').length
    const newsletters  = events.filter((e) => e.event === 'newsletter').length
    const registers    = events.filter((e) => e.event === 'register').length

    // Top pages
    const pageCounts: Record<string, number> = {}
    events.filter((e) => e.event === 'page_view' && e.path).forEach((e) => {
      pageCounts[e.path] = (pageCounts[e.path] ?? 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))

    // Daily page views for chart
    const dailyViews: Record<string, number> = {}
    events.filter((e) => e.event === 'page_view').forEach((e) => {
      const day = e.created_at.slice(0, 10)
      dailyViews[day] = (dailyViews[day] ?? 0) + 1
    })
    const chartData = Object.entries(dailyViews)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, views]) => ({ date, views }))

    return { pageViews, addToCarts, ordersPlaced, newsletters, registers, topPages, chartData, days }
  } catch { return null }
}
