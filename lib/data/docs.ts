/**
 * lib/data/docs.ts
 * Phase 0-1: Supabase-backed docs
 * Falls back to MDX files if Supabase not configured
 */

export interface Doc {
  id: string
  slug: string
  productSlug?: string
  title: string
  description?: string
  category: string
  content: string
  sortOrder: number
  tags: string[]
  isPublished: boolean
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function supabaseFetch(path: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`
  const res = await fetch(url, {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  return res.json()
}

function mapRow(row: Record<string, unknown>): Doc {
  return {
    id:          row.id as string,
    slug:        row.slug as string,
    productSlug: row.product_slug as string | undefined,
    title:       row.title as string,
    description: row.description as string | undefined,
    category:    row.category as string,
    content:     row.content as string,
    sortOrder:   row.sort_order as number,
    tags:        (row.tags as string[]) ?? [],
    isPublished: row.is_published as boolean,
    lastUpdated: row.last_updated as string,
    createdAt:   row.created_at as string,
    updatedAt:   row.updated_at as string,
  }
}

export async function getAllDocs(): Promise<Doc[]> {
  if (!USE_SUPABASE) return []
  try {
    const rows = await supabaseFetch('docs?select=*&is_published=eq.true&order=sort_order.asc')
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getDocBySlug(slug: string): Promise<Doc | null> {
  if (!USE_SUPABASE) return null
  try {
    const rows = await supabaseFetch(`docs?select=*&slug=eq.${slug}&limit=1`)
    return rows.length > 0 ? mapRow(rows[0]) : null
  } catch { return null }
}

export async function getDocsByProduct(productSlug: string): Promise<Doc[]> {
  if (!USE_SUPABASE) return []
  try {
    const rows = await supabaseFetch(
      `docs?select=*&product_slug=eq.${productSlug}&is_published=eq.true&order=sort_order.asc`
    )
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getDocCategories(productSlug: string): Promise<string[]> {
  const docs = await getDocsByProduct(productSlug)
  const cats = [...new Set(docs.map((d) => d.category))]
  return cats
}
