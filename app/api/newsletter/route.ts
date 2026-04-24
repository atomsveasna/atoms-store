import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, source } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
    method: 'POST',
    headers: {
      apikey:         serviceKey,
      Authorization:  `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer:         'return=minimal',
    },
    body: JSON.stringify({ email, source: source ?? 'homepage' }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    // Unique violation = already subscribed
    if (err.code === '23505') {
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 400 })
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
        text: `📧 New newsletter subscriber: ${email}`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
