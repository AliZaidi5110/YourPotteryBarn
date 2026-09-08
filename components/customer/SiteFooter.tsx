export function SiteFooter() {
  return (
    <footer className="bg-clay text-cream/80 mt-20" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-warm-white p-1 flex items-center justify-center shadow-md">
                <img
                  src="/images/logo/logo.png"
                  alt="Your Pottery Barn Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-playfair font-semibold text-warm-white text-xl block leading-tight">Your Pottery Barn</span>
                <span className="text-xs text-terracotta-light font-medium block">Arts &amp; Crafts Studio</span>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-sm">
              A warm, creative studio where everyone belongs. From beginners to experienced makers,
              come join us for a session you&apos;ll remember.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://instagram.com" className="text-cream/40 hover:text-terracotta-light transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://facebook.com" className="text-cream/40 hover:text-terracotta-light transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-warm-white mb-4 text-sm uppercase tracking-wide">Explore</h3>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li>
                <a href="/workshops" className="hover:text-terracotta-light transition-colors">Workshops &amp; Classes</a>
              </li>
              <li>
                <a href="/celebrations" className="hover:text-terracotta-light transition-colors">Celebrations &amp; Parties</a>
              </li>
              <li>
                <a href="/gallery" className="hover:text-terracotta-light transition-colors">Studio Photo Gallery</a>
              </li>
              <li>
                <a href="/collections-postage" className="hover:text-terracotta-light transition-colors">Collections &amp; Postage</a>
              </li>
              <li>
                <a href="/about" className="hover:text-terracotta-light transition-colors">About Our Studio</a>
              </li>
              <li>
                <a href="/gift-cards" className="hover:text-terracotta-light transition-colors">Gift Cards &amp; Vouchers</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-warm-white mb-4 text-sm uppercase tracking-wide">Visit The Barn</h3>
            <address className="not-italic text-sm text-cream/70 space-y-2.5">
              <p>📍 Hartley, Kent, UK</p>
              <p>
                🧭 What3Words:{' '}
                <a
                  href="https://maps.app.goo.gl/2H9VXpmJTzNaU1qn9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta-light hover:underline font-medium"
                >
                  ///bunk.apron.slides
                </a>
              </p>
              <p>
                📞 <a href="tel:+447809208786" className="hover:text-terracotta-light transition-colors">+44 7809 208786</a>
              </p>
              <p>
                ✉️ <a href="mailto:hello@yourpotterybarn.co.uk" className="hover:text-terracotta-light transition-colors">hello@yourpotterybarn.co.uk</a>
              </p>
              <div className="pt-2">
                <a href="/gift-cards" className="inline-flex items-center gap-1.5 text-terracotta-light hover:text-warm-white transition-colors font-medium">
                  🎁 Gift cards available
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="divider mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Your Pottery Barn. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-cream/70 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-cream/70 transition-colors">Terms</a>
            <a href="/admin" className="hover:text-cream/70 transition-colors">Staff Login</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
