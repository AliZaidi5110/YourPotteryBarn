'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Play, Pause, Sparkles } from 'lucide-react'

export function HeroSection() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    const nextState = !isPlaying
    setIsPlaying(nextState)
    if (desktopVideoRef.current) {
      if (nextState) desktopVideoRef.current.play()
      else desktopVideoRef.current.pause()
    }
    if (mobileVideoRef.current) {
      if (nextState) mobileVideoRef.current.play()
      else mobileVideoRef.current.pause()
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#EDEDEE] min-h-[auto] sm:min-h-[580px] lg:min-h-[660px] flex items-center" aria-label="Hero">
      {/* ─── DESKTOP / TABLET (Laptop & Up): Full Background Video (User: "On laptop it is looking fine") ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden sm:block">
        <video
          ref={desktopVideoRef}
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

        {/* Desktop gradient overlay ensuring contrast for copy on any screen size */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white via-warm-white/95 sm:via-warm-white/90 sm:to-warm-white/20 to-warm-white/70 sm:w-[68%] lg:w-[58%] pointer-events-none" />
      </div>

      {/* Desktop Play/Pause Control in bottom-right */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 hidden sm:block">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-white/85 hover:bg-warm-white backdrop-blur-md border border-parchment/80 text-clay text-xs font-medium shadow-sm hover:shadow transition-all"
        >
          {isPlaying ? <Pause size={12} className="text-terracotta" /> : <Play size={12} className="text-terracotta fill-terracotta" />}
          <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
        </button>
      </div>

      {/* ─── HERO CONTENT ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-20 lg:py-24 w-full">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Studio Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 bg-terracotta/10 border border-terracotta/25 rounded-full px-3.5 py-1 sm:px-4 sm:py-1.5 mb-3.5 sm:mb-6 backdrop-blur-sm shadow-xs">
            <span className="text-terracotta text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
              ✨ Pottery &amp; Craft Studio &bull; Hartley, Kent
            </span>
          </div>

          {/* Slogan Headline */}
          <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-clay leading-[1.18] sm:leading-[1.15] mb-3.5 sm:mb-6 tracking-tight">
            Turning Clay Into <span className="text-terracotta italic">Amazing Art.</span>
          </h1>

          {/* ─── MOBILE ONLY: High-Definition 16:9 Video Showcase ─── */}
          <div className="sm:hidden my-4 relative rounded-2xl overflow-hidden border border-parchment/90 shadow-pottery bg-neutral-900 aspect-[16/10]">
            <video
              ref={mobileVideoRef}
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

            {/* Subtle glass badge over video */}
            <div className="absolute top-2.5 left-2.5 bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-medium flex items-center gap-1.5 border border-white/15 shadow-sm">
              <Sparkles size={11} className="text-amber-400" />
              <span>Studio Painting Session</span>
            </div>

            {/* Mobile video control */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/20 active:scale-95 transition-transform shadow-sm"
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-white" />}
            </button>
          </div>

          {/* Subheadline / Studio Intro */}
          <p className="text-clay-light text-sm sm:text-lg lg:text-xl mb-6 sm:mb-9 leading-relaxed font-normal max-w-lg">
            Book a pottery workshop, wheel-throwing session, or relaxing craft afternoon at Your Pottery Barn. All skill levels welcome &mdash; no experience needed, just a willingness to have fun.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/workshops"
              className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 text-center inline-flex items-center justify-center gap-2 shadow-pottery hover:shadow-pottery-lg transition-all"
            >
              Browse Workshops
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/gift-cards"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border border-clay/20 bg-white/90 hover:bg-white text-clay font-semibold text-sm sm:text-base transition-all shadow-xs hover:shadow"
            >
              🎁 Buy a Gift Card
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-7 sm:mt-10 pt-5 sm:pt-6 border-t border-clay/10 flex flex-wrap items-center gap-3 sm:gap-6 text-clay-light text-xs sm:text-sm">
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
