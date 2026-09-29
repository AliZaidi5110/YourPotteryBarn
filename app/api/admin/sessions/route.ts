import { NextRequest, NextResponse } from 'next/server'
import { listSessions, createSession } from '@/lib/studio-ops/data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') || undefined
    const serviceId = searchParams.get('serviceId') || undefined

    const sessions = listSessions({ date, serviceId })
    return NextResponse.json({ sessions })
  } catch (err: any) {
    console.error('Error fetching studio sessions:', err)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const session = createSession(body)
    return NextResponse.json({ session }, { status: 201 })
  } catch (err: any) {
    console.error('Error creating studio session:', err)
    return NextResponse.json({ error: err.message || 'Failed to create session' }, { status: 400 })
  }
}
