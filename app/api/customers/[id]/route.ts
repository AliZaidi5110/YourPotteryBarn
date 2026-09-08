import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await req.json()
  const customer = await prisma.customer.update({
    where: { id },
    data,
  })
  return NextResponse.json(customer)
}
