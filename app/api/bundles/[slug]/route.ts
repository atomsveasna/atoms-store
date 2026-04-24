import { NextRequest, NextResponse } from 'next/server'
import { getBundleBySlug } from '@/lib/data/bundles'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const bundle = await getBundleBySlug(params.slug)
  if (!bundle) return NextResponse.json({ bundle: null }, { status: 404 })
  return NextResponse.json({ bundle })
}
