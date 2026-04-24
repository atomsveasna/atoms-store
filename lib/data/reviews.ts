export interface Review {
  id: string
  productSlug: string
  authorName: string
  rating: number
  title?: string
  body: string
  isVerified: boolean
  createdAt: string
}

export interface ReviewStats {
  average: number
  total: number
  breakdown: Record<number, number> // { 5: 10, 4: 5, ... }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

function mapRow(row: Record<string, unknown>): Review {
  return {
    id:          row.id as string,
    productSlug: row.product_slug as string,
    authorName:  row.author_name as string,
    rating:      row.rating as number,
    title:       row.title as string | undefined,
    body:        row.body as string,
    isVerified:  row.is_verified as boolean,
    createdAt:   row.created_at as string,
  }
}

export async function getReviewsByProduct(productSlug: string): Promise<Review[]> {
  if (!supabaseUrl || !anonKey) return []
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/product_reviews?product_slug=eq.${productSlug}&is_published=eq.true&order=created_at.desc`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }, next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map(mapRow)
  } catch { return [] }
}

export function calcStats(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) return { average: 0, total: 0, breakdown: {} }
  const total    = reviews.length
  const sum      = reviews.reduce((acc, r) => acc + r.rating, 0)
  const average  = Math.round((sum / total) * 10) / 10
  const breakdown = reviews.reduce<Record<number, number>>((acc, r) => {
    acc[r.rating] = (acc[r.rating] ?? 0) + 1
    return acc
  }, {})
  return { average, total, breakdown }
}

export async function submitReview(data: {
  productSlug: string
  authorName: string
  authorEmail?: string
  rating: number
  title?: string
  body: string
}): Promise<{ success: boolean; error?: string }> {
  if (!supabaseUrl || !anonKey) return { success: false, error: 'Not configured' }
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/product_reviews`, {
      method: 'POST',
      headers: {
        apikey:         anonKey,
        Authorization:  `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        product_slug:  data.productSlug,
        author_name:   data.authorName,
        author_email:  data.authorEmail ?? null,
        rating:        data.rating,
        title:         data.title ?? null,
        body:          data.body,
        is_published:  false, // requires admin approval
      }),
    })
    if (!res.ok) return { success: false, error: 'Failed to submit' }
    return { success: true }
  } catch { return { success: false, error: 'Something went wrong' } }
}

export async function getPendingReviews(): Promise<Review[]> {
  if (!supabaseUrl || !serviceKey) return []
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/product_reviews?is_published=eq.false&order=created_at.desc`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
    )
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map(mapRow)
  } catch { return [] }
}

export async function approveReview(id: string): Promise<boolean> {
  if (!supabaseUrl || !serviceKey) return false
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/product_reviews?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey:         serviceKey,
        Authorization:  `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_published: true }),
    })
    return res.ok
  } catch { return false }
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!supabaseUrl || !serviceKey) return false
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/product_reviews?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    })
    return res.ok
  } catch { return false }
}
