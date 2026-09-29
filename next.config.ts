import type { NextConfig } from 'next'

const getNextAuthUrl = () => {
  const url = process.env.NEXTAUTH_URL?.trim()
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'https://yourpotterybarn.vercel.app'
}

const nextAuthUrl = getNextAuthUrl()
process.env.NEXTAUTH_URL = nextAuthUrl

const defaultSecret = 'your-pottery-barn-production-secret-2026-ypb-secure-jwt'
const nextAuthSecret = process.env.NEXTAUTH_SECRET?.trim() || defaultSecret
process.env.NEXTAUTH_SECRET = nextAuthSecret

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL: nextAuthUrl,
    NEXTAUTH_SECRET: nextAuthSecret,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig

