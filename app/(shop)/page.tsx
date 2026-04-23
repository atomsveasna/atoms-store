import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

// ── Section: Hero ─────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Accent orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 tracking-wide">Now available — Smart Switch 1G</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Smart devices
            <br />
            <span className="text-cyan-400">built to last.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mb-10">
            Professional IoT components, smart home devices, and DIY kits.
            Local-first. Technically transparent. Built for makers, installers, and homeowners.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors duration-150"
            >
              Browse products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-white/70 hover:text-white font-medium text-sm rounded-xl transition-all duration-150"
            >
              Read the docs
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.06]">
          {[
            { value: 'Local-first', label: 'Works without internet' },
            { value: 'Open API',    label: 'REST + MQTT built-in' },
            { value: '10A relay',   label: 'Rated for real loads' },
            { value: '2 min',       label: 'Setup time' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#080d1a] px-6 py-5">
              <p className="font-display text-lg font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Featured products ────────────────────────────────
function FeaturedProducts({ products }: { products: Awaited<ReturnType<typeof getFeaturedProducts>> }) {

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Products</p>
            <h2 className="font-display text-3xl font-bold text-white">Featured devices</h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block border border-white/[0.08] hover:border-cyan-400/30 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl overflow-hidden transition-all duration-200"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative">
                <div className="w-20 h-20 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/60">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                {product.isNew && (
                  <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">
                    New
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-1.5">{product.category}</p>
                <h3 className="font-display font-semibold text-white text-base mb-1 group-hover:text-cyan-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-white/40 mb-4 line-clamp-2">{product.tagline}</p>

                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-white text-lg">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-cyan-400/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    In stock
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming soon placeholder card */}
          <div className="border border-white/[0.05] border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[280px]">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-sm text-white/30">More products coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Why Atoms ────────────────────────────────────────
function WhyAtoms() {
  const pillars = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Local-first',
      body: 'Every device works on your local network without cloud dependency. Your home stays online even when the internet goes down.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      title: 'Open API',
      body: 'REST and MQTT built in. Integrate with Home Assistant, Node-RED, or your own system. No locked ecosystem.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
      title: 'Technically transparent',
      body: 'Full datasheets, wiring diagrams, API docs, and firmware release notes. No black boxes.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      title: 'Documentation first',
      body: 'Every product ships with a full docs set — quick start, install guide, specs, troubleshooting, and downloadable PDFs.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        </svg>
      ),
      title: 'For professionals',
      body: 'Designed for installers and integrators who need reliable hardware, clear specs, and predictable behaviour under load.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: 'DIY & maker friendly',
      body: 'Compatible with ESPHome and Tasmota. Flash your own firmware. Explore, hack, and build on top.',
    },
  ]

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 max-w-xl">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Why Atoms</p>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Built different, on purpose.
          </h2>
          <p className="text-white/40 text-base leading-relaxed">
            Most smart devices are designed to lock you in. Atoms is designed to set you free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-400/15 transition-colors">
                {p.icon}
              </div>
              <h3 className="font-display font-semibold text-white text-base mb-2">{p.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Docs highlight ───────────────────────────────────
function DocsHighlight() {
  const links = [
    { label: 'Quick start guide',       href: '/docs/atoms-switch-1g/quick-start',    time: '2 min read' },
    { label: 'Installation guide',      href: '/docs/atoms-switch-1g/installation',   time: '5 min read' },
    { label: 'REST API reference',      href: '/docs/atoms-switch-1g/api',            time: 'Reference' },
    { label: 'Firmware update guide',   href: '/docs/atoms-switch-1g/firmware',       time: '3 min read' },
    { label: 'Troubleshooting',         href: '/docs/atoms-switch-1g/troubleshooting', time: 'Reference' },
  ]

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Documentation</p>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Docs that actually help you build.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Every product has a full documentation set — from unboxing to API endpoints.
              No PDF behind a form. No registration required.
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-cyan-400/30 hover:text-cyan-400 text-white/70 text-sm font-medium rounded-xl transition-all duration-150"
            >
              Browse all docs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">{link.label}</span>
                </div>
                <span className="text-xs text-white/25">{link.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Trust signals ────────────────────────────────────
function TrustSignals() {
  const signals = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: '1-year warranty',
      body: 'Every Atoms device is covered by a full 12-month hardware warranty.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: 'Fast Phnom Penh delivery',
      body: 'Same-day or next-day delivery across Phnom Penh. Provincial shipping available.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
      title: 'Real support',
      body: 'Talk to a real person. Pre-sales questions, install help, or warranty claims — we respond.',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      title: 'Firmware updated regularly',
      body: 'OTA updates via the web UI. Release notes published for every firmware version.',
    },
  ]

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((s) => (
            <div key={s.title} className="flex gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/50 mt-0.5">
                {s.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{s.title}</p>
                <p className="text-sm text-white/35 leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Ecosystem teaser ─────────────────────────────────
function EcosystemTeaser() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-10 sm:p-16 relative overflow-hidden">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.04] rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,229,255,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs text-cyan-400 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Coming in Phase 2
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              The Atoms ecosystem.<br />
              <span className="text-cyan-400">One dashboard for all your devices.</span>
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Device onboarding, firmware updates, live status, and local/cloud control —
              all from a single interface at app.atomsiot.com.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/50">Device dashboard</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/50">OTA firmware portal</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/50">Serial registration</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/50">Warranty tracking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: CTA ──────────────────────────────────────────────
function CTA() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl font-bold text-white mb-4">
          Ready to build something?
        </h2>
        <p className="text-white/40 text-lg mb-10">
          Start with the Smart Switch 1G — or browse the full catalog.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/products/atoms-smart-switch-1g"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors duration-150"
          >
            View Smart Switch 1G
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-medium text-sm rounded-xl transition-all duration-150"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default async function HomePage() {
  const featured = await getFeaturedProducts()
  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <WhyAtoms />
      <DocsHighlight />
      <TrustSignals />
      <EcosystemTeaser />
      <CTA />
    </>
  )
}
