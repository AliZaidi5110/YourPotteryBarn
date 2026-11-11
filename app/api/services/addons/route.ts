import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApprovedAddonDetails } from '@/lib/service-details'

export async function GET() {
  const addons = await prisma.addon.findMany({
    where: { active: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(addons.map(withApprovedAddonDetails))
}
