import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ products: [], docs: [], posts: [] })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) return NextResponse.json({ products: [], docs: [], posts: [] })

  const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` }
  const encode  = encodeURIComponent

  const [productsRes, docsRes, postsRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/products?or=(name.ilike.*${encode(q)}*,description.ilike.*${encode(q)}*,tagline.ilike.*${encode(q)}*)&select=slug,name,tagline,price,currency,category,status`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/docs?or=(title.ilike.*${encode(q)}*,content.ilike.*${encode(q)}*)&is_published=eq.true&select=slug,title,description,category,product_slug`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/blog_posts?or=(title.ilike.*${encode(q)}*,excerpt.ilike.*${encode(q)}*)&is_published=eq.true&select=slug,title,excerpt,category`, { headers }),
  ])

  const [products, docs, posts] = await Promise.all([
    productsRes.ok ? productsRes.json() : [],
    docsRes.ok     ? docsRes.json()     : [],
    postsRes.ok    ? postsRes.json()    : [],
  ])

  return NextResponse.json({ products, docs, posts })
}
