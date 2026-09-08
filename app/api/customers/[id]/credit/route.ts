import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { amount } = await req.json()
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }
  const customer = await prisma.customer.update({
    where: { id },
    data: { creditBalance: { increment: amount } },
  })
  return NextResponse.json({ success: true, newBalance: customer.creditBalance })
}
