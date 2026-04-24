import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/account'

  if (code) {
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    // Exchange code for session
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: {
        apikey:         supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth_code: code }),
    })

    if (res.ok) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_error`)
}
