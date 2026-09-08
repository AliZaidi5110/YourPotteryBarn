import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const ADMIN_PATHS = ['/admin']
const AUTH_PATHS = ['/account']

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Admin routes — require staff or owner
  if (ADMIN_PATHS.some(p => pathname.startsWith(p)) && !pathname.startsWith('/admin/login')) {
    if (!token?.isStaff) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Customer account routes — require any session
  if (AUTH_PATHS.some(p => pathname.startsWith(p))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}

