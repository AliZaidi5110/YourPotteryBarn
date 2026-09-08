'use client'

import { useEffect, useRef, useState } from 'react'

export function WhyChooseUsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-warm-white overflow-hidden"
      aria-label="Why Choose Us"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Rounded Container Banner */}
        <div className="relative rounded-[2.5rem] bg-[#2E2E2E] bg-gradient-to-br from-[#383838] via-[#2D2D2D] to-[#222222] shadow-2xl overflow-hidden border border-white/5">
          
          {/* Subtle concentric clay-wheel texture rings */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden" aria-hidden="true">
            <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full border-[30px] border-white/40" />
            <div className="absolute -top-16 -left-16 w-[550px] h-[550px] rounded-full border-[20px] border-white/30" />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full border-[15px] border-white/20" />
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[800px] h-[800px] rounded-full border-[40px] border-white/30" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-end min-h-[440px] lg:min-h-[480px]">
            
            {/* Left Column: Artisan Image with Entrance Animation from Left */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-start items-end pt-8 lg:pt-0 pl-0 lg:pl-6 z-10">
              <div
                className={`relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                  isVisible
                    ? 'translate-x-0 opacity-100 scale-100'
                    : '-translate-x-32 opacity-0 scale-95'
                }`}
              >
                <img
                  src="/images/why-us/artisan-sculpting.png"
                  alt="Artisan sculpting ceramic clay pinch bowl"
                  className="w-full h-auto object-contain select-none drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Text and Features Content */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 lg:pl-4 text-white z-10 flex flex-col justify-center">
              
              {/* Eyebrow */}
              <span className="text-white/90 font-semibold text-sm sm:text-base tracking-wide block mb-2">
                Why Choose Us?
              </span>

              {/* Title */}
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-white leading-[1.18] mb-4 tracking-tight">
                We Pour All The Beauty <br className="hidden sm:inline" />
                Into The Pottery
              </h2>

              {/* Subtitle / Paragraph */}
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-7 max-w-xl font-normal">
                Every piece that leaves our studio carries a little bit of care, craft, and creativity &mdash; whether it&apos;s shaped by your own hands or ours.
              </p>

              {/* 2-Column Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-1">
                
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>Hands-on guidance from friendly, experienced instructors</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>No experience necessary &mdash; beginners are always welcome</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>A warm, welcoming studio for all ages and abilities</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>High-quality clay, glazes, and materials in every session</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>Flexible bookings for individuals, groups, and private parties</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200 leading-snug">
                    <span className="text-white font-bold select-none text-base shrink-0 mt-0.5">✓</span>
                    <span>A relaxed, judgement-free space to create at your own pace</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
