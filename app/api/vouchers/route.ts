import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
function generateVoucherCode() {
  // Format: YPB-XXXX-XXXX
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `YPB-${seg()}-${seg()}`
}

// GET /api/vouchers - list all vouchers
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const status = searchParams.get('status') ?? ''

  const vouchers = await prisma.voucher.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { code: { contains: q, mode: 'insensitive' } },
            { issuedToName: { contains: q, mode: 'insensitive' } },
            { issuedToEmail: { contains: q, mode: 'insensitive' } },
            { purchasedByName: { contains: q, mode: 'insensitive' } },
          ],
        } : {},
        status === 'active' ? { active: true } : {},
        status === 'redeemed' ? { redeemedAt: { not: null } } : {},
        status === 'expired' ? { expiryDate: { lt: new Date() } } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const stats = await prisma.voucher.aggregate({
    _count: true,
    _sum: { salePrice: true, initialValue: true, remainingValue: true },
  })

  return NextResponse.json({ vouchers, stats })
}

const CreateVoucherSchema = z.object({
  type: z.enum(['MONETARY', 'EXPERIENCE']).default('MONETARY'),
  title: z.string().min(1),
  initialValue: z.number().positive(),
  salePrice: z.number().positive().optional(),
  issuedToName: z.string().optional(),
  issuedToEmail: z.string().email().optional().or(z.literal('')),
  purchasedByName: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']).default('CASH'),
  expiryMonths: z.number().int().min(1).max(36).default(12),
  notes: z.string().optional(),
})

// POST /api/vouchers - sell a new voucher
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await req.json()
  const data = CreateVoucherSchema.parse(body)

  const code = generateVoucherCode()
  const expiryDate = new Date()
  expiryDate.setMonth(expiryDate.getMonth() + data.expiryMonths)

  const voucher = await prisma.voucher.create({
    data: {
      code,
      type: data.type,
      title: data.title,
      initialValue: data.initialValue,
      remainingValue: data.initialValue,
      salePrice: data.salePrice ?? data.initialValue,
      issuedToName: data.issuedToName ?? null,
      issuedToEmail: data.issuedToEmail || null,
      purchasedByName: data.purchasedByName ?? null,
      paymentMethod: data.paymentMethod,
      expiryDate,
      notes: data.notes ?? null,
      active: true,
    },
  })

  return NextResponse.json({ success: true, voucher })
}
