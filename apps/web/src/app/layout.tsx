import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <div className="min-h-[calc(100vh-3.5rem)]">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
