/**
 * lib/data/products.ts
 *
 * ALL product data access goes through this file.
 * Pages and components never import from lib/products.ts directly.
 *
 * Phase 0: reads from static seed data (lib/seed/products.ts)
 * Phase 1: swap the internals here to read from Prisma/Supabase
 *           — zero changes needed in any page or component.
 *
 * Rule: every function returns Product | Product[] | null.
 *       Never throws. Returns null when not found.
 */

import type { Product, ProductCategory } from '@/types'
import { PRODUCTS } from '@/lib/seed/products'

// ── Read all ──────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  // Phase 1: return prisma.product.findMany()
  return PRODUCTS
}

// ── Read one ──────────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Phase 1: return prisma.product.findUnique({ where: { slug } })
  return PRODUCTS.find((p) => p.slug === slug) ?? null
}

// ── Filtered reads ────────────────────────────────────────────

export async function getFeaturedProducts(): Promise<Product[]> {
  // Phase 1: return prisma.product.findMany({ where: { isFeatured: true } })
  return PRODUCTS.filter((p) => p.isFeatured)
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  // Phase 1: return prisma.product.findMany({ where: { category } })
  return PRODUCTS.filter((p) => p.category === category)
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  // Phase 1: query by relatedSlugs or same category
  if (product.relatedSlugs.length > 0) {
    return PRODUCTS.filter((p) => product.relatedSlugs.includes(p.slug))
  }
  return PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3)
}

// ── Static params (for generateStaticParams) ──────────────────

export function getAllProductSlugs(): { slug: string }[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}
