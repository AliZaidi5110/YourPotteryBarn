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

          </div>

        </div>
      </div>
    </section>
  )
}
