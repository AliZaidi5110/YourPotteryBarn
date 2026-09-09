import Link from 'next/link'
import { Sparkles, Users, Crown, Gift, Phone, Check } from 'lucide-react'

export function CelebrationsSection() {
  return (
    <section id="celebrations" className="relative py-20 lg:py-24 overflow-hidden bg-[#FAFAF8]" aria-label="Celebrations & Private Parties">
      {/* Authentic Birthday Decor Backdrop - Perfectly proportioned, never squeezed */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Left Party Decor: Party hat, grid mat, pastel lollipops at natural proportions */}
        <div className="absolute -left-4 sm:left-0 top-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-[460px] max-w-[40vw] opacity-90 transition-opacity">
          <img
            src="/images/celebrations/party-decor-left.png"
            alt="Birthday party hat and lollipops decor"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* Right Party Decor: Pink honeycomb paper ball, confetti, marshmallow, candles at natural proportions */}
        <div className="absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-[460px] max-w-[40vw] opacity-90 transition-opacity">
          <img
            src="/images/celebrations/party-decor-right.png"
            alt="Birthday party honeycomb and confetti decor"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* Soft radial glow to ensure cards and typography remain 100% readable */}
        <div className="absolute inset-0 bg-radial from-transparent via-white/40 to-[#FAFAF8]/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-terracotta/15 border border-terracotta/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-terracotta" />
            <span className="text-terracotta text-xs font-semibold uppercase tracking-widest">
              Celebrate The Creative Way
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-clay mb-4">
            Birthday Parties &amp; Celebrations
          </h2>
          <p className="text-clay-light text-base sm:text-lg leading-relaxed">
            From kids&apos; birthdays and milestones to hen parties and family gatherings &mdash; make memories you can keep forever. All items are professionally glazed, kiln-fired, and ready in 1 week.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          
          {/* Gold Package */}
          <div className="bg-warm-white rounded-3xl p-8 sm:p-10 border border-parchment shadow-pottery hover:shadow-pottery-lg transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1.5">
                  <Gift size={13} /> Gold Package
                </span>
                <span className="text-2xl font-bold font-playfair text-clay">
                  £25 <span className="text-sm font-normal text-clay-light">/ person</span>
                </span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-clay mb-2">
                The Classic Party
              </h3>
              <p className="text-clay-light text-sm mb-6 leading-relaxed">
                Ideal for 10 &ndash; 30 guests. A relaxed, joyful 2-hour pottery painting session with personalised invitations and refreshments.
              </p>

              <ul className="space-y-3 text-sm text-clay mb-8">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>2-hour dedicated session</strong> for 10 to 30 attendees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>£25 ceramic item</strong> included for each guest to paint</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Personalised invitations</strong> sent ahead of time</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Dedicated group table</strong> reserved for your party</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Unlimited squash, tea &amp; coffee</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                  <span>Snack option: Cupcake, popcorn &amp; drink included when painting up to £20 item</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-parchment">
              <Link
                href="/celebrations"
                className="w-full btn-secondary text-sm py-3.5 text-center block"
              >
                View Details &amp; Enquire
              </Link>
            </div>
          </div>

          {/* Platinum Package */}
          <div className="bg-clay text-warm-white rounded-3xl p-8 sm:p-10 shadow-pottery-xl flex flex-col justify-between relative overflow-hidden border-2 border-terracotta">
            <div className="absolute top-0 right-0 bg-terracotta text-warm-white px-4 py-1 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
              Exclusive Studio
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-terracotta/40 text-warm-white flex items-center gap-1.5">
                  <Crown size={13} /> Platinum Package
                </span>
                <span className="text-2xl font-bold font-playfair text-warm-white">
                  £25 <span className="text-sm font-normal text-cream/70">/ person</span>
                </span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-warm-white mb-2">
                Private Studio Hire
              </h3>
              <p className="text-cream/80 text-sm mb-6 leading-relaxed">
                For 16 &ndash; 30 guests. Get <strong>100% exclusive use</strong> of our entire pottery barn for your private celebration.
              </p>

              <ul className="space-y-3 text-sm text-cream/90 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span><strong>Exclusive studio hire</strong> &mdash; the entire barn is yours</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span><strong>2-hour private session</strong> for 16 to 30 attendees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span><strong>£25 ceramic item</strong> to paint for each attendee</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span><strong>Personalised Invitations</strong> for all your attendees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span><strong>Unlimited squash, tea &amp; coffee</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                  <span>Party snack pack option: Cupcake, popcorn &amp; drink</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-clay-light/40">
              <Link
                href="/celebrations"
                className="w-full btn-primary text-sm py-3.5 text-center block"
              >
                Book Exclusive Hire
              </Link>
            </div>
          </div>

        </div>

        {/* Party Atmosphere & Celebration Showcase */}
        <div className="bg-warm-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-parchment shadow-pottery max-w-5xl mx-auto mb-12 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Balloon Arch Photo */}
            <div className="md:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden shadow-pottery border-2 border-parchment/60 aspect-[3/4] max-w-xs mx-auto">
                <img
                  src="/images/celebrations/party-balloon-arch.jpg"
                  alt="Birthday celebration party styling at Your Pottery Barn"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-warm-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-clay shadow-sm flex items-center gap-1.5">
                  <Sparkles size={12} className="text-terracotta" />
                  <span>Party Styling &amp; Decor</span>
                </div>
              </div>
            </div>

            {/* Description & Highlights */}
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
                <Gift size={13} /> The Complete Celebration Experience
              </div>
              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-clay mb-3">
                Unforgettable Parties &amp; Celebrations
              </h3>
              <p className="text-clay-light text-sm sm:text-base leading-relaxed mb-6">
                Every birthday and private celebration includes dedicated party styling and reserved tables. Relax with friends and family, share snacks and cake, and create custom ceramic pieces you can keep forever!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 text-sm text-clay">
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Dedicated Party Tables</strong> reserved for your group</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Personalised Invitations</strong> sent ahead of time</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Bring Birthday Cake &amp; Treats</strong> (free squash/tea)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                  <span><strong>Kiln Fired &amp; Ready in 1 Week</strong> to cherish forever</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/celebrations"
                  className="btn-primary text-sm py-3 px-6 shadow-pottery"
                >
                  Explore Party Packages &amp; Dates
                </Link>
                <a
                  href="tel:+447809208786"
                  className="btn-secondary text-sm py-3 px-5 flex items-center gap-2"
                >
                  <Phone size={14} /> Call 07809 208786
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bespoke / Custom Hire Callout */}
        <div className="bg-warm-white rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto border border-parchment flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 text-xl">
              📞
            </div>
            <div>
              <h4 className="font-playfair text-lg font-bold text-clay">
                Have a smaller group or bespoke requirements?
              </h4>
              <p className="text-clay-light text-xs sm:text-sm">
                Call us at <a href="tel:+447809208786" className="font-semibold text-terracotta hover:underline">+44 7809 208786</a> to discuss hen dos, team building, or custom party times.
              </p>
            </div>
          </div>
          <a
            href="tel:+447809208786"
            className="btn-secondary text-xs sm:text-sm py-3 px-6 shrink-0 flex items-center gap-2"
          >
            <Phone size={15} /> Call the Studio
          </a>
        </div>

      </div>
    </section>
  )
}
