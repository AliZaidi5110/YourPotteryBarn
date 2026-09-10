import Link from 'next/link'

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-[#8c7355] font-semibold text-base sm:text-lg mb-3 tracking-wide">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-neutral-900 leading-[1.15] mb-6 font-playfair">
              Creating Works of Art Through Clay
            </h2>
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed mb-4">
              At Your Pottery Barn, we believe everyone has a little bit of artist in them &mdash; they just need the right space, the right clay, and a cup of tea to bring it out. Tucked away in Hartley, Kent, our studio is a place to slow down, get your hands messy, and create something you can actually take home and be proud of.
            </p>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              Whether you&apos;re painting your first mug, throwing your first bowl on the wheel, or celebrating a birthday with friends, we&apos;re here to guide you every step of the way &mdash; no experience needed, just a willingness to have fun. From pottery painting and clay workshops to parties, corporate team days, and even the odd ukulele session, our studio is built around one simple idea: creativity is better shared.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[#8c7355] hover:bg-[#786145] text-white font-medium text-base shadow-sm hover:shadow-md transition-all duration-200"
              >
                Read More
              </Link>
              <a
                href="#meet-the-owner"
                className="inline-flex items-center gap-2 text-clay hover:text-terracotta font-semibold text-sm transition-colors py-2 px-3 rounded-lg hover:bg-parchment/40"
              >
                <span>Meet Our Founder</span>
                <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3-Image Collage */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              
              {/* Top-Left: Stacked Ceramic Bowls (Rounded Top-Left Corner) */}
              <div className="relative overflow-hidden rounded-tl-[2.5rem] aspect-square bg-parchment/40 shadow-sm group">
                <img
                  src="/images/about/bowl-stack.jpg"
                  alt="Stack of handcrafted ceramic and wooden bowls"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Top-Right: Artisan Potter at Wheel (Rounded Top-Right Corner) */}
              <div className="relative overflow-hidden rounded-tr-[2.5rem] aspect-square bg-parchment/40 shadow-sm group">
                <img
                  src="/images/about/artisan-potter.jpg"
                  alt="Potter artisan working with clay in studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Bottom: Dramatic Hands on Wheel B&W (Rounded Bottom-Left & Bottom-Right Corners) */}
              <div className="col-span-2 relative overflow-hidden rounded-bl-[2.5rem] rounded-br-[2.5rem] aspect-[16/9] bg-parchment/40 shadow-sm group">
                <img
                  src="/images/about/clay-hands-bw.jpg"
                  alt="Close-up hands shaping clay vessel on wheel in black and white"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
