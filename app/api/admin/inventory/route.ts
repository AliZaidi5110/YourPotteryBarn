import { NextRequest, NextResponse } from 'next/server'
import { getStudioStore } from '@/lib/studio-ops/data'

export async function GET(req: NextRequest) {
  try {
    const store = getStudioStore()
    return NextResponse.json({ items: store.inventory })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}
