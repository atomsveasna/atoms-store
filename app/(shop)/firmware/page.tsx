import Link from 'next/link'
import { getAllProducts } from '@/lib/data/products'

export const metadata = {
  title: 'Firmware Downloads',
  description: 'Download the latest firmware for your Atoms devices.',
}

export default async function FirmwarePage() {
  const products = await getAllProducts()
  const withFirmware = products.filter((p) => p.firmwareVersion || (p.revisionHistory && p.revisionHistory.length > 0))

  return (
    <div className="min-h-screen bg-[#080d1a]">

      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Downloads</p>
          <h1 className="text-4xl font-bold text-white mb-4">Firmware</h1>
          <p className="text-white/40 text-lg max-w-xl">
            Latest firmware releases for all Atoms devices. Updates via OTA through the device web UI — no cable required.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* How to update */}
          <div className="p-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03]">
            <h2 className="text-base font-semibold text-white mb-3">How to update firmware</h2>
            <div className="space-y-2">
              {[
                'Open the device web UI by navigating to its IP address in your browser',
                'Go to Settings → Firmware Update',
                'Click Check for update or upload the .bin file manually',
                'Wait for the update to complete — the device will reboot automatically',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="w-5 h-5 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-[11px] font-bold text-cyan-400 flex-shrink-0 mt-0.5">{i+1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Products with firmware */}
          {withFirmware.map((product) => (
            <div key={product.slug}>
              {/* Product header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400/70">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{product.name}</h2>
                  <p className="text-xs text-white/30 font-mono">{product.sku}</p>
                </div>
                {product.firmwareVersion && (
                  <span className="ml-auto font-mono text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg">
                    Latest: v{product.firmwareVersion}
                  </span>
                )}
              </div>

              {/* Firmware downloads */}
              {product.downloads.filter((d) => d.type === 'firmware').map((dl) => (
                <a
                  key={dl.filename}
                  href={dl.url}
                  download
                  className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.07] hover:border-cyan-400/20 bg-white/[0.02] hover:bg-white/[0.04] group transition-all mb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 group-hover:text-cyan-400/70 transition-colors flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors">{dl.label}</p>
                      <p className="text-xs text-white/25 font-mono mt-0.5">{dl.filename}{dl.size ? ` · ${dl.size}` : ''}</p>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-cyan-400/60 transition-colors flex-shrink-0">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              ))}

              {/* Revision history */}
              {product.revisionHistory && product.revisionHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Release history</h3>
                  <div className="space-y-0">
                    {product.revisionHistory.map((rev, i) => (
                      <div key={rev.version} className="flex gap-5">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-cyan-400/10 border border-cyan-400/30' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
                            <span className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-cyan-400' : 'bg-white/20'}`}/>
                          </div>
                          {i < product.revisionHistory!.length - 1 && (
                            <div className="w-px flex-1 bg-white/[0.06] my-1.5"/>
                          )}
                        </div>
                        <div className="pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`font-mono text-sm font-bold ${i === 0 ? 'text-cyan-400' : 'text-white/50'}`}>
                              v{rev.version}
                            </span>
                            {i === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">Latest</span>
                            )}
                            <span className="text-xs text-white/25">{rev.date}</span>
                          </div>
                          <p className="text-sm text-white/50 leading-relaxed">{rev.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <Link
                  href={`/docs/${product.docSlug}/firmware`}
                  className="text-sm text-white/30 hover:text-cyan-400 transition-colors"
                >
                  View firmware update guide →
                </Link>
              </div>
            </div>
          ))}

          {withFirmware.length === 0 && (
            <p className="text-white/30 text-sm text-center py-12">No firmware available yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
