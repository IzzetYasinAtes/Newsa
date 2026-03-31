import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Providers } from '@/components/Providers'
import { AdZone } from '@/components/ads/AdZone'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Newsa - Haber Platformu',
    template: '%s | Newsa',
  },
  description: 'Turkiye ve bolge odakli modern dijital haber platformu',
  openGraph: {
    title: 'Newsa - Haber Platformu',
    description: 'Turkiye ve bolge odakli modern dijital haber platformu',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Newsa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsa - Haber Platformu',
    description: 'Turkiye ve bolge odakli modern dijital haber platformu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <Header />
          <div className="mx-auto max-w-7xl px-4 py-2">
            <AdZone zone="header-banner" className="mb-2" />
          </div>
          <div className="min-h-[calc(100vh-3.5rem)]">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
