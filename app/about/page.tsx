import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { MeetTheOwnerSection } from '@/components/customer/MeetTheOwnerSection'
import { WhyChooseUsSection } from '@/components/customer/WhyChooseUsSection'
import { OpeningHours } from '@/components/customer/OpeningHours'
import { welcome, story } from '@/lib/studio-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story — Your Pottery Barn',
  description: 'From a little conservatory in Swanscombe in 2007 to our family-run pottery barn in Hartley, Kent.',
}
export default function AboutPage() {
  return <><SiteHeader /><main className="bg-cream">
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
      <p className="text-sm uppercase tracking-widest text-clay-light mb-4">Your Pottery Barn</p>
      <h1 className="font-playfair text-4xl sm:text-5xl text-clay mb-8">A place to create, connect and belong.</h1>
      <div className="space-y-4 text-clay-light text-lg leading-relaxed">{welcome.map(p => <p key={p}>{p}</p>)}</div>
    </section>
    <section className="bg-warm-white py-16 lg:py-20"><div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
      <div><h2 className="font-playfair text-3xl sm:text-4xl mb-6">From a Little Conservatory to a beautiful Barn</h2><div className="space-y-4 text-clay-light leading-relaxed">{story.map(p => <p key={p}>{p}</p>)}</div></div>
      <img src="/images/gallery/gallery-5.avif" alt="The Your Pottery Barn reception counter in our Hartley home" className="w-full aspect-[4/3] object-cover rounded-2xl" />
    </div></section>
    <MeetTheOwnerSection /><WhyChooseUsSection /><OpeningHours />
  </main><SiteFooter /></>
}
