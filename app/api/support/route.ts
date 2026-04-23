import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID

  if (botToken && chatId) {
    const message = [
      `📬 *New Support Request*`,
      ``,
      `👤 *From*`,
      `Name: ${data.name}`,
      data.phone ? `Phone: ${data.phone}` : null,
      `Email: ${data.email}`,
      ``,
      `📋 *Topic:* ${data.category}`,
      ``,
      `💬 *Message*`,
      data.message,
    ].filter(Boolean).join('\n')

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
