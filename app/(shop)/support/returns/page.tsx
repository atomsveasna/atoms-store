import Link from 'next/link'

export const metadata = {
  title: 'Return Policy',
  description: 'Atoms return and refund policy — 7-day returns on unopened products.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Policy</p>
          <h1 className="text-4xl font-bold text-white mb-2">Return Policy</h1>
          <p className="text-white/30 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Summary */}
          <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <p className="text-sm text-white/60 leading-relaxed">
              We accept returns within <strong className="text-white">7 days of delivery</strong> for unused, unopened products in their original packaging. Products that have been installed or used are not eligible for a change-of-mind return but may be covered under our warranty policy if there is a defect.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Eligible for return</h2>
            <div className="space-y-2">
              {[
                'Unopened product in original packaging within 7 days of delivery',
                'Wrong item received — we will cover return shipping and send the correct item',
                'Item arrived damaged in transit — contact us with photos within 48 hours',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Not eligible for return</h2>
            <div className="space-y-2">
              {[
                'Products that have been installed or used',
                'Products returned more than 7 days after delivery',
                'Products without original packaging',
                'Products damaged by the customer after delivery',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400/70 flex-shrink-0 mt-0.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">How to return</h2>
            <div className="space-y-3">
              {[
                { step: '1', desc: 'Contact us within 7 days of delivery with your order number and reason for return.' },
                { step: '2', desc: 'We will confirm eligibility and provide return instructions.' },
                { step: '3', desc: 'Return the product in its original packaging to the address we provide.' },
                { step: '4', desc: 'Once we receive and inspect the returned item, we will process your refund within 3–5 business days.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/40 flex-shrink-0 mt-0.5">{item.step}</span>
                  <p className="text-sm text-white/60 leading-relaxed pt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Refunds</h2>
            <div className="space-y-3 text-sm text-white/60 leading-relaxed">
              <p>Refunds are issued to the same payment method used for the original purchase. For ABA bank transfers, we will refund to the account that made the payment.</p>
              <p>Shipping costs are non-refundable unless the return is due to our error (wrong item sent, damaged in transit).</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Defective products</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              If your product has a manufacturing defect, it may be covered under our 12-month warranty. Please see our warranty policy for details.
            </p>
            <Link href="/support/warranty" className="text-sm text-cyan-400 hover:underline">
              View warranty policy →
            </Link>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Start a return</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Contact us to start a return or ask any questions about our policy.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
              Contact us
            </Link>
          </section>

          <div className="pt-8 border-t border-white/[0.06] flex flex-wrap gap-4">
            <Link href="/support/shipping" className="text-sm text-white/40 hover:text-white transition-colors">Shipping policy →</Link>
            <Link href="/support/warranty" className="text-sm text-white/40 hover:text-white transition-colors">Warranty policy →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
