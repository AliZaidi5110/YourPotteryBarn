'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import faqs from '@/lib/faqs.json'

export function FaqSection() {
  const [category, setCategory] = useState('All questions')
  const [query, setQuery] = useState('')
  const categories = ['All questions', ...new Set(faqs.map(faq => faq.category))]
  const filtered = faqs.filter(faq =>
    (category === 'All questions' || faq.category === category) &&
    `${faq.question} ${faq.answer}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  return <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
    <label htmlFor="faq-search" className="block text-sm font-semibold mb-2">Search your questions</label>
    <div className="relative max-w-xl mb-8"><Search size={18} className="absolute left-4 top-3.5 text-clay-light" aria-hidden="true" /><input id="faq-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try booking, parking or collection" className="w-full bg-warm-white border border-parchment rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-clay/30" /></div>
    <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
      <nav aria-label="FAQ categories" className="flex flex-wrap lg:flex-col gap-2 items-start">
        {categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`text-left px-4 py-2 rounded-lg text-sm transition-colors ${category === item ? 'bg-clay text-warm-white' : 'bg-warm-white text-clay hover:bg-parchment'}`}>{item}</button>)}
      </nav>
      <div>
        <p className="text-sm text-clay-light mb-4" role="status">{filtered.length} {filtered.length === 1 ? 'answer' : 'answers'}</p>
        <div className="divide-y divide-parchment border-y border-parchment">
          {filtered.map(faq => <details key={faq.question} className="group py-5">
            <summary className="flex items-center justify-between gap-5 cursor-pointer list-none font-semibold text-clay [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown size={18} className="shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true" /></summary>
            <div className="pt-4 text-clay-light leading-relaxed"><p>{faq.answer}</p>
              {faq.category === 'Booking & Visiting' && <Link href="/workshops" className="inline-block text-clay underline underline-offset-4 mt-3">Find a session</Link>}
              {faq.question === 'Can I buy a gift voucher?' && <Link href="/gift-cards" className="inline-block text-clay underline underline-offset-4 mt-3">View gift cards</Link>}
              {faq.question === 'What happens if I need to cancel?' && <a href="mailto:info@yourpotterybarn.co.uk" className="inline-block text-clay underline underline-offset-4 mt-3">Contact us about your booking</a>}
              {faq.question === 'Where are you located?' && <a href="https://maps.app.goo.gl/2H9VXpmJTzNaU1qn9" target="_blank" rel="noopener noreferrer" className="inline-block text-clay underline underline-offset-4 mt-3">Directions to the barn</a>}
            </div>
          </details>)}
        </div>
        {filtered.length === 0 && <p className="py-8 text-clay-light">No matching questions. Try another search, or <a href="mailto:info@yourpotterybarn.co.uk" className="underline">get in touch</a>.</p>}
      </div>
    </div>
  </section>
}
