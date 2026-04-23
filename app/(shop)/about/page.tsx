import Link from 'next/link'

const VALUES = [
  {
    title: 'Local-first',
    body: 'Every device we build works on your local network without depending on any cloud service. Your home stays smart even when the internet goes down.',
  },
  {
    title: 'Technically transparent',
    body: 'We publish full datasheets, wiring diagrams, API docs, and firmware release notes for every product. No black boxes. No locked ecosystems.',
  },
  {
    title: 'Built to last',
    body: 'We spec components for real loads, real temperatures, and real installations — not just lab conditions. Every product is rated for professional use.',
  },
  {
    title: 'Open by design',
    body: 'Our devices work with Home Assistant, ESPHome, Tasmota, and your own REST API. We build on open standards because your home should belong to you.',
  },
  {
    title: 'Support that matters',
    body: 'We respond to every message. Pre-sales questions, install help, firmware issues, warranty claims — real support from the people who built the product.',
  },
  {
    title: 'Engineered in Cambodia',
    body: 'Atoms is designed and built in Phnom Penh. We understand the local infrastructure, power standards, and installation environment our products live in.',
  },
]

const TIMELINE = [
  { year: '2023', event: 'Atoms founded in Phnom Penh. First prototype of the Smart Switch 1G begins development.' },
  { year: '2024', event: 'First production run of the Smart Switch 1G. Beta testing with local installers and smart home enthusiasts.' },
  { year: '2025', event: 'atomsiot.com launches. Smart Switch 1G available for purchase. Docs center and API released.' },
  { year: '2026', event: 'Atoms store goes live. Expanding product line. Device dashboard in development.' },
]

export const metadata = {
  title: 'About',
  description: 'Atoms is an engineering-driven IoT company building professional smart home devices in Phnom Penh, Cambodia.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-24">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">About Atoms</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6 max-w-3xl">
            Built from the<br />
            <span className="text-cyan-400">ground up.</span>
          </h1>
          <p className="text-lg text-white/50 leading-relaxed max-w-2xl">
            Atoms is an engineering-driven IoT company based in Phnom Penh, Cambodia.
            We design and build professional smart home devices that are reliable, open, and technically transparent.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Our mission</p>
            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              Make professional IoT accessible to everyone — without compromising on quality.
            </h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Most smart home devices force you to choose between convenience and control.
              Cloud-dependent apps that stop working when servers go down. Locked ecosystems
              that don't talk to anything else. Cheap hardware that fails under real loads.
            </p>
            <p className="text-white/50 leading-relaxed">
              Atoms exists to fix that. We build devices that work locally, integrate with
              open platforms, and are documented well enough that any installer or maker
              can understand exactly what they're installing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '2023', label: 'Founded' },
              { value: '10A', label: 'Relay rating' },
              { value: 'Open API', label: 'REST + MQTT' },
              { value: 'Local-first', label: 'No cloud required' },
            ].map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">What we believe</p>
          <h2 className="text-3xl font-bold text-white mb-12">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] transition-all">
                <h3 className="font-semibold text-white text-base mb-3">{v.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">History</p>
          <h2 className="text-3xl font-bold text-white mb-12">How we got here</h2>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"/>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.06] my-2"/>
                  )}
                </div>
                <div className="pb-10">
                  <p className="font-mono text-sm font-bold text-cyan-400 mb-1">{item.year}</p>
                  <p className="text-sm text-white/55 leading-relaxed">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Team</p>
          <h2 className="text-3xl font-bold text-white mb-4">The people behind Atoms</h2>
          <p className="text-white/40 mb-12 max-w-xl">
            A small team of engineers and makers based in Phnom Penh, Cambodia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Placeholder team cards — replace with real team info */}
            {[
              { name: 'Coming soon', role: 'Team profiles will be added here', initials: '?' },
            ].map((member) => (
              <div key={member.name} className="flex items-center gap-4 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 font-bold text-lg">{member.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{member.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to work with us?</h2>
          <p className="text-white/40 mb-8">
            We're always interested in talking to installers, distributors, and developers
            who share our values.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-[#080d1a] font-semibold text-sm rounded-xl transition-colors"
            >
              Get in touch
            </Link>
            <Link
              href="/shop"
              className="px-7 py-3.5 border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm rounded-xl transition-all"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
