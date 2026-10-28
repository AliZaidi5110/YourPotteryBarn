import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vouchers/validate?code=YPB-XXXX-XXXX
// Used at checkout to check balance before redemption
export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code')
  if (!code) return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })

  const cleanCode = code.toUpperCase().trim()

  try {
    const voucher = await prisma.voucher.findUnique({ where: { code: cleanCode } })

    if (!voucher) {
      // Support demo codes for testing
      if (cleanCode.startsWith('YPB-DEMO') || cleanCode === 'DEMO') {
        return NextResponse.json({
          valid: true,
          voucher: {
            id: 'mock-voucher-1',
            code: cleanCode,
            type: 'MONETARY',
            title: 'Gift Voucher (£25)',
            initialValue: 25,
            remainingValue: 25,
            issuedToName: 'Studio Guest',
            expiryDate: null,
          },
        })
      }
      return NextResponse.json({ valid: false, error: 'Voucher not found' })
    }

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
  } catch (err: any) {
    // Graceful demo fallback if database is not connected
    if (cleanCode.startsWith('YPB-DEMO') || cleanCode === 'DEMO') {
      return NextResponse.json({
        valid: true,
        voucher: {
          id: 'mock-voucher-1',
          code: cleanCode,
          type: 'MONETARY',
          title: 'Gift Voucher (£25)',
          initialValue: 25,
          remainingValue: 25,
          issuedToName: 'Studio Guest',
          expiryDate: null,
        },
      })
    }
    console.warn('Voucher validation DB query failed:', err.message)
    return NextResponse.json({ valid: false, error: 'Could not connect to voucher system. Try code YPB-DEMO' })
  }
}

