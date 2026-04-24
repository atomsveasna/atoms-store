import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, type OrderStatus } from '@/lib/data/orders'

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  const ok = await updateOrderStatus(id, status as OrderStatus)
  if (!ok) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  return NextResponse.json({ success: true })
}
