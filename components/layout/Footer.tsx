import Link from 'next/link'
import NewsletterSignup from '@/components/ui/NewsletterSignup'

const LINKS = {
  Shop: [
    { label: 'All products',   href: '/shop' },
    { label: 'Smart switches', href: '/shop?category=switches' },
    { label: 'Smart sockets',  href: '/shop?category=sockets' },
    { label: 'DIY kits',       href: '/shop?category=bundles' },
    { label: 'Accessories',    href: '/shop?category=accessories' },
    { label: 'Bundles & kits', href: '/bundles' },
  ],
  Learn: [
    { label: 'Documentation',  href: '/docs' },
    { label: 'Tutorials',      href: '/learn' },
    { label: 'API reference',  href: '/docs' },
    { label: 'Firmware',       href: '/firmware' },
    { label: 'Search',         href: '/search' },
  ],
  Support: [
    { label: 'Help center',    href: '/support' },
    { label: 'Contact us',     href: '/contact' },
    { label: 'Warranty',       href: '/support/warranty' },
    { label: 'Shipping',       href: '/support/shipping' },
    { label: 'Returns',        href: '/support/returns' },
    { label: 'Register device', href: '/register' },
  ],
  Company: [
    { label: 'About Atoms',    href: '/about' },
    { label: 'For installers', href: '/contact' },
    { label: 'For developers',  href: '/docs' },
    { label: 'For installers', href: '/installers' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060b17] text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Newsletter */}
        <div className="mb-16 pb-16 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Stay updated</p>
              <h3 className="text-lg font-bold text-white mb-1">New products and firmware updates.</h3>
              <p className="text-sm text-white/40">No spam. Unsubscribe any time.</p>
            </div>
            <NewsletterSignup />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-cyan-400 flex items-center justify-center">
                <span className="text-[#080d1a] font-bold text-xs">A</span>
              </div>
              <span className="font-semibold text-white text-[15px]">Atoms</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">Professional IoT devices. Built from the ground up.</p>
            <a href="mailto:hello@atomsiot.com" className="text-xs hover:text-white transition-colors">hello@atomsiot.com</a>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{group}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">&copy; {new Date().getFullYear()} Atoms. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"/>
            <span className="text-xs">atomsiot.com</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
