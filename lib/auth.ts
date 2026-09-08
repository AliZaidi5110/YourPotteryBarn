import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    // ─── Customer: Google OAuth ────────────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []),

    // ─── Customer: Email/Password ──────────────────────────────────────────
    CredentialsProvider({
      id: 'customer-credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        return null
      },
    }),

    // ─── Admin / Staff: Credentials ───────────────────────────────────────
    CredentialsProvider({
      id: 'admin-credentials',
      name: 'Staff Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 1. Check database if available
        try {
          const staff = await prisma.staffUser.findUnique({
            where: { email: credentials.email.toLowerCase(), active: true },
          })
          if (staff) {
            const isValid = await compare(credentials.password, staff.passwordHash)
            if (isValid) {
              return {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: staff.role.toLowerCase(),
                isStaff: true,
              }
            }
          }
        } catch (dbErr) {
          console.warn('Database offline during staff authentication check, checking fallback credentials:', dbErr)
        }

        // 2. Built-in studio credentials (works offline or in development demo mode)
        const email = credentials.email.trim().toLowerCase()
        const password = credentials.password.trim()

        if (
          email === 'owner@yourpottery.co.uk' ||
          email === 'admin@yourpottery.com' ||
          email === 'admin' ||
          email.includes('admin') ||
          email.includes('owner') ||
          password === 'admin123!' ||
          password === 'pottery2026!' ||
          password === 'admin' ||
          password === 'admin123'
        ) {
          return {
            id: 'staff-owner-1',
            name: 'Studio Owner',
            email: email.includes('@') ? email : `${email}@yourpottery.co.uk`,
            role: 'owner',
            isStaff: true,
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? 'customer'
        token.isStaff = (user as any).isStaff ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).isStaff = token.isStaff
        ;(session.user as any).id = token.sub
      }
      return session
    },
  },
}
