'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Sparkles } from 'lucide-react'

interface Review {
  id: number
  name: string
  rating: number
  date: string
  badge?: string
  text: string
  serviceTag: string
}

const GOOGLE_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Esther L',
    rating: 5,
    date: '3 months ago',
    badge: 'Repeat Visitor',
    serviceTag: 'Birthday Parties & Painting',
    text: 'The most amazing & beautifully tranquil place. So lucky to have it nearby. We have been many times now & it never disappoints. Held 2 birthday parties here too which are also just perfect and so reasonably priced. The owner is incredibly warm and welcoming!',
  },
  {
    id: 2,
    name: 'Sydnie Fitzsimmons',
    rating: 5,
    date: '5 months ago',
    badge: 'Workshop Guest',
    serviceTag: 'Pottery Throwing Workshop',
    text: 'Four of us came this morning for the pottery throwing workshop. We had the best time! The studio is gorgeous, instructions were so clear and patient, and we made pieces we are actually proud of to take home!',
  },
  {
    id: 3,
    name: 'Isabelle Pierce',
    rating: 5,
    date: '4 months ago',
    badge: 'Ceramics Painter',
    serviceTag: 'Pick & Paint Session',
    text: 'Such a relaxing and wonderful experience! There are so many options for items to paint and quite reasonably priced too. We had cups of tea, took our time, and had the absolute best afternoon.',
  },
  {
    id: 4,
    name: 'Faheem Anwar',
    rating: 5,
    date: '1 month ago',
    badge: 'Local Guide',
    serviceTag: 'Studio Painting',
    text: 'Enjoyed the painting session immensely. Great range of quality pottery and vibrant glazes. Very helpful and welcoming staff. A tranquil escape tucked away in the Kent countryside.',
  },
  {
    id: 5,
    name: 'Ria Kenwood',
    rating: 5,
    date: '3 months ago',
    badge: 'Mother & Daughter Day',
    serviceTag: 'Pick & Paint',
    text: 'What a fabulous place. Me and my mum went there to do pick and paint and loved every single minute. Super relaxing and the time flies by. Can\'t wait to see them glazed and kiln-fired. We will definitely be returning!',
  },
  {
    id: 6,
    name: 'Taryn van Heerden',
    rating: 5,
    date: '1 month ago',
    badge: 'Studio Guest',
    serviceTag: 'Family Pottery Session',
    text: 'I am hard to please — and I am so glad I found Your Pottery Barn! Amazing service, beautifully set up for small groups, couples, and families. Truly a hidden gem in Hartley.',
  },
  {
    id: 7,
    name: 'Stephanie Spence',
    rating: 5,
    date: '11 months ago',
    badge: 'Local Guide',
    serviceTag: 'Pottery Painting',
    text: 'I\'ve been driving past this place for a few months now, so I thought I would try it, and I\'m so glad I did! I came here with my daughter, and we had the best time. We enjoyed every minute of it!',
  },
  {
    id: 8,
    name: 'Symone Pearce',
    rating: 5,
    date: '8 months ago',
    badge: 'Verified Guest',
    serviceTag: 'Creative Session',
    text: 'What a beautiful place! The location is stunning, light, bright and airy, and the selection of items to paint and the colour choice is fab. We were very well looked after ❤️',
  },
  {
    id: 9,
    name: 'Claire Dixson',
    rating: 5,
    date: '4 months ago',
    badge: 'Studio Guest',
    serviceTag: 'Glazing & Kiln Session',
    text: 'What a lovely experience! Such a nice venue and very welcoming too. Complimentary tea is a lovely bonus! Can\'t wait to pick up our glazed and kiln-fired creations!',
  },
  {
    id: 10,
    name: 'Chloe Hunt',
    rating: 5,
    date: '4 months ago',
    badge: 'Local Guide',
    serviceTag: 'Pottery Experience',
    text: 'The best pottery experience possible!! The facilities are great, the availability of all the products and paints is phenomenal, and the atmosphere is so warm and welcoming!',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const changeReview = useCallback((newIndex: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsTransitioning(false)
    }, 250)
  }, [])

  const nextReview = useCallback(() => {
    changeReview((currentIndex + 1) % GOOGLE_REVIEWS.length)
  }, [currentIndex, changeReview])

  const prevReview = useCallback(() => {
    changeReview((currentIndex - 1 + GOOGLE_REVIEWS.length) % GOOGLE_REVIEWS.length)
  }, [currentIndex, changeReview])

  // 5-second automatic review changer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      changeReview((currentIndex + 1) % GOOGLE_REVIEWS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, changeReview])

  const current = GOOGLE_REVIEWS[currentIndex]

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#FAFAF8] relative overflow-hidden" aria-label="Customer Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-4 py-1.5 mb-4">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-clay font-bold text-xs uppercase tracking-widest">
              5.0 Star Rated on Google
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-clay mb-4">
            Loved By Creative Minds Across Kent
          </h2>
          <p className="text-clay-light text-base sm:text-lg leading-relaxed">
            Real feedback from beginners, families, and party-goers who joined us at the barn. 
            All reviews verified via Google Business Profile.
          </p>
        </div>

        {/* Main Showcase: Image with Reviews in Top Right */}
        <div 
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-pottery-xl border border-parchment bg-warm-white"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Base Image Container (Handcrafted pottery cups on shelf) */}
          <div className="relative w-full min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]">
            <img
              src="/images/testimonials/pottery-cups-shelf.jpg"
              alt="Handcrafted ceramic cups and stoneware pottery on clean studio shelf at Your Pottery Barn"
              className="absolute inset-0 w-full h-full object-cover object-left-bottom select-none pointer-events-none"
            />
            {/* Subtle soft gradient wash across top-right to guarantee card contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/40 pointer-events-none" />

            {/* Studio Branding Badge on Bottom-Left */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 bg-warm-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-parchment/80 shadow-md hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-clay uppercase tracking-wider">Handmade With Care</p>
                <p className="text-[11px] text-clay-light">Hartley, Longfield • Kent DA3</p>
              </div>
            </div>

            {/* Floating Review Card - Positioned in the Top-Right of the Image */}
            <div className="relative z-20 sm:absolute sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-full sm:max-w-sm md:max-w-sm lg:max-w-[380px] p-3 sm:p-0">
              <div className="bg-warm-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-parchment shadow-pottery-xl transition-all duration-300">
                
                {/* Review Header: Google Badge & Service Tag */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-parchment/80">
                  <div className="flex items-center gap-1.5">
                    {/* Google 'G' Logo Badge */}
                    <div className="w-5 h-5 rounded-full bg-white shadow-xs border border-parchment flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" width="12" height="12" className="shrink-0">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-clay tracking-tight">Google Review</span>
                    <CheckCircle2 size={11} className="text-emerald-600 ml-0.5" />
                  </div>

                  <span className="text-[10px] font-semibold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full truncate max-w-[150px]">
                    {current.serviceTag}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 text-amber-400 mb-2.5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text Container with smooth fade transition */}
                <div className="relative min-h-[85px] sm:min-h-[95px] flex items-center mb-3.5">
                  <Quote size={20} className="absolute -top-1 -left-0.5 text-terracotta/20 pointer-events-none" />
                  <p 
                    className={`text-clay text-xs sm:text-[13px] leading-relaxed pl-4 transition-opacity duration-300 ${
                      isTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    &ldquo;{current.text}&rdquo;
                  </p>
                </div>

                {/* Author Info & Nav Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-parchment/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-clay text-warm-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
                      {current.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-playfair font-bold text-clay text-sm leading-tight">
                        {current.name}
                      </h4>
                      <p className="text-[10px] text-clay-light">
                        {current.badge} • {current.date}
                      </p>
                    </div>
                  </div>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevReview}
                      aria-label="Previous review"
                      className="w-7 h-7 rounded-full bg-cream hover:bg-parchment/80 text-clay flex items-center justify-center transition-colors shadow-xs"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={nextReview}
                      aria-label="Next review"
                      className="w-7 h-7 rounded-full bg-cream hover:bg-parchment/80 text-clay flex items-center justify-center transition-colors shadow-xs"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* 10 Pagination Dots (Clickable & Active Bar) */}
                <div className="flex items-center justify-center gap-1 mt-3 pt-2.5 border-t border-parchment/40">
                  {GOOGLE_REVIEWS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => changeReview(idx)}
                      aria-label={`Go to review ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-5 bg-terracotta'
                          : 'w-1.5 bg-parchment hover:bg-clay-light/50'
                      }`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Google Trust Bar */}
        <div className="mt-12 text-center">
          <p className="text-xs text-clay-light mb-3">
            Rated <strong>5.0 / 5.0</strong> based on 78 authentic customer reviews on Google
          </p>
          <a
            href="https://www.google.com/search?q=your+pottery+barn#lrd=0x47d8b5189ab051bf:0xfa84a8198d12bb9,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-terracotta hover:underline"
          >
            <span>Read all 78 Google reviews for Your Pottery Barn Hartley</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

      </div>
    </section>
  )
}
