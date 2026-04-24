import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cart'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'
import { CompareBar } from '@/app/(shop)/compare/page'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-page flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CompareBar />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
