import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/installer_applications`, {
    method: 'POST',
    headers: {
      apikey:         serviceKey,
      Authorization:  `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer:         'return=minimal',
    },
    body: JSON.stringify({
      name:           data.name,
      company:        data.company,
      email:          data.email,
      phone:          data.phone,
      city:           data.city,
      experience:     data.experience,
      projects:       data.projects       ?? null,
      monthly_volume: data.monthlyVolume  ?? null,
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'Failed to submit' }, { status: 400 })

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
          `🔧 *New Installer Application*`,
          ``,
          `Name: ${data.name}`,
          `Company: ${data.company}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          `City: ${data.city}`,
          `Experience: ${data.experience}`,
          data.monthlyVolume ? `Monthly volume: ${data.monthlyVolume}` : null,
          data.projects      ? `\nProjects: ${data.projects}` : null,
        ].filter(Boolean).join('\n'),
        parse_mode: 'Markdown',
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
