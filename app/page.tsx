import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { HeroSection } from '@/components/customer/HeroSection'
import { AboutSection } from '@/components/customer/AboutSection'
import { WhyChooseUsSection } from '@/components/customer/WhyChooseUsSection'
import { CelebrationsSection } from '@/components/customer/CelebrationsSection'
import { GallerySection } from '@/components/customer/GallerySection'
import { TestimonialsSection } from '@/components/customer/TestimonialsSection'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Pottery Barn — Turning Clay Into Amazing Art',
  description: 'Book a pottery workshop, wheel throwing class, or creative clay session at Your Pottery Barn in Hartley, Kent. Celebrations, parties, and studio gallery.',
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <WhyChooseUsSection />
        <CelebrationsSection />
        <GallerySection limit={8} showViewAll={true} />
        <TestimonialsSection />

        {/* Dedicated Workshops Callout Banner */}
        <section className="py-16 sm:py-20 bg-cream border-t border-parchment/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-terracotta font-semibold text-xs uppercase tracking-widest block mb-3">
              Ready to get creative?
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-clay mb-4">
              Explore Our Pottery Workshops &amp; Classes
            </h2>
            <p className="text-clay-light text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              From beginner-friendly Pick &amp; Paint and hands-on wheel throwing to handcrafted charcuterie boards and seasonal creations &mdash; find your perfect session on our workshops page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/workshops"
                className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-2 shadow-pottery hover:shadow-pottery-lg"
              >
                View All Workshops &amp; Book
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/gift-cards"
                className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                🎁 Buy a Gift Card
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
