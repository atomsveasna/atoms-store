import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Only allow in development
if (process.env.NODE_ENV === 'production') {
  console.warn('Admin API is disabled in production')
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 })
  }

  const data = await req.json()

  // Build the product object string
  const product = {
    id: `prod_${data.slug.replace(/-/g, '_')}`,
    slug: data.slug,
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    longDescription: data.longDescription || '',
    category: data.category,
    status: data.status,
    price: parseFloat(data.price),
    currency: 'USD',
    sku: data.sku,
    isNew: data.isNew === true,
    isFeatured: data.isFeatured === true,
    images: [],
    features: data.features
      .split('\n')
      .map((f: string) => f.trim())
      .filter(Boolean),
    specs: data.specs
      .split('\n')
      .map((line: string) => {
        const [label, ...rest] = line.split(':')
        return { label: label?.trim(), value: rest.join(':').trim() }
      })
      .filter((s: { label: string; value: string }) => s.label && s.value),
    packageContents: data.packageContents
      .split('\n')
      .map((p: string) => p.trim())
      .filter(Boolean),
    downloads: [],
    faqs: data.faqs
      .split('\n---\n')
      .map((block: string) => {
        const [q, ...a] = block.split('\n')
        return { question: q?.trim(), answer: a.join('\n').trim() }
      })
      .filter((f: { question: string; answer: string }) => f.question && f.answer),
    relatedSlugs: [],
    worksWithPlatforms: data.worksWithPlatforms
      .split(',')
      .map((p: string) => p.trim())
      .filter(Boolean),
    firmwareVersion: data.firmwareVersion || undefined,
    docSlug: data.slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Read current seed file
  const seedPath = path.join(process.cwd(), 'lib', 'seed', 'products.ts')
  let content = fs.readFileSync(seedPath, 'utf8')

  // Build the new product entry as a TypeScript string
  const newEntry = `
export const ${toVarName(data.slug)}: Product = ${JSON.stringify(product, null, 2)
    .replace(/"([^"]+)":/g, '$1:')      // unquote keys
    .replace(/"/g, "'")                  // single quotes
  }
`

  // Append before the PRODUCTS array, or append to end
  if (content.includes('export const PRODUCTS: Product[]')) {
    content = content.replace(
      'export const PRODUCTS: Product[]',
      `${newEntry}\nexport const PRODUCTS: Product[]`
    )
    // Add to the array
    content = content.replace(
      /export const PRODUCTS: Product\[\] = \[/,
      `export const PRODUCTS: Product[] = [\n  ${toVarName(data.slug)},`
    )
  } else {
    content += newEntry
  }

  fs.writeFileSync(seedPath, content, 'utf8')

  return NextResponse.json({ success: true, slug: product.slug })
}

function toVarName(slug: string): string {
  return slug
    .split('-')
    .map((w, i) => i === 0 ? w.toUpperCase().replace(/-/g, '_') : w)
    .join('_')
    .toUpperCase()
    .replace(/-/g, '_')
}
