import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllDeals, generateAffiliateUrl } from '@/services/scraper'

// Este endpoint debería ser llamado por un cron job (ej. cada hora)
// Usar servicios como Vercel Cron, Railway, o cron-job.org

export async function GET(request: NextRequest) {
  try {
    // Verificar secret para seguridad (opcional en desarrollo)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener ofertas de ambas plataformas
    const scrapedDeals = await getAllDeals()

    let newDealsCount = 0
    let updatedDealsCount = 0

    for (const deal of scrapedDeals) {
      // Buscar si ya existe por URL
      const existing = await prisma.deal.findFirst({
        where: { productUrl: deal.productUrl }
      })

      const affiliateUrl = generateAffiliateUrl(deal.productUrl, deal.platform)

      if (existing) {
        // Siempre guardar en historial de precios
        await prisma.priceHistory.create({
          data: {
            dealId: existing.id,
            price: deal.currentPrice,
            platform: deal.platform
          }
        })

        // Actualizar si cambió el precio
        if (existing.currentPrice !== deal.currentPrice) {
          await prisma.deal.update({
            where: { id: existing.id },
            data: {
              currentPrice: deal.currentPrice,
              originalPrice: deal.originalPrice,
              discount: deal.discount,
              affiliateUrl
            }
          })
          updatedDealsCount++
        }
      } else {
        // Crear nueva oferta
        const newDeal = await prisma.deal.create({
          data: {
            title: deal.title,
            description: deal.description,
            originalPrice: deal.originalPrice,
            currentPrice: deal.currentPrice,
            discount: deal.discount,
            imageUrl: deal.imageUrl,
            productUrl: deal.productUrl,
            affiliateUrl,
            platform: deal.platform,
            category: deal.category
          }
        })

        // Crear primer registro de historial
        await prisma.priceHistory.create({
          data: {
            dealId: newDeal.id,
            price: deal.currentPrice,
            platform: deal.platform
          }
        })

        newDealsCount++
      }
    }

    // Desactivar ofertas antiguas (más de 24 horas sin actualizar)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    await prisma.deal.updateMany({
      where: {
        updatedAt: { lt: yesterday },
        isActive: true
      },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      scraped: scrapedDeals.length,
      newDeals: newDealsCount,
      updatedDeals: updatedDealsCount
    })

  } catch (error) {
    console.error('Error in cron scrape:', error)
    return NextResponse.json(
      { error: 'Error scraping deals' },
      { status: 500 }
    )
  }
}
