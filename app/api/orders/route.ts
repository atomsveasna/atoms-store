import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/data/orders'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  const data = await req.json()

  // Save to Supabase
  await createOrder({
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

  // Send order confirmation email
  if (data.customerEmail) {
    await sendOrderConfirmation({
      orderNumber:     data.orderNumber,
      customerName:    data.customerName,
      customerEmail:   data.customerEmail,
      items:           data.items,
      total:           data.total,
      currency:        data.currency ?? 'USD',
      shippingAddress: data.shippingAddress,
    })
  }

  // Telegram notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID
  if (botToken && chatId) {
    const lines = [
      `🛒 *New Order — ${data.orderNumber}*`,
      ``,
      `👤 ${data.customerName} · ${data.customerPhone}`,
      data.customerEmail ? `📧 ${data.customerEmail}` : null,
      ``,
      `📦 ${data.items.map((i: { quantity: number; productName: string }) => `${i.quantity}× ${i.productName}`).join(', ')}`,
      `💰 $${data.total}`,
      ``,
      `📍 ${data.shippingAddress.addressLine1}, ${data.shippingAddress.city}`,
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: 'Markdown' }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, orderNumber: data.orderNumber })
}
