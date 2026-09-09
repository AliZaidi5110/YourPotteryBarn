'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export interface GalleryItem {
  id: string
  src: string
  title: string
  category: 'Painting' | 'Throwing' | 'Parties' | 'Creations'
  description?: string
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    src: '/images/gallery/gallery-1.avif',
    title: 'Studio Painting Table',
    category: 'Painting',
    description: 'Guests personalising hand-selected bisque pieces with vibrant underglazes.',
  },
  {
    id: 'g-2',
    src: '/images/gallery/gallery-2.avif',
    title: 'Birthday Celebration Party',
    category: 'Parties',
    description: 'Kids and families celebrating with pottery painting and party treats.',
  },
  {
    id: 'g-3',
    src: '/images/gallery/gallery-3.avif',
    title: 'Wheel Throwing Mastery',
    category: 'Throwing',
    description: 'Centering clay and pulling smooth cylindrical walls on the potter’s wheel.',
  },
  {
    id: 'g-4',
    src: '/images/gallery/gallery-4.avif',
    title: 'Handmade Glazed Ceramics',
    category: 'Creations',
    description: 'Freshly unloaded from our kilns with glossy, food-safe glazes.',
  },
  {
    id: 'g-5',
    src: '/images/gallery/gallery-5.avif',
    title: 'Hen Party Celebration',
    category: 'Parties',
    description: 'Creative evening laughter, drinks, and keepsake pottery painting.',
  },
  {
    id: 'g-6',
    src: '/images/gallery/gallery-6.avif',
    title: 'Beginner Pottery Session',
    category: 'Throwing',
    description: 'One-on-one tutor guidance shaping bowls and vessels on the wheel.',
  },
  {
    id: 'g-7',
    src: '/images/gallery/gallery-7.avif',
    title: 'Colourful Bisque Collection',
    category: 'Painting',
    description: 'Mugs, planters, bowls, and animal figurines waiting for your touch.',
  },
  {
    id: 'g-8',
    src: '/images/gallery/gallery-8.avif',
    title: 'Baby Handprint Keepsakes',
    category: 'Creations',
    description: 'Precious little footprints and handprints fired onto memory plates.',
  },
  {
    id: 'g-9',
    src: '/images/gallery/gallery-9.avif',
    title: 'Private Studio Gathering',
    category: 'Parties',
    description: 'Exclusive studio hire with private room setup and festive celebration styling.',
  },
  {
    id: 'g-10',
    src: '/images/gallery/gallery-10.avif',
    title: 'Clay Hand-Building Workshop',
    category: 'Throwing',
    description: 'Rolling, stamping, and texturing raw clay for charcuterie platters.',
  },
  {
    id: 'g-11',
    src: '/images/gallery/gallery-11.avif',
    title: 'Detailed Brushwork Art',
    category: 'Painting',
    description: 'Fine detailing and speckled glaze combinations in progress.',
  },
  {
    id: 'g-12',
    src: '/images/gallery/gallery-12.avif',
    title: 'Family Afternoon at The Barn',
    category: 'Parties',
    description: 'All generations making memories together in our Hartley studio.',
  },
  {
    id: 'g-13',
    src: '/images/gallery/gallery-13.avif',
    title: 'Finished Kiln Masterpieces',
    category: 'Creations',
    description: 'Gleaming fired tableware packaged and ready for collection.',
  },
  {
    id: 'g-14',
    src: '/images/gallery/gallery-14.avif',
    title: 'Mindful Ceramic Carving',
    category: 'Throwing',
    description: 'Trimming foot rings and adding delicate decorative incisions.',
  },
]

interface GallerySectionProps {
  limit?: number
  showViewAll?: boolean
}

export function GallerySection({ limit = 8, showViewAll = true }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const categories = [
    { key: 'All', label: 'All Photos' },
    { key: 'Painting', label: '🎨 Pottery Painting' },
    { key: 'Throwing', label: '🏺 Wheel & Clay' },
    { key: 'Parties', label: '🎉 Celebrations' },
    { key: 'Creations', label: '✨ Fired Pieces' },
  ]

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory)

  const displayItems = limit ? filtered.slice(0, limit) : filtered

  const handlePrev = () => {
    if (selectedIdx === null) return
    setSelectedIdx(selectedIdx > 0 ? selectedIdx - 1 : filtered.length - 1)
  }

  const handleNext = () => {
    if (selectedIdx === null) return
    setSelectedIdx(selectedIdx < filtered.length - 1 ? selectedIdx + 1 : 0)
  }

  return (
    <section id="gallery" className="py-20 bg-warm-white" aria-label="Studio Photo Gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-terracotta font-semibold text-xs uppercase tracking-widest block mb-3">
            Moments &amp; Masterpieces
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-clay mb-4">
            Studio Life Gallery
          </h2>
          <p className="text-clay-light text-base sm:text-lg leading-relaxed">
            Take a peek inside our Hartley studio &mdash; from laughter-filled birthday parties and quiet wheel-throwing sessions to beautifully glazed creations fresh from the kiln.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key)
                  setSelectedIdx(null)
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-clay text-warm-white shadow-sm'
                    : 'bg-cream text-clay hover:bg-parchment border border-parchment/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative rounded-2xl overflow-hidden bg-parchment shadow-sm hover:shadow-pottery-lg transition-all duration-300 cursor-pointer aspect-square"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Gradient Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-clay/90 via-clay/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-light mb-1">
                  {item.category}
                </span>
                <h3 className="font-playfair text-lg font-semibold leading-tight text-warm-white mb-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-cream/80 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-terracotta-light font-medium">
                  <ZoomIn size={14} /> Click to expand
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-clay/30 bg-warm-white hover:bg-clay hover:text-warm-white text-clay font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              View Full Studio Gallery ({GALLERY_ITEMS.length} Photos) &rarr;
            </Link>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && filtered[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Image & Caption Card */}
          <div
            className="relative max-w-4xl max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl max-h-[70vh] flex items-center justify-center">
              <img
                src={filtered[selectedIdx].src}
                alt={filtered[selectedIdx].title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            
            <div className="mt-4 text-center text-white max-w-xl px-4">
              <span className="text-xs uppercase font-bold tracking-widest text-terracotta-light">
                {filtered[selectedIdx].category} &bull; {selectedIdx + 1} of {filtered.length}
              </span>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold mt-1">
                {filtered[selectedIdx].title}
              </h3>
              {filtered[selectedIdx].description && (
                <p className="text-sm text-neutral-300 mt-1.5 leading-relaxed">
                  {filtered[selectedIdx].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
