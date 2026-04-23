import type { Metadata } from 'next'
import { DM_Sans, Syne, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Atoms Store — Smart Devices for the Modern Home',
    template: '%s | Atoms Store',
  },
  description:
    'Professional smart home devices built with technical transparency. Shop, learn, and get support for Atoms smart switches, sockets, and more.',
  keywords: ['smart home', 'smart switch', 'IoT', 'home automation', 'Atoms'],
  metadataBase: new URL('https://atoms.store'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atoms.store',
    siteName: 'Atoms Store',
    title: 'Atoms Store — Smart Devices for the Modern Home',
    description: 'Professional smart home devices built with technical transparency.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atoms Store',
    description: 'Professional smart home devices built with technical transparency.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-surface text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
