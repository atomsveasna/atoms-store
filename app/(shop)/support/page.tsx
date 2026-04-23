'use client'

import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    category: 'Orders & Delivery',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our products, add to cart, and proceed to checkout. We accept ABA bank transfer. After payment, we confirm your order and arrange delivery.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Same-day or next-day delivery within Phnom Penh after payment confirmation. Provincial shipping takes 2–5 business days depending on location.',
      },
      {
        q: 'How do I confirm my ABA payment?',
        a: 'Make the transfer with your order number as the reference. We monitor incoming transfers and will confirm via phone or Telegram once matched.',
      },
      {
        q: 'Can I cancel or change my order?',
        a: 'Contact us as soon as possible via Telegram or phone. If the order has not been dispatched, we can cancel or modify it.',
      },
    ],
  },
  {
    category: 'Products & Compatibility',
    items: [
      {
        q: 'Does the Smart Switch 1G require a neutral wire?',
        a: 'Yes. The Atoms Smart Switch 1G requires a neutral (N) wire. Please check your wall box wiring before ordering.',
      },
      {
        q: 'What wall box does it fit?',
        a: 'It fits standard 86×86mm single-gang wall boxes with a minimum installation depth of 35mm — common in Cambodia, Thailand, and most of Southeast Asia.',
      },
      {
        q: 'Does it work with Home Assistant?',
        a: 'Yes. It integrates via REST API or MQTT natively. It is also compatible with ESPHome and Tasmota if you prefer alternative firmware.',
      },
      {
        q: 'Does it work without internet?',
        a: 'Yes. After initial Wi-Fi provisioning, all switching functions work locally. No cloud connection is required for normal operation.',
      },
      {
        q: 'Can I use the physical button if Wi-Fi is down?',
        a: 'Yes. The physical button always works regardless of network status.',
      },
    ],
  },
  {
    category: 'Setup & Firmware',
    items: [
      {
        q: 'How do I provision the device to Wi-Fi?',
        a: 'Power on the device — the LED pulses blue. Connect to the "Atoms-Setup-XXXXXX" hotspot, open 192.168.4.1 in your browser, enter your Wi-Fi credentials, and save. The device will reboot and join your network.',
      },
      {
        q: 'How do I update the firmware?',
        a: 'Open the device web UI by navigating to its IP address. Go to Settings → Firmware Update and use the OTA update function. No USB cable required.',
      },
      {
        q: 'How do I factory reset the device?',
        a: 'Press and hold the physical button for 10 seconds until the LED flashes red and blue alternately. Release — the device will reset and re-enter provisioning mode.',
      },
      {
        q: 'The LED is red after powering on — what does that mean?',
        a: 'A solid red LED indicates an overload or overcurrent condition. Check that the connected load does not exceed 10A / 2200W and that there is no short circuit on the load side.',
      },
    ],
  },
  {
    category: 'Warranty & Returns',
    items: [
      {
        q: 'What is covered by the warranty?',
        a: 'Every Atoms device is covered by a 12-month hardware warranty from the date of purchase. This covers manufacturing defects and hardware failures under normal use.',
      },
      {
        q: 'What is not covered?',
        a: 'Physical damage, incorrect installation, use beyond rated specifications (e.g. overloading the relay), and damage from power surges are not covered.',
      },
      {
        q: 'How do I make a warranty claim?',
        a: 'Contact us via the contact page or Telegram with your order number, a description of the issue, and photos or video if possible. We will assess and respond within 2 business days.',
      },
      {
        q: 'Can I return a product if I change my mind?',
        a: 'We accept returns within 7 days of delivery for unused, unopened products in original packaging. Contact us to arrange the return.',
      },
    ],
  },
]

const TROUBLESHOOTING = [
  {
    problem: 'Device won\'t connect to Wi-Fi',
    steps: [
      'Confirm you entered the correct Wi-Fi password during provisioning',
      'Check your router — the 2.4GHz band must be enabled (5GHz is not supported)',
      'Move the switch closer to the router temporarily',
      'Factory reset and re-provision (hold button 10 seconds)',
    ],
  },
  {
    problem: 'Cannot reach device web UI',
    steps: [
      'Check the device IP in your router\'s DHCP client list',
      'Try mDNS: http://atoms-XXXXXX.local',
      'Use a network scanner app (e.g. Fing) to find the IP',
      'Ensure your phone/laptop is on the same Wi-Fi network',
    ],
  },
  {
    problem: 'Physical button not responding',
    steps: [
      'Check wiring — the live input (L) must be connected correctly',
      'If locked via API, send POST /api/lock with locked: false',
      'Factory reset the device',
    ],
  },
  {
    problem: 'Red LED on startup',
    steps: [
      'Disconnect the load and cycle power',
      'Verify the load does not exceed 10A / 2200W',
      'Check for short circuits on the load side',
      'If the red LED persists with no load, contact support',
    ],
  },
]

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/[0.07] overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
          >
            <span className="text-sm font-medium text-white/80 pr-4">{item.q}</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}
            >
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-5 border-t border-white/[0.05]">
              <p className="text-sm text-white/50 leading-relaxed pt-4">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Support</p>
          <h1 className="text-4xl font-bold text-white mb-4">Help center</h1>
          <p className="text-white/40 text-lg max-w-xl">
            Find answers to common questions, troubleshooting guides, and how to reach us.
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
              title: 'Documentation',
              desc: 'Setup guides, API docs, firmware notes',
              href: '/docs',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
              title: 'Contact support',
              desc: 'Send us a message — we respond within 24h',
              href: '/contact',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
              title: 'Telegram',
              desc: 'Fastest response — @atomsiot',
              href: 'https://t.me/atomsiot',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 group-hover:text-cyan-400 transition-colors flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-0.5">{item.title}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">FAQ</p>
          <h2 className="text-3xl font-bold text-white mb-10">Frequently asked questions</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category tabs */}
            <div className="space-y-1">
              {FAQS.map((cat, i) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === i
                      ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* FAQ items */}
            <div className="lg:col-span-3">
              <FAQAccordion items={FAQS[activeCategory].items} />
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Troubleshooting</p>
          <h2 className="text-3xl font-bold text-white mb-10">Common issues</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TROUBLESHOOTING.map((item) => (
              <div key={item.problem} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <h3 className="font-semibold text-white text-sm mb-4">{item.problem}</h3>
                <ol className="space-y-2">
                  {item.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                      <span className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-white/30 flex-shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-white text-sm mb-1">Still not resolved?</p>
              <p className="text-sm text-white/40">Contact our support team and we'll help you directly.</p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors flex-shrink-0"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>

      {/* Policy links */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-6">Policies</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Shipping policy',  href: '/support/shipping' },
              { label: 'Warranty policy',  href: '/support/warranty' },
              { label: 'Return policy',    href: '/support/returns' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg border border-white/[0.07] text-sm text-white/40 hover:text-white hover:border-white/20 transition-all"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
