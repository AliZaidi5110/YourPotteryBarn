import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const WixContactSchema = z.object({
  // Wix CSV headers (case-insensitive mapped below)
  firstName: z.string().optional().default(''),
  lastName: z.string().optional().default(''),
  name: z.string().optional().default(''),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  wixContactId: z.string().optional(),
  tags: z.string().optional(), // comma separated
  notes: z.string().optional(),
})

// POST /api/customers/import
// Accepts JSON array of customer rows (parsed from CSV by client)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !(session.user as any)?.isStaff) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await req.json()
  const rows: Record<string, string>[] = body.rows
  if (!rows || !Array.isArray(rows)) {
    return NextResponse.json({ error: 'Invalid payload — expected { rows: [...] }' }, { status: 400 })
  }

  const results = { created: 0, updated: 0, skipped: 0, errors: [] as string[] }

  for (const raw of rows) {
    // Normalise Wix field names (they vary between exports)
    const norm: Record<string, string> = {}
    for (const [k, v] of Object.entries(raw)) {
      norm[k.toLowerCase().replace(/\s+/g, '')] = String(v ?? '').trim()
    }

    const firstName = norm['firstname'] ?? norm['first name'] ?? norm['givenname'] ?? ''
    const lastName = norm['lastname'] ?? norm['last name'] ?? norm['familyname'] ?? ''
    const fullName = norm['name'] ?? norm['fullname'] ?? `${firstName} ${lastName}`.trim()
    const email = norm['email'] ?? norm['emailaddress'] ?? norm['email address'] ?? ''
    const phone = norm['phone'] ?? norm['phonenumber'] ?? norm['mobile'] ?? ''
    const wixId = norm['contactid'] ?? norm['wixcontactid'] ?? norm['id'] ?? ''
    const tags = norm['labels'] ?? norm['tags'] ?? ''
    const notes = norm['notes'] ?? ''

    if (!email || !fullName) {
      results.skipped++
      continue
    }

    const tagArr = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

    try {
      const existing = await prisma.customer.findFirst({
        where: { OR: [{ email }, ...(wixId ? [{ wixContactId: wixId }] : [])] },
      })

      if (existing) {
        // Update with any new info
        await prisma.customer.update({
          where: { id: existing.id },
          data: {
            name: existing.name || fullName,
            phone: existing.phone || phone || null,
            wixContactId: existing.wixContactId || wixId || null,
            tags: existing.tags.length > 0 ? existing.tags : tagArr,
            notes: existing.notes || notes || null,
          },
        })
        results.updated++
      } else {
        await prisma.customer.create({
          data: {
            name: fullName,
            email,
            phone: phone || null,
            wixContactId: wixId || null,
            tags: tagArr,
            notes: notes || null,
          },
        })
        results.created++
      }
    } catch (err: any) {
      results.errors.push(`${email}: ${err.message}`)
    }
  }

  return NextResponse.json({ success: true, results })
}
