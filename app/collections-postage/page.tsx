import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import Link from 'next/link'
import { Package, Clock, MapPin, Truck, HelpCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Collections & Postage — Your Pottery Barn',
  description: 'Information about collection times, kiln firing schedule, and UK postal delivery for your finished pottery creations.',
}

export default function CollectionsPostagePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <section className="bg-clay py-16 px-4 sm:px-6 lg:px-8 text-center text-warm-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-4 text-warm-white">
              Collections &amp; Postage
            </h1>
            <p className="text-cream/80 text-lg max-w-xl mx-auto">
              Everything you need to know about collecting your fired pottery or arranging delivery to your doorstep.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="bg-warm-white rounded-3xl p-8 border border-parchment shadow-pottery flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Clock size={28} />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-clay mb-2">Kiln Firing Turnaround</h2>
              <p className="text-clay-light text-sm leading-relaxed mb-3">
                Pottery painting pieces are clear-glazed and fired in our kiln up to 1000&deg;C. The drying, glazing, and kiln cycle takes approximately <strong>7 days</strong>.
              </p>
              <p className="text-clay-light text-sm leading-relaxed">
                Clay hand-building and wheel throwing workshops require a thorough two-week drying and double-firing process (bisque firing + glaze firing).
              </p>
            </div>
          </div>

          <div className="bg-warm-white rounded-3xl p-8 border border-parchment shadow-pottery flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <MapPin size={28} />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-clay mb-2">Studio Collection</h2>
              <p className="text-clay-light text-sm leading-relaxed mb-3">
                You will receive a notification when your pieces are packed and ready for collection at our Hartley studio:
              </p>
              <p className="text-clay font-medium text-sm">
                Your Pottery Barn &bull; Hartley, Kent (What3Words: <a href="https://maps.app.goo.gl/2H9VXpmJTzNaU1qn9" target="_blank" rel="noopener noreferrer" className="text-terracotta underline">///bunk.apron.slides</a>)
              </p>
            </div>
          </div>

          <div className="bg-warm-white rounded-3xl p-8 border border-parchment shadow-pottery flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Truck size={28} />
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-clay mb-2">UK Postal Delivery</h2>
              <p className="text-clay-light text-sm leading-relaxed mb-3">
                Visiting from outside the area? We can carefully package and post your fired ceramics anywhere within the UK via tracked courier. Postage fees can be arranged at the studio on the day of your workshop.
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link href="/workshops" className="btn-primary text-sm px-8 py-3.5">
              Browse Upcoming Workshops
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
