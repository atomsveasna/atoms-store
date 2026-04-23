import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const product = {
    slug:                 data.slug,
    name:                 data.name,
    tagline:              data.tagline,
    description:          data.description,
    long_description:     data.longDescription || null,
    category:             data.category,
    status:               data.status,
    price:                parseFloat(data.price),
    currency:             'USD',
    sku:                  data.sku,
    is_new:               data.isNew === true,
    is_featured:          data.isFeatured === true,
    firmware_version:     data.firmwareVersion || null,
    doc_slug:             data.slug,
    features:             data.features.split('\n').map((f: string) => f.trim()).filter(Boolean),
    specs:                data.specs.split('\n').map((line: string) => {
      const [label, ...rest] = line.split(':')
      return { label: label?.trim(), value: rest.join(':').trim() }
    }).filter((s: { label: string; value: string }) => s.label && s.value),
    package_contents:     data.packageContents.split('\n').map((p: string) => p.trim()).filter(Boolean),
    works_with_platforms: data.worksWithPlatforms.split(',').map((p: string) => p.trim()).filter(Boolean),
    faqs:                 data.faqs
      ? data.faqs.split('\n---\n').map((block: string) => {
          const [q, ...a] = block.split('\n')
          return { question: q?.trim(), answer: a.join('\n').trim() }
        }).filter((f: { question: string; answer: string }) => f.question && f.answer)
      : [],
    downloads:            [],
    related_slugs:        [],
    revision_history:     null,
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
    method: 'POST',
    headers: {
      apikey:          serviceKey,
      Authorization:   `Bearer ${serviceKey}`,
      'Content-Type':  'application/json',
      Prefer:          'return=representation',
    },
    body: JSON.stringify(product),
  })

  const result = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: result.message ?? 'Failed to save' }, { status: 400 })
  }

  return NextResponse.json({ success: true, slug: data.slug })
}
