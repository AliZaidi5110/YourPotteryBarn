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
        {/* Gallery Hero Banner with Studio Photo Gallery Image */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-warm-white overflow-hidden flex items-center justify-center">
          {/* Background Studio Photo Gallery Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/images/gallery/studio-photo-gallery-hero.jpg"
              alt="Hands creating ceramic pottery on wheel at Your Pottery Barn"
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric overlay to blend with brand clay palette and ensure pristine text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-clay/95 via-clay/80 to-clay/70" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-warm-white/15 backdrop-blur-md border border-warm-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="text-warm-white text-xs font-semibold uppercase tracking-widest">
                📸 Authentic Studio Life
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white drop-shadow-md">
              Studio Photo Gallery
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
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
