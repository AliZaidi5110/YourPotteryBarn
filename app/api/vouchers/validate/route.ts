import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vouchers/validate?code=YPB-XXXX-XXXX
// Used at checkout to check balance before redemption
export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code')
  if (!code) return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })

  const voucher = await prisma.voucher.findUnique({ where: { code: code.toUpperCase().trim() } })

  if (!voucher) return NextResponse.json({ valid: false, error: 'Voucher not found' })
  if (!voucher.active) return NextResponse.json({ valid: false, error: 'Voucher has been used or deactivated' })
  if (voucher.expiryDate && voucher.expiryDate < new Date()) {
    return NextResponse.json({ valid: false, error: `Voucher expired on ${voucher.expiryDate.toLocaleDateString('en-GB')}` })
  }
  if (Number(voucher.remainingValue) <= 0) {
    return NextResponse.json({ valid: false, error: 'Voucher has no remaining balance' })
  }

  return NextResponse.json({
    valid: true,
    voucher: {
      id: voucher.id,
      code: voucher.code,
      type: voucher.type,
      title: voucher.title,
      initialValue: Number(voucher.initialValue),
      remainingValue: Number(voucher.remainingValue),
      issuedToName: voucher.issuedToName,
      expiryDate: voucher.expiryDate,
    },
  })
}
