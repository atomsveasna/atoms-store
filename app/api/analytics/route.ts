import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, type AnalyticsEvent } from '@/lib/data/analytics'

export async function POST(req: NextRequest) {
  const { event, path, referrer, metadata } = await req.json()
  if (!event) return NextResponse.json({ ok: false })

  await trackEvent(event as AnalyticsEvent, { path, referrer, metadata })
  return NextResponse.json({ ok: true })
}
