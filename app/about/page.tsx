import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { MeetTheOwnerSection } from '@/components/customer/MeetTheOwnerSection'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Heart, Sparkles, Flame, Users, Clock, MapPin, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Our Studio — Your Pottery Barn',
  description: 'Learn about Your Pottery Barn, our story, our artisan instructors, and our community pottery & craft studio.',
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        {/* Hero Section with About Craft Background Image */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-warm-white overflow-hidden flex items-center justify-center">
          {/* Background About Craft Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/images/about/about-section-hero.webp"
              alt="Creative craft and painting session at Your Pottery Barn"
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric overlay to blend with brand clay palette and ensure pristine text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-clay/95 via-clay/80 to-clay/70" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-warm-white/15 backdrop-blur-md border border-warm-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="text-warm-white text-xs font-semibold uppercase tracking-widest">
                Our Story &amp; Passion
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white drop-shadow-md">
              A creative haven for makers of every age
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
              Your Pottery Barn was born from a simple belief: working with your hands, shaping earth and clay, and sharing creative time with friends is one of life&apos;s purest joys.
            </p>
          </div>
        </section>

        {/* Studio Highlights */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-warm-white rounded-2xl shadow-pottery p-8 border border-parchment/60 card-hover">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-5 text-2xl">
                🏺
              </div>
              <h3 className="font-playfair font-semibold text-xl text-clay mb-3">All Levels Welcome</h3>
              <p className="text-clay-light text-sm leading-relaxed">
                Whether you&apos;ve never touched a lump of clay in your life or you&apos;re refining your wheel-throwing technique, our patient tutors guide you step by step.
              </p>
            </div>

            <div className="bg-warm-white rounded-2xl shadow-pottery p-8 border border-parchment/60 card-hover">
              <div className="w-12 h-12 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-5 text-2xl">
                🌿
              </div>
              <h3 className="font-playfair font-semibold text-xl text-clay mb-3">Eco-Friendly & Safe</h3>
              <p className="text-clay-light text-sm leading-relaxed">
                We exclusively use non-toxic, food-safe glazes and sustainably sourced clays. All finished functional tableware is dishwasher and food safe once fired.
              </p>
            </div>

            <div className="bg-warm-white rounded-2xl shadow-pottery p-8 border border-parchment/60 card-hover">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-5 text-2xl">
                🔥
              </div>
              <h3 className="font-playfair font-semibold text-xl text-clay mb-3">Professional Kilns</h3>
              <p className="text-clay-light text-sm leading-relaxed">
                Two top-of-the-line electric kilns fire your creations to high temperatures for durability. Pieces are typically ready for collection within 7 to 14 days.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Owner / Founder Section */}
        <MeetTheOwnerSection />

        {/* Story Section */}
        <section className="bg-warm-white py-16 border-y border-parchment/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-terracotta font-semibold uppercase text-xs tracking-wider mb-2 block">
                  The Studio Journey
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-clay mb-6 leading-snug">
                  From a small garden shed to your favourite creative space
                </h2>
                <div className="space-y-4 text-clay-light text-base leading-relaxed">
                  <p>
                    We started in 2018 with just two kick-wheels and a deep love for pottery. Today, Your Pottery Barn is a buzzing community studio equipped with 10 electric wheels, spacious handbuilding tables, a dedicated glazing bar, and comfortable seating.
                  </p>
                  <p>
                    Beyond weekly workshops, we host private parties, hen dos, team building retreats, and family paint sessions. No rush, no pressure — just warm mugs of tea, friendly banter, and the rhythm of the wheel.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-clay font-medium text-sm">
                    <CheckCircle size={18} className="text-sage" /> Over 10,000 pots fired
                  </div>
                  <div className="flex items-center gap-2 text-clay font-medium text-sm">
                    <CheckCircle size={18} className="text-sage" /> 5-star Google reviews
                  </div>
                </div>
              </div>

              <div className="bg-cream rounded-3xl p-8 border border-parchment shadow-pottery space-y-6">
                <h3 className="font-playfair font-semibold text-2xl text-clay">Studio Information</h3>
                <div className="space-y-4 text-sm text-clay">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Visit Our Barn</p>
                      <p className="text-clay-light">14 Artisan Yard, Craft Lane, Potter&apos;s Mill, UK</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-terracotta shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Opening Hours</p>
                      <p className="text-clay-light">Tuesday – Saturday: 10:00 AM – 9:00 PM</p>
                      <p className="text-clay-light">Sunday: 11:00 AM – 5:00 PM (Mondays Closed)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-parchment/80 flex gap-4">
                  <Link href="/workshops" className="btn-primary flex-1 text-center py-3 text-sm">
                    Browse Workshops
                  </Link>
                  <Link href="/gift-cards" className="btn-secondary flex-1 text-center py-3 text-sm">
                    Gift Cards
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
