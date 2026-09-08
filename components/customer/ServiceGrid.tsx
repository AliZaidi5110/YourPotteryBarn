'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, ArrowRight, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '@prisma/client'

const CATEGORY_ICONS: Record<string, string> = {
  Paint: '🎨',
  Clay: '🏺',
  Throwing: '⚡',
  Seasonal: '🍂',
  Music: '🎵',
}

const CATEGORY_COLORS: Record<string, string> = {
  Paint: 'bg-blue-50 text-blue-700 border-blue-200',
  Clay: 'bg-terracotta/10 text-terracotta border-terracotta/20',
  Throwing: 'bg-purple-50 text-purple-700 border-purple-200',
  Seasonal: 'bg-sage/10 text-sage border-sage/20',
  Music: 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

const SERVICE_PLACEHOLDERS: Record<string, string> = {
  Paint: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  Clay: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  Throwing: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  Seasonal: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=600&q=80',
  Music: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
}

interface ServiceGridProps {
  services: Service[]
}

const ALL_CATEGORIES = ['All', 'Paint', 'Clay', 'Throwing', 'Seasonal', 'Music']

export function ServiceGrid({ services }: ServiceGridProps) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? services
    : services.filter(s => s.category === activeCategory)

  const availableCategories = ['All', ...Array.from(new Set(services.map(s => s.category)))]

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-terracotta font-semibold text-sm uppercase tracking-widest mb-3">What we offer</p>
        <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-clay mb-4">
          Choose your workshop
        </h2>
        <p className="text-clay-light text-lg max-w-xl mx-auto">
          From beginner-friendly Pick & Paint to hands-on wheel throwing — there&apos;s a session for everyone.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Service categories">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200
              ${activeCategory === cat
                ? 'bg-terracotta text-warm-white border-terracotta shadow-terracotta'
                : 'bg-warm-white text-clay border-parchment hover:border-terracotta hover:text-terracotta'
              }
            `}
          >
            {cat !== 'All' && <span className="mr-1.5">{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Service Cards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        role="tabpanel"
        aria-label={`${activeCategory} workshops`}
      >
        {filtered.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-clay-light">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg">No workshops in this category right now.</p>
        </div>
      )}
    </section>
  )
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const duration = service.durationMinutes >= 60
    ? `${service.durationMinutes / 60}hr${service.durationMinutes / 60 !== 1 ? 's' : ''}`
    : `${service.durationMinutes}min`

  const imgSrc = service.imageUrl ?? SERVICE_PLACEHOLDERS[service.category] ?? SERVICE_PLACEHOLDERS.Clay

  return (
    <article
      className="group bg-warm-white rounded-2xl overflow-hidden shadow-pottery hover:shadow-pottery-lg card-hover border border-parchment/50"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-parchment">
        <img
          src={imgSrc}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${CATEGORY_COLORS[service.category] ?? 'bg-white/80 text-clay border-parchment'}`}>
          <span>{CATEGORY_ICONS[service.category] ?? '🏺'}</span>
          {service.category}
        </div>
        {/* Price bubble */}
        <div className="absolute top-3 right-3 bg-clay text-warm-white rounded-xl px-3 py-1.5 text-sm font-bold shadow-md">
          {formatCurrency(Number(service.price))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-playfair font-semibold text-xl text-clay mb-2 line-clamp-2 group-hover:text-terracotta transition-colors">
          {service.name}
        </h3>
        <p className="text-clay-light text-sm line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-clay-light mb-5">
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} aria-hidden="true" />
            Up to {service.maxCapacity} people
          </span>
          <span className="flex items-center gap-1 text-yellow-600">
            <Star size={12} fill="currentColor" aria-hidden="true" />
            5.0
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/book/${service.id}`}
          className="flex items-center justify-between w-full bg-terracotta/10 hover:bg-terracotta text-terracotta hover:text-warm-white rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group/btn"
          aria-label={`Book ${service.name} — ${formatCurrency(Number(service.price))} per person`}
        >
          <span>Book this session</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
