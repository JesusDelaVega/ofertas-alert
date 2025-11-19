import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapedDeal } from '@/types'

// Amazon Deals Scraper (requiere API de Product Advertising)
export async function scrapeAmazonDeals(category: string = 'all'): Promise<ScrapedDeal[]> {
  // TODO: Implementar con Amazon Product Advertising API
  // Por ahora retorna vacío - solo usamos Mercado Libre
  return []
}

// Mercado Libre Deals Scraper
export async function scrapeMercadoLibreDeals(category: string = 'all'): Promise<ScrapedDeal[]> {
  const deals: ScrapedDeal[] = []

  try {
    // Categorías populares de Mercado Libre México
    const categories = [
      'MLM1051', // Celulares
      'MLM1648', // Computación
      'MLM1000', // Electrónica
      'MLM1144', // Videojuegos
    ]

    for (const categoryId of categories) {
      try {
        // Usar endpoint de highlights/deals que es público
        const response = await axios.get(
          `https://api.mercadolibre.com/sites/MLM/search`,
          {
            params: {
              category: categoryId,
              sort: 'relevance',
              limit: 15,
              has_deals: 'yes'
            },
            headers: {
              'Accept': 'application/json'
            },
            timeout: 10000
          }
        )

        if (response.data && response.data.results) {
          for (const item of response.data.results) {
            // Solo incluir si tiene precio original (descuento real)
            if (item.original_price && item.original_price > item.price) {
              const originalPrice = item.original_price
              const currentPrice = item.price
              const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)

              if (discount >= 10) {
                deals.push({
                  title: item.title,
                  description: item.title,
                  originalPrice,
                  currentPrice,
                  discount,
                  imageUrl: item.thumbnail?.replace('http:', 'https:').replace('-I.jpg', '-O.jpg'),
                  productUrl: item.permalink,
                  platform: 'mercadolibre',
                  category: mapMercadoLibreCategory(item.category_id)
                })
              }
            }
          }
        }

        // Pequeña pausa entre requests para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (err) {
        console.error(`Error fetching category ${categoryId}:`, err)
      }
    }

    // Eliminar duplicados por URL
    const uniqueDeals = deals.filter((deal, index, self) =>
      index === self.findIndex(d => d.productUrl === deal.productUrl)
    )

    return uniqueDeals.sort((a, b) => b.discount - a.discount).slice(0, 50)
  } catch (error) {
    console.error('Error scraping Mercado Libre:', error)
    return deals
  }
}

function mapMercadoLibreCategory(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    'MLM1051': 'celulares',
    'MLM1648': 'computacion',
    'MLM1144': 'videojuegos',
    'MLM1000': 'electronica',
    'MLM1574': 'hogar',
    'MLM1276': 'deportes',
    'MLM1168': 'zapatos'
  }

  return categoryMap[categoryId] || 'otros'
}

// Función para generar URL de afiliado
export function generateAffiliateUrl(productUrl: string, platform: 'amazon' | 'mercadolibre'): string {
  if (platform === 'amazon') {
    const tag = process.env.AMAZON_AFFILIATE_TAG || 'tag-20'
    const url = new URL(productUrl)
    url.searchParams.set('tag', tag)
    return url.toString()
  }

  // Para Mercado Libre, agregar parámetros de tracking
  const mlAppId = process.env.MERCADOLIBRE_APP_ID || ''
  if (mlAppId) {
    const url = new URL(productUrl)
    url.searchParams.set('TRACKING_APP_ID', mlAppId)
    return url.toString()
  }

  return productUrl
}

// Función principal para obtener todas las ofertas
export async function getAllDeals(): Promise<ScrapedDeal[]> {
  const [amazonDeals, mlDeals] = await Promise.all([
    scrapeAmazonDeals(),
    scrapeMercadoLibreDeals()
  ])

  return [...amazonDeals, ...mlDeals].sort((a, b) => b.discount - a.discount)
}
