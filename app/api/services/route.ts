import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/services — list all services
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get('active') !== 'false'

  const services = await prisma.service.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json({ services })
}
