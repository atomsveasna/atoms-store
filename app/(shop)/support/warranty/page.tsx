import Link from 'next/link'

export const metadata = {
  title: 'Warranty Policy',
  description: 'Atoms 12-month hardware warranty — what is covered and how to make a claim.',
}

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Policy</p>
          <h1 className="text-4xl font-bold text-white mb-2">Warranty Policy</h1>
          <p className="text-white/30 text-sm">Last updated: April 2026</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Coverage summary */}
          <div className="p-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04]">
            <div className="flex items-center gap-3 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="font-semibold text-white">12-month hardware warranty</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Every Atoms device is covered by a 12-month hardware warranty from the date of purchase. This warranty covers manufacturing defects and hardware failures under normal use conditions.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">What is covered</h2>
            <div className="space-y-2">
              {[
                'Manufacturing defects in materials or workmanship',
                'Hardware component failures under normal operating conditions',
                'Relay failure within rated specifications (10A / 2200W resistive)',
                'Wi-Fi module failure not caused by physical damage',
                'PCB defects discovered within the warranty period',
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
            <h2 className="text-lg font-bold text-white mb-4">What is not covered</h2>
            <div className="space-y-2">
              {[
                'Physical damage from mishandling, dropping, or improper installation',
                'Damage caused by exceeding rated specifications (e.g. overloading the relay)',
                'Damage from power surges, lightning, or electrical faults in the installation',
                'Water damage or exposure to moisture beyond rated conditions',
                'Damage caused by modification or unauthorized firmware',
                'Normal wear and tear',
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
            <h2 className="text-lg font-bold text-white mb-4">How to make a warranty claim</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Contact us', desc: 'Reach out via the contact page or Telegram with your order number and a description of the issue.' },
                { step: '2', title: 'Provide evidence', desc: 'Send photos or video showing the defect or failure. This helps us assess the issue faster.' },
                { step: '3', title: 'Assessment', desc: 'We will review your claim within 2 business days and confirm whether it is covered under warranty.' },
                { step: '4', title: 'Resolution', desc: 'For valid claims, we will replace the defective unit or offer a repair. Return shipping for warranty claims within Phnom Penh is covered by Atoms.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <span className="w-7 h-7 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-4">Make a claim</h2>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Ready to submit a warranty claim? Contact us and we'll help you through the process.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors">
              Contact us
            </Link>
          </section>

          <div className="pt-8 border-t border-white/[0.06] flex flex-wrap gap-4">
            <Link href="/support/shipping" className="text-sm text-white/40 hover:text-white transition-colors">Shipping policy →</Link>
            <Link href="/support/returns" className="text-sm text-white/40 hover:text-white transition-colors">Return policy →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
