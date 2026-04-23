import Link from 'next/link'

export const metadata = {
  title: 'Shipping Policy',
  description: 'Atoms shipping policy — delivery times, areas, and costs.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Policy</p>
          <h1 className="text-4xl font-bold text-white mb-2">Shipping Policy</h1>
          <p className="text-white/30 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-12">

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Delivery areas</h2>
            <div className="space-y-3">
              {[
                { area: 'Phnom Penh', time: 'Same-day or next-day', note: 'After payment confirmation' },
                { area: 'Provincial (Cambodia)', time: '2–5 business days', note: 'Via courier service' },
                { area: 'International', time: 'Not available yet', note: 'Coming in a future phase' },
              ].map((row) => (
                <div key={row.area} className="flex items-start justify-between p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-medium text-white">{row.area}</p>
                    <p className="text-xs text-white/30 mt-0.5">{row.note}</p>
                  </div>
                  <span className="text-sm text-cyan-400 font-medium text-right flex-shrink-0 ml-4">{row.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Shipping costs</h2>
            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
              <p>Delivery within Phnom Penh is <strong className="text-white">free</strong> for all orders.</p>
              <p>Provincial shipping costs depend on destination and order size. The shipping fee will be communicated to you after your order is placed and before dispatch.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Order processing</h2>
            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
              <p>Orders are processed after payment is confirmed. For ABA bank transfers, this typically happens within 1–2 hours during business hours (Monday–Saturday, 8am–6pm).</p>
              <p>You will receive a confirmation via phone or Telegram once your payment is verified and your order is being prepared.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Tracking</h2>
            <p className="text-sm text-white/60 leading-relaxed">
              For Phnom Penh deliveries, our team will contact you directly to coordinate delivery time. For provincial orders, we will provide courier tracking information where available.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Questions</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              If you have any questions about your delivery, contact us directly.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
              Contact us
            </Link>
          </section>

          <div className="pt-8 border-t border-white/[0.06] flex flex-wrap gap-4">
            <Link href="/support/warranty" className="text-sm text-white/40 hover:text-white transition-colors">Warranty policy →</Link>
            <Link href="/support/returns" className="text-sm text-white/40 hover:text-white transition-colors">Return policy →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
