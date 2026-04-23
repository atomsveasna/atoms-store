import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { DocMeta, DocPage } from '@/types'

const DOCS_DIR = path.join(process.cwd(), 'content/docs')

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = []

  function walk(dir: string, parts: string[] = []) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...parts, entry.name])
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        const slug = entry.name.replace(/\.(mdx|md)$/, '')
        slugs.push(slug === 'index' ? parts : [...parts, slug])
      }
    }
  }

  walk(DOCS_DIR)
  return slugs
}

export function getDocBySlug(slugParts: string[]): DocPage | null {
  const candidates = [
    path.join(DOCS_DIR, ...slugParts) + '.mdx',
    path.join(DOCS_DIR, ...slugParts) + '.md',
    path.join(DOCS_DIR, ...slugParts, 'index.mdx'),
    path.join(DOCS_DIR, ...slugParts, 'index.md'),
  ]

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: slugParts,
        meta: data as DocMeta,
        content,
      }
    }
  }

  return null
}

export function getDocsByProduct(productSlug: string): DocPage[] {
  const productDir = path.join(DOCS_DIR, productSlug)
  if (!fs.existsSync(productDir)) return []

  const files = fs.readdirSync(productDir).filter((f) =>
    f.endsWith('.mdx') || f.endsWith('.md')
  )

  return files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '')
      return getDocBySlug([productSlug, slug === 'index' ? '' : slug].filter(Boolean))
    })
    .filter(Boolean)
    .sort((a, b) => (a!.meta.order ?? 99) - (b!.meta.order ?? 99)) as DocPage[]
}
