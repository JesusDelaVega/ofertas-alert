import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { dealId, source } = await request.json()

    if (!dealId) {
      return NextResponse.json(
        { success: false, error: 'dealId is required' },
        { status: 400 }
      )
    }

    await prisma.click.create({
      data: {
        dealId,
        source: source || 'web'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json(
      { success: false, error: 'Error tracking click' },
      { status: 500 }
    )
  }
}
