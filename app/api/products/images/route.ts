import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ images: [] })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) return NextResponse.json({ images: [] })

  // Get product id first
  const prodRes = await fetch(
    `${supabaseUrl}/rest/v1/products?slug=eq.${slug}&select=id`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  )
  const products = await prodRes.json()
  if (!products.length) return NextResponse.json({ images: [] })

  const productId = products[0].id
  const imgRes = await fetch(
    `${supabaseUrl}/rest/v1/product_images?product_id=eq.${productId}&order=sort_order.asc`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
  )
  const images = await imgRes.json()
  return NextResponse.json({ images })
}
