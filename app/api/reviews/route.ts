import { NextRequest, NextResponse } from 'next/server'
import { submitReview, approveReview, deleteReview } from '@/lib/data/reviews'

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!data.productSlug || !data.authorName || !data.rating || !data.body) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (data.rating < 1 || data.rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
  }

  const result = await submitReview(data)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  // Notify via Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID
  if (botToken && chatId) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `⭐ New review for ${data.productSlug}\nFrom: ${data.authorName}\nRating: ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}\n"${data.body.slice(0, 100)}..."\n\nApprove at atomsiot.com/admin`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { id, action } = await req.json()
  if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })

  if (action === 'approve') {
    const ok = await approveReview(id)
    return NextResponse.json({ success: ok })
  }

  if (action === 'delete') {
    const ok = await deleteReview(id)
    return NextResponse.json({ success: ok })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
