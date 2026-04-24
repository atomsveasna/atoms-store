import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/data/orders'

export async function POST(req: NextRequest) {
  const data = await req.json()

  // Save to Supabase
  const order = await createOrder({
    orderNumber:     data.orderNumber,
    customerName:    data.customerName,
    customerEmail:   data.customerEmail,
    customerPhone:   data.customerPhone,
    shippingAddress: data.shippingAddress,
    subtotal:        data.subtotal,
    shippingFee:     data.shippingFee ?? 0,
    total:           data.total,
    currency:        data.currency ?? 'USD',
    paymentMethod:   data.paymentMethod,
    status:          data.status ?? 'payment_submitted',
    notes:           data.notes,
    items:           data.items,
  })

  // Send Telegram notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID

  if (botToken && chatId) {
    const lines = [
      `🛒 *New Order — ${data.orderNumber}*`,
      ``,
      `👤 *Customer*`,
      `Name: ${data.customerName}`,
      `Phone: ${data.customerPhone}`,
      data.customerEmail ? `Email: ${data.customerEmail}` : null,
      ``,
      `📦 *Items*`,
      ...data.items.map((i: { quantity: number; productName: string; unitPrice: number }) =>
        `• ${i.quantity}× ${i.productName} — $${i.unitPrice}`
      ),
      ``,
      `💰 *Total: $${data.total}*`,
      `Payment: ABA Transfer`,
      ``,
      `📍 *Delivery*`,
      data.shippingAddress.addressLine1,
      data.shippingAddress.addressLine2 ?? null,
      data.shippingAddress.city,
      data.shippingAddress.notes ? `Notes: ${data.shippingAddress.notes}` : null,
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: 'Markdown' }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, orderNumber: data.orderNumber })
}
