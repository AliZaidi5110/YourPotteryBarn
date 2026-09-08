'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin'

  const [email, setEmail] = useState('owner@yourpottery.co.uk')
  const [password, setPassword] = useState('admin123!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('admin-credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    if (result?.error) {
      setError('Invalid email or password. Please check your credentials.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen bg-clay flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-terracotta/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-sage/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white p-1.5 flex items-center justify-center mx-auto mb-4 shadow-xl border border-parchment">
            <img
              src="/images/logo/logo.png"
              alt="Your Pottery Barn Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-warm-white">Your Pottery Barn</h1>
          <p className="text-cream/90 text-sm mt-1.5 font-medium">Staff &amp; Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-warm-white rounded-2xl shadow-pottery-xl p-8">
          <h2 className="font-playfair font-semibold text-xl text-clay text-center mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-clay mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="owner@yourpottery.co.uk"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-clay mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-light" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-parchment rounded-xl text-clay text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-clay-light mt-5">
            For customer bookings, visit{' '}
            <a href="/" className="text-terracotta underline">the main site</a>.
          </p>
        </div>

        <div className="text-center mt-6 p-3 rounded-xl bg-clay-light/40 border border-cream/20 text-cream text-xs">
          <p className="font-medium text-cream-dark">Studio Staff Login:</p>
          <p className="mt-1 font-mono text-terracotta-light">owner@yourpottery.co.uk &bull; admin123!</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-clay flex items-center justify-center text-warm-white">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}

