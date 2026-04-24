import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus, type OrderStatus } from '@/lib/data/orders'
import { sendPaymentConfirmed, sendOrderShipped, sendOrderDelivered } from '@/lib/email'

export async function PATCH(req: NextRequest) {
  const { id, status, order } = await req.json()
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

  const ok = await updateOrderStatus(id, status as OrderStatus)
  if (!ok) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  // Send email based on new status
  if (order?.customerEmail) {
    if (status === 'payment_confirmed') {
      await sendPaymentConfirmed({
        orderNumber:   order.orderNumber,
        customerName:  order.customerName,
        customerEmail: order.customerEmail,
        total:         order.total,
      })
    } else if (status === 'shipped') {
      await sendOrderShipped({
        orderNumber:     order.orderNumber,
        customerName:    order.customerName,
        customerEmail:   order.customerEmail,
        shippingAddress: order.shippingAddress,
      })
    } else if (status === 'delivered') {
      await sendOrderDelivered({
        orderNumber:   order.orderNumber,
        customerName:  order.customerName,
        customerEmail: order.customerEmail,
        productSlug:   order.items?.[0]?.productId,
      })
    }
  }

  return NextResponse.json({ success: true })
}
