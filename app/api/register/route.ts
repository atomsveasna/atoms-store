import { NextRequest, NextResponse } from 'next/server'
import { registerDevice } from '@/lib/data/registrations'

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!data.customerName || !data.customerEmail || !data.productSlug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const result = await registerDevice(data)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // Telegram notification
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID
  if (botToken && chatId) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: [
          `📱 *Device Registered*`,
          ``,
          `Product: ${data.productSlug}`,
          `Customer: ${data.customerName}`,
          `Email: ${data.customerEmail}`,
          data.serialNumber    ? `Serial: ${data.serialNumber}` : null,
          data.purchaseOrderId ? `Order: ${data.purchaseOrderId}` : null,
          data.purchaseDate    ? `Purchase date: ${data.purchaseDate}` : null,
        ].filter(Boolean).join('\n'),
        parse_mode: 'Markdown',
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
