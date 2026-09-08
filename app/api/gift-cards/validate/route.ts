import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Validate a gift card code
export async function POST(req: NextRequest) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ valid: false, message: 'No code provided' }, { status: 400 })
  }

  const giftCard = await prisma.giftCard.findUnique({
    where: { code: code.trim().toUpperCase() },
  })

  if (!giftCard || !giftCard.active) {
    return NextResponse.json({ valid: false, message: 'Gift card not found or inactive' })
  }

  if (giftCard.expiryDate && giftCard.expiryDate < new Date()) {
    return NextResponse.json({ valid: false, message: 'Gift card has expired' })
  }

  if (Number(giftCard.remainingBalance) <= 0) {
    return NextResponse.json({ valid: false, message: 'Gift card has no remaining balance' })
  }

  return NextResponse.json({
    valid: true,
    code: giftCard.code,
    remainingBalance: Number(giftCard.remainingBalance),
    expiryDate: giftCard.expiryDate,
  })
}
