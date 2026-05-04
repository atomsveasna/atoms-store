export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const orderNumber = searchParams.order ?? 'ATM-XXXXXX'

  return (
    <div className="min-h-screen bg-[#080d1a] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mb-8">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Order received!</h1>
      <p className="text-white/50 text-lg mb-2">Thank you for your purchase.</p>
      <p className="text-white/30 text-sm mb-8">
        We'll verify your payment and contact you to confirm delivery.
      </p>

      {/* Order number */}
      <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] mb-10">
        <span className="text-sm text-white/40">Order number</span>
        <span className="font-mono font-bold text-cyan-400">{orderNumber}</span>
      </div>

      {/* What happens next */}
      <div className="max-w-md w-full space-y-3 mb-12 text-left">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4 text-center">What happens next</p>
        {[
          { step: '1', text: 'We verify your ABA transfer (usually within 1–2 hours)' },
          { step: '2', text: 'You receive a confirmation message via phone or email' },
          { step: '3', text: 'Your order is packed and dispatched for delivery' },
          { step: '4', text: 'Delivery to Phnom Penh — same or next day' },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[11px] font-semibold text-cyan-400 flex-shrink-0 mt-0.5">
              {step}
            </span>
            <p className="text-sm text-white/50 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <p className="text-sm text-white/30 mb-8">
        Questions? Contact us at{' '}
        <a href="mailto:hello@atomsiot.com" className="text-cyan-400 hover:underline">
          hello@atomsiot.com
        </a>
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/shop" className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
          Continue shopping
        </Link>
        <Link href="/" className="px-6 py-3 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm rounded-xl transition-all">
          Back to home
        </Link>
      </div>
    </div>
  )
}
