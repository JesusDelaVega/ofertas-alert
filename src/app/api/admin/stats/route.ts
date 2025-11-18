import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalDeals, activeDeals, totalClicks] = await Promise.all([
      prisma.deal.count(),
      prisma.deal.count({ where: { isActive: true } }),
      prisma.click.count()
    ])

    return NextResponse.json({
      totalDeals,
      activeDeals,
      totalClicks
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    )
  }
}
