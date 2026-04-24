export interface BundleItem {
  productSlug: string
  quantity: number
  label?: string
}

export interface Bundle {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  coverImage?: string
  originalPrice: number
  bundlePrice: number
  currency: string
  isFeatured: boolean
  isPublished: boolean
  items: BundleItem[]
  includes: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

function mapRow(row: Record<string, unknown>): Bundle {
  return {
    id:            row.id as string,
    slug:          row.slug as string,
    name:          row.name as string,
    tagline:       row.tagline as string,
    description:   row.description as string,
    coverImage:    row.cover_image as string | undefined,
    originalPrice: Number(row.original_price),
    bundlePrice:   Number(row.bundle_price),
    currency:      row.currency as string,
    isFeatured:    row.is_featured as boolean,
    isPublished:   row.is_published as boolean,
    items:         (row.items as BundleItem[]) ?? [],
    includes:      (row.includes as string[]) ?? [],
    tags:          (row.tags as string[]) ?? [],
    createdAt:     row.created_at as string,
    updatedAt:     row.updated_at as string,
  }
}

async function sbFetch(path: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey!}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  return res.json()
}

export async function getAllBundles(): Promise<Bundle[]> {
  if (!supabaseUrl || !anonKey) return []
  try {
    const rows = await sbFetch('bundles?select=*&is_published=eq.true&order=created_at.desc')
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getFeaturedBundles(): Promise<Bundle[]> {
  if (!supabaseUrl || !anonKey) return []
  try {
    const rows = await sbFetch('bundles?select=*&is_featured=eq.true&is_published=eq.true')
    return rows.map(mapRow)
  } catch { return [] }
}

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
  if (!supabaseUrl || !anonKey) return null
  try {
    const rows = await sbFetch(`bundles?select=*&slug=eq.${slug}&limit=1`)
    return rows.length > 0 ? mapRow(rows[0]) : null
  } catch { return null }
}

export async function createBundle(data: Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
  if (!supabaseUrl || !serviceKey) return false
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/bundles`, {
      method: 'POST',
      headers: {
        apikey:         serviceKey,
        Authorization:  `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({
        slug:           data.slug,
        name:           data.name,
        tagline:        data.tagline,
        description:    data.description,
        cover_image:    data.coverImage    ?? null,
        original_price: data.originalPrice,
        bundle_price:   data.bundlePrice,
        currency:       data.currency,
        is_featured:    data.isFeatured,
        is_published:   data.isPublished,
        items:          data.items,
        includes:       data.includes,
        tags:           data.tags,
      }),
    })
    return res.ok
  } catch { return false }
}

export function calcSavings(bundle: Bundle): number {
  return bundle.originalPrice - bundle.bundlePrice
}

export function calcSavingsPct(bundle: Bundle): number {
  return Math.round((calcSavings(bundle) / bundle.originalPrice) * 100)
}
