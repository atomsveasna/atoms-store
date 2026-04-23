import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const order = await req.json()

  // Send Telegram notification if configured
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID

  if (botToken && chatId) {
    const lines = [
      `🛒 *New Order — ${order.orderNumber}*`,
      ``,
      `👤 *Customer*`,
      `Name: ${order.customerName}`,
      `Phone: ${order.customerPhone}`,
      order.customerEmail ? `Email: ${order.customerEmail}` : null,
      ``,
      `📦 *Items*`,
      ...order.items.map((i: { quantity: number; productName: string; unitPrice: number }) =>
        `• ${i.quantity}× ${i.productName} — $${i.unitPrice}`
      ),
      ``,
      `💰 *Total: $${order.total}*`,
      `Payment: ABA Transfer`,
      ``,
      `📍 *Delivery*`,
      `${order.shippingAddress.addressLine1}`,
      order.shippingAddress.addressLine2 ?? null,
      `${order.shippingAddress.city}`,
      order.shippingAddress.notes ? `Notes: ${order.shippingAddress.notes}` : null,
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines,
        parse_mode: 'Markdown',
      }),
    }).catch(() => {}) // don't fail order if Telegram is down
  }

  // TODO Phase 1: save to database
  // await prisma.order.create({ data: order })

  return NextResponse.json({ success: true, orderNumber: order.orderNumber })
}
