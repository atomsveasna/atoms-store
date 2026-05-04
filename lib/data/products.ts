/**
 * lib/data/products.ts
 * Phase 0: seed data | Phase 1: Supabase (current)
 */

import type { Product, ProductCategory } from '@/types'

const USE_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function mapRow(row: Record<string, unknown>): Product {
  const imgRows = (row.product_images as Record<string, unknown>[] | undefined) ?? []
  return {
    id:                 row.id as string,
    slug:               row.slug as string,
    name:               row.name as string,
    tagline:            row.tagline as string,
    description:        row.description as string,
    longDescription:    row.long_description as string | undefined,
    category:           row.category as ProductCategory,
    status:             row.status as Product['status'],
    price:              Number(row.price),
    currency:           row.currency as string,
    sku:                row.sku as string,
    features:           row.features as string[],
    specs:              row.specs as Product['specs'],
    packageContents:    row.package_contents as string[],
    downloads:          row.downloads as Product['downloads'],
    faqs:               row.faqs as Product['faqs'],
    relatedSlugs:       row.related_slugs as string[],
    worksWithPlatforms: row.works_with_platforms as string[],
    docSlug:            row.doc_slug as string | undefined,
    firmwareVersion:    row.firmware_version as string | undefined,
    revisionHistory:    row.revision_history as Product['revisionHistory'],
    isNew:              row.is_new as boolean,
    isFeatured:         row.is_featured as boolean,
    images:             imgRows.map((img) => ({
      src:  img.src as string,
      alt:  img.alt as string,
      type: img.type as 'photo' | 'render' | 'diagram',
    })),
    createdAt:          row.created_at as string,
    updatedAt:          row.updated_at as string,
  }
}

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

async function getSeedProducts(): Promise<Product[]> {
  const { PRODUCTS } = await import('@/lib/seed/products')
  return PRODUCTS
}

const WITH_IMAGES = 'products?select=*,product_images(src,alt,type,sort_order)&order=created_at.desc'

export async function getAllProducts(): Promise<Product[]> {
  if (!USE_SUPABASE) return getSeedProducts()
  try {
    const rows = await supabaseFetch(WITH_IMAGES)
    return rows.map(mapRow)
  } catch { return getSeedProducts() }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!USE_SUPABASE) {
    const p = await getSeedProducts()
    return p.find((p) => p.slug === slug) ?? null
  }
  try {
    const rows = await supabaseFetch(`products?select=*,product_images(src,alt,type,sort_order)&slug=eq.${slug}&limit=1`)
    return rows.length > 0 ? mapRow(rows[0]) : null
  } catch {
    const p = await getSeedProducts()
    return p.find((p) => p.slug === slug) ?? null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!USE_SUPABASE) {
    const p = await getSeedProducts()
    return p.filter((p) => p.isFeatured)
  }
  try {
    const rows = await supabaseFetch('products?select=*,product_images(src,alt,type,sort_order)&is_featured=eq.true')
    return rows.map(mapRow)
  } catch {
    const p = await getSeedProducts()
    return p.filter((p) => p.isFeatured)
  }
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  if (!USE_SUPABASE) {
    const p = await getSeedProducts()
    return p.filter((p) => p.category === category)
  }
  try {
    const rows = await supabaseFetch(`products?select=*,product_images(src,alt,type,sort_order)&category=eq.${category}`)
    return rows.map(mapRow)
  } catch {
    const p = await getSeedProducts()
    return p.filter((p) => p.category === category)
  }
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  const all = await getAllProducts()
  if (product.relatedSlugs.length > 0) {
    return all.filter((p) => product.relatedSlugs.includes(p.slug))
  }
  return all.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3)
}

export function getAllProductSlugs(): { slug: string }[] {
  const { PRODUCTS } = require('@/lib/seed/products')
  return PRODUCTS.map((p: Product) => ({ slug: p.slug }))
}
