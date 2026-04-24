import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ orders: [] })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) return NextResponse.json({ orders: [] })

  const res = await fetch(
    `${supabaseUrl}/rest/v1/orders?customer_email=eq.${encodeURIComponent(email)}&order=created_at.desc`,
    {
      headers: {
        apikey:        serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  )

  if (!res.ok) return NextResponse.json({ orders: [] })
  const orders = await res.json()
  return NextResponse.json({ orders })
}
