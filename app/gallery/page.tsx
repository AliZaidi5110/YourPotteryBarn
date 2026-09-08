import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { GallerySection } from '@/components/customer/GallerySection'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio Gallery — Your Pottery Barn | Hartley, Kent',
  description: 'Explore photos of our pottery painting sessions, wheel throwing workshops, birthday parties, hen celebrations, and beautiful fired ceramic pieces.',
}

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        {/* Gallery Hero Banner */}
        <section className="bg-clay py-16 px-4 sm:px-6 lg:px-8 text-center text-warm-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-terracotta blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full bg-sage blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-terracotta/25 border border-terracotta/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-terracotta-light text-xs font-semibold uppercase tracking-widest">
                📸 Authentic Studio Life
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white">
              Studio Photo Gallery
            </h1>
            <p className="text-cream/80 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Real moments from our pottery barn in Hartley. Browse through guest creations, parties, messy wheel throwing, and colorful ceramic painting.
            </p>
          </div>
        </section>

        {/* Gallery Display (shows all 14 photos without limit) */}
        <div className="py-8">
          <GallerySection limit={0} showViewAll={false} />
        </div>

        {/* Bottom CTA */}
        <section className="py-16 bg-warm-white border-t border-parchment/80">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-playfair text-3xl font-bold text-clay mb-4">
              Inspired by what you see?
            </h2>
            <p className="text-clay-light mb-8 max-w-xl mx-auto">
              Join us for a relaxing pottery session, celebrate your birthday, or gather friends for a crafty evening.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/workshops" className="btn-primary text-sm px-8 py-3.5">
                Browse Workshops &amp; Book
              </Link>
              <Link href="/celebrations" className="btn-secondary text-sm px-8 py-3.5">
                Plan a Celebration
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
