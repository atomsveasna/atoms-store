import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data/products'

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get('slugs')
  if (!slugsParam) return NextResponse.json({ products: [] })

  const slugs    = slugsParam.split(',').filter(Boolean).slice(0, 3)
  const all      = await getAllProducts()
  const products = slugs.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean)

  return NextResponse.json({ products })
}
