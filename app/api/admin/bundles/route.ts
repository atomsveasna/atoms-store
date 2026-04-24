import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // Parse items from text format: "slug:quantity:label" per line
  const items = (data.itemsText as string)
    .split('\n')
    .map((line: string) => {
      const [productSlug, qty, ...labelParts] = line.split(':')
      return {
        productSlug: productSlug?.trim(),
        quantity: parseInt(qty?.trim() ?? '1'),
        label: labelParts.join(':').trim() || productSlug?.trim(),
      }
    })
    .filter((i: { productSlug: string }) => i.productSlug)

  const res = await fetch(`${supabaseUrl}/rest/v1/bundles`, {
    method: 'POST',
    headers: {
      apikey:         serviceKey,
      Authorization:  `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer:         'return=representation',
    },
    body: JSON.stringify({
      slug:           data.slug,
      name:           data.name,
      tagline:        data.tagline,
      description:    data.description,
      original_price: parseFloat(data.originalPrice),
      bundle_price:   parseFloat(data.bundlePrice),
      currency:       'USD',
      is_published:   data.isPublished ?? true,
      is_featured:    data.isFeatured  ?? false,
      items,
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    }),
  })

  const result = await res.json()
  if (!res.ok) return NextResponse.json({ error: result.message ?? 'Failed' }, { status: 400 })
  return NextResponse.json({ success: true, slug: data.slug })
}
