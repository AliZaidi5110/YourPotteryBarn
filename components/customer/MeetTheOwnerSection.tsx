'use client'

import Link from 'next/link'
import { Heart, Coffee, Sparkles, Flame, ArrowRight, Quote } from 'lucide-react'

export function MeetTheOwnerSection() {
  return (
    <section 
      id="meet-the-owner" 
      className="py-20 lg:py-28 bg-gradient-to-b from-warm-white via-[#FAF5EE] to-warm-white border-y border-parchment/60 relative overflow-hidden"
      aria-label="Meet the Owner"
    >
      {/* Delicate background decorative watermarks / pottery rings */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-terracotta/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sage/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Warm Owner Portrait & Branded Badges */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* Background Decorative Framing */}
            <div className="relative w-full max-w-lg">
              {/* Subtle back accent frame */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-terracotta/20 via-parchment/40 to-sage/20 rounded-[2.25rem] -rotate-1 transform transition-transform duration-500 group-hover:rotate-0" />
              
              {/* Main Image Card */}
              <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-pottery-lg border-2 border-parchment/90 aspect-[16/11] sm:aspect-[4/3] group">
                <img
                  src="/images/about/studio-owner.png"
                  alt="Owner and founder of Your Pottery Barn smiling warmly in her Hartley pottery studio"
                  className="w-full h-full object-cover object-[52%_18%] transform group-hover:scale-102 transition-transform duration-700 ease-out"
                />

                {/* Subtle warm rim glow at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-clay/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* Top-Right Floating Pill */}
                <div className="absolute top-3.5 right-3.5 bg-warm-white/95 backdrop-blur-md border border-parchment/90 rounded-full px-3 py-1 shadow-pottery-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sage animate-ping" />
                  <span className="text-[11px] font-semibold text-clay tracking-wide uppercase">
                    Hartley Studio
                  </span>
                </div>

                {/* Top-Left Branded Studio Badge */}
                <div className="absolute top-3.5 left-3.5 bg-warm-white/95 backdrop-blur-md border border-parchment/90 rounded-full px-3 py-1 shadow-pottery-sm flex items-center gap-1.5 text-terracotta">
                  <Sparkles size={12} className="fill-terracotta" />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-clay">
                    Founder &amp; Host
                  </span>
                </div>
              </div>

              {/* Bottom Info Ribbon */}
              <div className="mt-4 bg-warm-white/95 rounded-2xl p-4 shadow-pottery border border-parchment/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
                    <Heart size={18} className="fill-terracotta/20" />
                  </div>
                  <div>
                    <p className="font-playfair font-bold text-clay text-base sm:text-lg leading-tight">
                      Your Pottery Barn
                    </p>
                    <p className="text-xs text-clay-light">Family-run pottery &amp; craft haven in Hartley, Kent</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage/10 text-sage text-xs font-semibold shrink-0">
                  <span>☕ Free Tea &amp; Cuppas</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Pleasant Lines, Philosophy & Highlights */}
          <div className="lg:col-span-7 flex flex-col items-start lg:pl-4">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-terracotta text-xs sm:text-sm font-semibold tracking-wide mb-4">
              <Sparkles size={14} className="text-terracotta" />
              <span>A Warm Welcome From Our Founder</span>
            </div>

            {/* Heading */}
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-clay leading-[1.18] mb-6">
              &ldquo;Creativity is meant to be felt with your hands and shared with open arms.&rdquo;
            </h2>

            {/* Pleasant Lines / Storytelling */}
            <div className="space-y-4 text-clay-light text-base sm:text-[1.05rem] leading-relaxed mb-8">
              <p>
                When I opened the barn doors here in <strong className="text-clay font-semibold">Hartley</strong>, my wish was simple: to create a friendly, light-filled haven where people could slow down, step away from screens, and uncover the pure, tactile joy of working with clay.
              </p>
              <p>
                Whether you&apos;re visiting for a mindful solo morning, giggling through a children&apos;s birthday party, celebrating a hen do with friends, or trying the potter&apos;s wheel for the very first time &mdash; you will always be greeted with a warm smile, gentle guidance, and zero pressure.
              </p>
              <div className="relative border-l-2 border-terracotta/70 pl-4 py-2 bg-terracotta/[0.04] rounded-r-2xl mt-4">
                <Quote size={20} className="text-terracotta/40 absolute -top-2.5 -left-2.5 bg-warm-white rounded-full p-0.5" />
                <p className="text-clay font-medium italic text-sm sm:text-base leading-relaxed">
                  &ldquo;You don&apos;t need to be an artist to start. Just bring an open heart, slip on an apron, and let&apos;s turn a humble lump of clay into a memory you can hold.&rdquo;
                </p>
              </div>
            </div>

            {/* 3 Pleasant Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8 pt-2">
              
              <div className="bg-warm-white/90 rounded-2xl p-4 border border-parchment/80 shadow-pottery-sm hover:shadow-pottery transition-shadow duration-200">
                <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-3">
                  <Coffee size={18} />
                </div>
                <h4 className="font-playfair font-semibold text-clay text-sm mb-1">Warm Hospitality</h4>
                <p className="text-xs text-clay-light leading-relaxed">
                  Complimentary fresh tea, coffee, and biscuits to make you feel right at home.
                </p>
              </div>

              <div className="bg-warm-white/90 rounded-2xl p-4 border border-parchment/80 shadow-pottery-sm hover:shadow-pottery transition-shadow duration-200">
                <div className="w-9 h-9 rounded-xl bg-sage/15 text-sage flex items-center justify-center mb-3">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-playfair font-semibold text-clay text-sm mb-1">Beginners Celebrated</h4>
                <p className="text-xs text-clay-light leading-relaxed">
                  Patient, step-by-step encouragement. Mistakes are just part of the fun!
                </p>
              </div>

              <div className="bg-warm-white/90 rounded-2xl p-4 border border-parchment/80 shadow-pottery-sm hover:shadow-pottery transition-shadow duration-200">
                <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center mb-3">
                  <Flame size={18} />
                </div>
                <h4 className="font-playfair font-semibold text-clay text-sm mb-1">Kiln-Fired with Care</h4>
                <p className="text-xs text-clay-light leading-relaxed">
                  Every bowl, mug, and figurine is lovingly glazed and fired in our Hartley kilns.
                </p>
              </div>

            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/workshops"
                className="btn-primary text-sm sm:text-base px-7 py-3.5 inline-flex items-center justify-center gap-2 shadow-pottery hover:shadow-pottery-lg"
              >
                <span>Book a Session with Us</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="btn-secondary text-sm sm:text-base px-7 py-3.5 inline-flex items-center justify-center gap-2 text-center"
              >
                <span>Read Our Full Story</span>
              </Link>
            </div>

            {/* Social Connect Strip */}
            <div className="mt-8 pt-6 border-t border-parchment/80 w-full flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-clay-light font-medium">
                <Sparkles size={14} className="text-terracotta shrink-0" />
                <span>Follow our studio stories &amp; fresh kiln reveals:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://www.instagram.com/your.potterybarn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-terracotta/10 border border-parchment text-clay hover:text-terracotta text-xs font-semibold shadow-pottery-sm hover:shadow-pottery transition-all duration-200"
                  aria-label="Instagram @your.potterybarn"
                  title="Visit @your.potterybarn on Instagram"
                >
                  <svg className="w-3.5 h-3.5 text-terracotta" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=100090796065925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-terracotta/10 border border-parchment text-clay hover:text-terracotta text-xs font-semibold shadow-pottery-sm hover:shadow-pottery transition-all duration-200"
                  aria-label="Facebook Your Pottery Barn"
                  title="Visit Your Pottery Barn on Facebook"
                >
                  <svg className="w-3.5 h-3.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                <a
                  href="http://google.com/maps/place/Your+Pottery+Barn+HARTLEY/@51.3651727,0.3189965,17z/data=!3m1!4b1!4m6!3m5!1s0x47d8b5189ab051bf:0xfa84a8198d12bb9!8m2!3d51.3651727!4d0.3189965!16s%2Fg%2F11kpcxdhn0?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-terracotta/10 border border-parchment text-clay hover:text-terracotta text-xs font-semibold shadow-pottery-sm hover:shadow-pottery transition-all duration-200"
                  aria-label="Google Maps Location"
                  title="Find us on Google Maps (Hartley, Kent)"
                >
                  <span className="text-terracotta">📍</span>
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
