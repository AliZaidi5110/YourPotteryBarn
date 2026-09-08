'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { Check, Sparkles, Crown, Gift, Phone, Mail, Clock, Calendar, HelpCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CelebrationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Birthday Party',
    packageChoice: 'Platinum (£25pp)',
    guests: '16',
    date: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        
        {/* Hero Section with Celebration Sparklers Background */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center text-warm-white overflow-hidden flex items-center justify-center">
          {/* Background Celebration Sparklers Image */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              src="/images/celebrations/celebrations-hero-bg.jpg"
              alt="Celebrations and private parties at Your Pottery Barn"
              className="w-full h-full object-cover object-center"
            />
            {/* Atmospheric overlay to blend with brand clay palette and ensure pristine text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-clay/95 via-clay/80 to-clay/70" />
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-warm-white/15 backdrop-blur-md border border-warm-white/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-warm-white text-xs font-semibold uppercase tracking-widest">
                Special Occasions &bull; Hartley, Kent
              </span>
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-warm-white drop-shadow-md">
              Celebrations &amp; Parties
            </h1>
            <p className="text-cream/90 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-sm">
              Celebrate your birthday, hen night, or special gathering the creative way! Make custom pottery keepsakes with friends and family in our fully accessible studio barn.
            </p>
          </div>
        </section>

        {/* Packages Cards with Birthday Decor Background */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAFAF8]">
          {/* Authentic Birthday Decor Backdrop - Perfectly proportioned, never squeezed */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            {/* Left Party Decor: Party hat, grid mat, pastel lollipops */}
            <div className="absolute -left-4 sm:left-0 top-12 sm:top-20 w-64 sm:w-80 md:w-96 lg:w-[460px] max-w-[40vw] opacity-90">
              <img
                src="/images/celebrations/party-decor-left.png"
                alt="Birthday party hat and lollipops decor"
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Right Party Decor: Pink honeycomb paper ball, confetti, marshmallow, candles */}
            <div className="absolute -right-4 sm:right-0 top-12 sm:top-20 w-64 sm:w-80 md:w-96 lg:w-[460px] max-w-[40vw] opacity-90">
              <img
                src="/images/celebrations/party-decor-right.png"
                alt="Birthday party honeycomb and confetti decor"
                className="w-full h-auto object-contain drop-shadow-sm"
              />
            </div>

            {/* Soft background glow */}
            <div className="absolute inset-0 bg-radial from-transparent via-white/40 to-[#FAFAF8]/90" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Gold Package */}
            <div className="bg-warm-white rounded-3xl p-8 sm:p-10 border border-parchment shadow-pottery flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 flex items-center gap-1.5">
                    <Gift size={13} /> Gold Package
                  </span>
                  <span className="text-3xl font-bold font-playfair text-clay">
                    £25 <span className="text-sm font-normal text-clay-light">/ person</span>
                  </span>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-clay mb-3">
                  The Classic Party
                </h2>
                <p className="text-clay-light text-sm mb-6 leading-relaxed">
                  A wonderful 2-hour session designed for 10 to 30 guests. Choose your ceramics, paint in your style, and enjoy complimentary drinks and selfie moments.
                </p>

                <ul className="space-y-3.5 text-sm text-clay mb-8">
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>10 &ndash; 30 Attendees</strong> with dedicated table reservation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>£25 ceramic piece included</strong> for every painter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Personalised Invitations</strong> sent ahead of time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Selfie Backdrop</strong> for memorable party photos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Unlimited squash, tea &amp; coffee</strong> during session</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta shrink-0 mt-0.5" />
                    <span>Optional snack pack: cupcake, popcorn &amp; drink when attendees paint up to £20 value</span>
                  </li>
                </ul>
              </div>

              <a
                href="#enquiry-form"
                onClick={() => setFormData({ ...formData, packageChoice: 'Gold (£25pp)' })}
                className="btn-secondary w-full text-center py-3.5"
              >
                Enquire for Gold Package
              </a>
            </div>

            {/* Platinum Package */}
            <div className="bg-clay text-warm-white rounded-3xl p-8 sm:p-10 shadow-pottery-xl flex flex-col justify-between border-2 border-terracotta relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-terracotta text-warm-white px-4 py-1 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
                Exclusive Studio
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-terracotta/40 text-warm-white flex items-center gap-1.5">
                    <Crown size={13} /> Platinum Package
                  </span>
                  <span className="text-3xl font-bold font-playfair text-warm-white">
                    £25 <span className="text-sm font-normal text-cream/70">/ person</span>
                  </span>
                </div>
                <h2 className="font-playfair text-2xl font-bold text-warm-white mb-3">
                  Exclusive Studio Hire
                </h2>
                <p className="text-cream/80 text-sm mb-6 leading-relaxed">
                  Enjoy <strong>exclusive use of the entire studio</strong> for your group of 16 to 30 people. Perfect for unforgettable milestone birthdays and private hen parties.
                </p>

                <ul className="space-y-3.5 text-sm text-cream/90 mb-8">
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span><strong>100% Exclusive Studio Hire</strong> &mdash; the entire barn is yours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span><strong>16 &ndash; 30 Attendees</strong> (2 hours duration)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span><strong>£25 ceramic piece included</strong> for every guest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span><strong>Personalised Invitations</strong> &amp; studio selfie backdrop</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span><strong>Unlimited squash, tea &amp; coffee</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-terracotta-light shrink-0 mt-0.5" />
                    <span>Party snack pack option: cupcake, popcorn &amp; drink</span>
                  </li>
                </ul>
              </div>

              <a
                href="#enquiry-form"
                onClick={() => setFormData({ ...formData, packageChoice: 'Platinum (£25pp)' })}
                className="btn-primary w-full text-center py-3.5"
              >
                Book Exclusive Studio
              </a>
            </div>

          </div>

          {/* Dedicated Selfie Backdrop & Party Styling Feature Card */}
          <div className="bg-warm-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-parchment shadow-pottery max-w-5xl mx-auto mb-16 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Balloon Arch Photo */}
              <div className="md:col-span-5 relative group">
                <div className="relative rounded-2xl overflow-hidden shadow-pottery border-2 border-parchment/60 aspect-[3/4] max-w-xs mx-auto">
                  <img
                    src="/images/celebrations/party-balloon-arch.jpg"
                    alt="Celebration balloon arch and selfie photo backdrop at Your Pottery Barn"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-warm-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-clay shadow-sm flex items-center gap-1.5">
                    <Sparkles size={12} className="text-terracotta" />
                    <span>Selfie Backdrop Included</span>
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="md:col-span-7">
                <div className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Gift size={13} /> Included In Every Celebration
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-clay mb-3">
                  Festive Balloon Arch &amp; Selfie Photo Backdrop
                </h3>
                <p className="text-clay-light text-sm sm:text-base leading-relaxed mb-6">
                  Every party booking includes access to our stylish balloon arch photo backdrop! Take unforgettable group photos of your celebration before or after your pottery session.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 text-sm text-clay">
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Balloon Arch &amp; Party Sign</strong> setup ready for photos</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Personalised Invitations</strong> for all your attendees</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Bring Your Birthday Cake</strong> (tea &amp; squash on us)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                    <span><strong>Glazed &amp; Kiln-Fired</strong> ready to collect in 1 week</span>
                  </div>
                </div>

                <a
                  href="#enquiry-form"
                  className="btn-primary text-sm py-3 px-6 shadow-pottery inline-block"
                >
                  Book Your Party &amp; Save Date
                </a>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div id="enquiry-form" className="bg-warm-white rounded-3xl p-8 sm:p-12 border border-parchment shadow-pottery max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-terracotta font-semibold text-xs uppercase tracking-widest block mb-2">
                Save Your Date
              </span>
              <h3 className="font-playfair text-3xl font-bold text-clay">
                Party &amp; Celebration Enquiry
              </h3>
              <p className="text-clay-light text-sm mt-2">
                Fill in the details below or call us directly on{' '}
                <a href="tel:+447809208786" className="text-terracotta font-semibold hover:underline">
                  +44 7809 208786
                </a>
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h4 className="font-playfair text-2xl font-bold text-clay">Enquiry Received!</h4>
                <p className="text-clay-light text-sm max-w-md mx-auto">
                  Thank you! Our studio team will review your date ({formData.date || 'preferred date'}) and contact you shortly via email ({formData.email}) or phone ({formData.phone}).
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary text-sm px-6 py-2.5 mt-4"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 07809 208786"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Occasion / Event Type</label>
                    <select
                      value={formData.eventType}
                      onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                      className="input-field text-sm"
                    >
                      <option>Children&apos;s Birthday Party</option>
                      <option>Adult Birthday Party</option>
                      <option>Hen Party</option>
                      <option>Baby Shower</option>
                      <option>Family Gathering / Anniversary</option>
                      <option>Corporate Wellbeing / Team Building</option>
                      <option>Other Special Occasion</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Package</label>
                    <select
                      value={formData.packageChoice}
                      onChange={e => setFormData({ ...formData, packageChoice: e.target.value })}
                      className="input-field text-sm"
                    >
                      <option>Platinum (£25pp - Exclusive Hire)</option>
                      <option>Gold (£25pp - Standard Party)</option>
                      <option>Bespoke Group Booking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Estimated Guests</label>
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={formData.guests}
                      onChange={e => setFormData({ ...formData, guests: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-clay mb-1 uppercase tracking-wider">Special Requests / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the celebrant, preferred time slots, dietary preferences, or any questions..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-base py-4 shadow-pottery hover:shadow-pottery-lg"
                >
                  Submit Party Enquiry
                </button>
              </form>
            )}
          </div>

          {/* Party FAQs */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="font-playfair text-2xl font-bold text-clay text-center mb-8">
              Celebration FAQs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-warm-white p-6 rounded-2xl border border-parchment">
                <h4 className="font-semibold text-clay mb-2">When will our painted items be ready?</h4>
                <p className="text-clay-light text-xs sm:text-sm leading-relaxed">
                  All painted pieces are professionally glazed and kiln-fired on site. They are ready for collection approximately 1 week after your party.
                </p>
              </div>

              <div className="bg-warm-white p-6 rounded-2xl border border-parchment">
                <h4 className="font-semibold text-clay mb-2">Can we bring our own birthday cake?</h4>
                <p className="text-clay-light text-xs sm:text-sm leading-relaxed">
                  Yes! You are welcome to bring a birthday cake or party snacks. We provide unlimited squash, tea, and coffee for all attendees.
                </p>
              </div>

              <div className="bg-warm-white p-6 rounded-2xl border border-parchment">
                <h4 className="font-semibold text-clay mb-2">Can guests choose higher-priced items?</h4>
                <p className="text-clay-light text-xs sm:text-sm leading-relaxed">
                  Each guest has £25 value included. If the host allows it, attendees can choose higher-priced items and simply pay the difference on the day.
                </p>
              </div>

              <div className="bg-warm-white p-6 rounded-2xl border border-parchment">
                <h4 className="font-semibold text-clay mb-2">Do you accommodate smaller private groups?</h4>
                <p className="text-clay-light text-xs sm:text-sm leading-relaxed">
                  If you have fewer than 16 attendees but require exclusive use, give us a call at 07809 208786 &mdash; we love creating bespoke packages.
                </p>
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
