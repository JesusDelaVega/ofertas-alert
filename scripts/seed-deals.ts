import { PrismaClient } from '@prisma/client'
import { getAllDeals, generateAffiliateUrl } from '../src/services/scraper'

const prisma = new PrismaClient()

async function main() {
  console.log('Fetching deals from Mercado Libre...')

  const scrapedDeals = await getAllDeals()

  console.log(`Found ${scrapedDeals.length} deals`)

  let newDealsCount = 0

  for (const deal of scrapedDeals) {
    const existing = await prisma.deal.findFirst({
      where: { productUrl: deal.productUrl }
    })

    if (!existing) {
      const affiliateUrl = generateAffiliateUrl(deal.productUrl, deal.platform)

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

      await prisma.priceHistory.create({
        data: {
          dealId: newDeal.id,
          price: deal.currentPrice,
          platform: deal.platform
        }
      })

      newDealsCount++
      console.log(`Added: ${deal.title.substring(0, 50)}...`)
    }
  }

  console.log(`\nDone! Added ${newDealsCount} new deals`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
