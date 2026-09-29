import { NextRequest, NextResponse } from 'next/server'
import { updateSession, deleteSession, getSessionById } from '@/lib/studio-ops/data'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams?.id
    const session = getSessionById(id)
    if (!session) {
      return NextResponse.json({ error: `Session ${id} not found` }, { status: 404 })
    }
    return NextResponse.json({ session })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams?.id
    const body = await req.json()
    const updated = updateSession(id, body)
    if (!updated) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    return NextResponse.json({ session: updated })
  } catch (err: any) {
    console.error('Error updating session:', err)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = deleteSession(id)
    if (!success) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
