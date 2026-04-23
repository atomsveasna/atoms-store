import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/docs`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      slug:         data.slug,
      product_slug: data.productSlug || null,
      title:        data.title,
      description:  data.description || null,
      category:     data.category,
      content:      data.content,
      sort_order:   data.sortOrder ?? 0,
      tags:         data.tags ?? [],
      is_published: data.isPublished ?? true,
      last_updated: new Date().toISOString(),
    }),
  })

  const result = await res.json()
  if (!res.ok) return NextResponse.json({ error: result.message ?? 'Failed' }, { status: 400 })
  return NextResponse.json({ success: true, slug: data.slug })
}
