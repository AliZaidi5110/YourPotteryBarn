'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#EDEDEE] min-h-[580px] lg:min-h-[660px] flex items-center" aria-label="Hero">
      {/* Background Video featuring family pottery painting session */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero/hero-banner.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/videos/Pottery_studio_and_family_painting_202609091816.mp4" type="video/mp4" />
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Responsive gradient overlay ensuring contrast for copy on any screen size */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white via-warm-white/95 sm:via-warm-white/90 sm:to-warm-white/20 to-warm-white/70 sm:w-[68%] lg:w-[58%] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-warm-white/70 to-transparent sm:hidden pointer-events-none" />
      </div>

      {/* Video Play/Pause Control in bottom-right */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-white/80 hover:bg-warm-white backdrop-blur-md border border-parchment/80 text-clay text-xs font-medium shadow-sm hover:shadow transition-all"
        >
          {isPlaying ? <Pause size={12} className="text-terracotta" /> : <Play size={12} className="text-terracotta fill-terracotta" />}
          <span className="hidden sm:inline">{isPlaying ? 'Pause Video' : 'Play Video'}</span>
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Studio Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/25 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm shadow-sm">
            <span className="text-terracotta text-xs font-semibold uppercase tracking-widest">
              ✨ Pottery &amp; Craft Studio &bull; Hartley, Kent
            </span>
          </div>

          {/* Slogan Headline */}
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-clay leading-[1.15] mb-6 tracking-tight">
            Turning Clay Into <span className="text-terracotta italic">Amazing Art.</span>
          </h1>

          {/* Subheadline / Studio Intro */}
          <p className="text-clay-light text-base sm:text-lg lg:text-xl mb-9 leading-relaxed font-normal max-w-lg">
            Book a pottery workshop, wheel-throwing session, or relaxing craft afternoon at Your Pottery Barn. All skill levels welcome &mdash; no experience needed, just a willingness to have fun.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/workshops"
              className="btn-primary text-base px-8 py-4 text-center inline-flex items-center justify-center gap-2 shadow-pottery hover:shadow-pottery-lg transition-all"
            >
              Browse Workshops
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/gift-cards"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-clay/20 bg-white/90 hover:bg-white text-clay font-semibold text-base transition-all shadow-sm hover:shadow"
            >
              🎁 Buy a Gift Card
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-10 pt-6 border-t border-clay/10 flex flex-wrap items-center gap-4 sm:gap-6 text-clay-light text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-sm">★★★★★</span>
              <span className="text-clay font-semibold">5.0 studio rating</span>
            </div>
            <div className="w-px h-4 bg-clay/20 hidden sm:block" />
            <span>500+ happy makers</span>
            <div className="w-px h-4 bg-clay/20 hidden sm:block" />
            <span>All clay, tools &amp; firings included</span>
          </div>

        </div>
      </div>
    </section>
  )
}
