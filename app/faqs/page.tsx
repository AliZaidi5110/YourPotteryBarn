import type { Metadata } from 'next'
import { SiteHeader } from '@/components/customer/SiteHeader'
import { SiteFooter } from '@/components/customer/SiteFooter'
import { FaqSection } from '@/components/customer/FaqSection'

export const metadata: Metadata = {
  title: 'Your Questions, Answered — Your Pottery Barn',
  description: 'Plan your visit to Your Pottery Barn: booking, pottery painting, wheel throwing, parties, access, parking and collecting your pottery.',
}

export default function FaqPage() {
  return <><SiteHeader /><main className="min-h-screen bg-cream">
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 lg:pt-20">
      <p className="text-clay-light text-sm uppercase tracking-widest mb-4">Before your visit</p>
      <h1 className="font-playfair text-4xl sm:text-5xl mb-5">Your Questions, Answered</h1>
      <p className="text-clay-light text-lg max-w-2xl">Everything you need to know before your visit to Your Pottery Barn. Can&apos;t find your answer? <a href="mailto:info@yourpotterybarn.co.uk" className="underline underline-offset-4">Please get in touch</a> — we&apos;re happy to help.</p>
    </section>
    <FaqSection />
  </main><SiteFooter /></>
}
