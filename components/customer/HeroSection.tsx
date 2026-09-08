import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#EDEDEE] min-h-[560px] lg:min-h-[620px] flex items-center" aria-label="Hero">
      {/* Background Banner Image featuring user's ceramic tableware artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/hero-banner.jpg"
          alt="Turning Clay Into Amazing Art - Handcrafted pottery mugs and glazed bowls"
          className="w-full h-full object-cover object-right md:object-[right_center]"
        />
        {/* Responsive gradient overlay ensuring contrast for copy on any screen size */}
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white via-warm-white/95 sm:via-warm-white/90 sm:to-warm-white/15 to-warm-white/60 sm:w-[65%] lg:w-[58%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-white/80 via-transparent to-transparent sm:hidden" />
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
