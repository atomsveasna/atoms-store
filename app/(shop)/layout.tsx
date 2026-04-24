import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart'
import { AuthProvider } from '@/lib/auth'
import { CompareBar } from '@/app/(shop)/compare/page'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#080d1a] flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
      <CompareBar />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
