import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060b17] text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-cyan-400 flex items-center justify-center">
              <span className="text-[#080d1a] font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-white text-[15px]">Atoms</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Atoms. atomsiot.com</p>
        </div>
      </div>
    </footer>
  )
}
