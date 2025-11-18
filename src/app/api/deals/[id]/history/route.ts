import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const history = await prisma.priceHistory.findMany({
      where: {
        dealId: id,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        price: true,
        platform: true,
        createdAt: true
      }
    })

    // Get deal info for context
    const deal = await prisma.deal.findUnique({
      where: { id },
      select: {
        title: true,
        originalPrice: true,
        currentPrice: true,
        platform: true
      }
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Calculate stats
    const prices = history.map(h => h.price)
    const stats = {
      minPrice: prices.length > 0 ? Math.min(...prices) : deal.currentPrice,
      maxPrice: prices.length > 0 ? Math.max(...prices) : deal.originalPrice,
      avgPrice: prices.length > 0
        ? prices.reduce((a, b) => a + b, 0) / prices.length
        : deal.currentPrice,
      currentPrice: deal.currentPrice,
      originalPrice: deal.originalPrice,
      priceChange: history.length >= 2
        ? ((history[history.length - 1].price - history[0].price) / history[0].price) * 100
        : 0
    }

    return NextResponse.json({
      deal: {
        title: deal.title,
        platform: deal.platform
      },
      history,
      stats
    })
  } catch (error) {
    console.error('Error fetching price history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price history' },
      { status: 500 }
    )
  }
}
