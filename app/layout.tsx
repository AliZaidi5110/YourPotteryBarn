import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Your Pottery Barn',
    default: 'Your Pottery Barn — Pottery & Craft Studio',
  },
  description: 'Book a pottery workshop, clay session, or creative class at Your Pottery Barn. Pick & Paint, wheel throwing, wreath making, and more.',
  keywords: ['pottery', 'craft studio', 'workshops', 'pick and paint', 'pottery throwing', 'clay sessions'],
  openGraph: {
    siteName: 'Your Pottery Barn',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter bg-cream text-clay antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
