import Link from 'next/link'
import { Clock, Coffee } from 'lucide-react'
import { refreshments } from '@/lib/studio-content'

export function OpeningHours() {
  return <section id="opening-hours" className="py-14 bg-parchment/40 border-y border-parchment">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10">
      <div><Clock size={24} className="mb-4" aria-hidden="true" /><h2 className="font-playfair text-3xl mb-4">Opening Hours</h2><p className="font-semibold mb-3">Every Saturday | 10am – 5pm</p><p className="text-clay-light mb-3">We&apos;re also open on selected weekdays, Sundays and evenings, with additional sessions and workshops throughout the year.</p><p className="text-clay-light">Please check our <Link href="/workshops" className="underline underline-offset-4">online booking calendar</Link> for our latest opening times and availability.</p><p className="mt-4">We look forward to welcoming you!</p></div>
      <div className="md:border-l md:border-parchment md:pl-10"><Coffee size={24} className="mb-4" aria-hidden="true" /><h2 className="font-playfair text-3xl mb-4">Stay for a cup of tea</h2><p className="text-clay-light">{refreshments}</p><p className="mt-5 text-clay-light">Planning your first visit? <Link href="/faqs" className="underline underline-offset-4">Your questions, answered.</Link></p></div>
    </div>
  </section>
}
