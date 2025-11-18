import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const minDiscount = parseInt(searchParams.get('minDiscount') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {
      isActive: true,
      discount: { gte: minDiscount }
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (platform && platform !== 'all') {
      where.platform = platform
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        orderBy: [
          { discount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset
      }),
      prisma.deal.count({ where })
    ])

    return NextResponse.json({
      deals,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Error fetching deals' },
      { status: 500 }
    )
  }
}
