/**
 * lib/data/docs.ts
 *
 * ALL docs data access goes through this file.
 *
 * Phase 0-1: MDX files in content/docs/
 * Phase 2:   could migrate to a headless CMS — swap internals here only.
 */

import type { DocPage, DocMeta } from '@/types'
import { getDocBySlug, getAllDocSlugs, getDocsByProduct } from '@/lib/docs'

export async function getDoc(slugParts: string[]): Promise<DocPage | null> {
  return getDocBySlug(slugParts)
}

export async function getDocSlugs(): Promise<string[][]> {
  return getAllDocSlugs()
}

export async function getProductDocs(productSlug: string): Promise<DocPage[]> {
  return getDocsByProduct(productSlug)
}

export type { DocPage, DocMeta }
