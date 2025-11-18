import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapedDeal } from '@/types'

// Amazon Deals Scraper (usando páginas de ofertas públicas)
export async function scrapeAmazonDeals(category: string = 'all'): Promise<ScrapedDeal[]> {
  const deals: ScrapedDeal[] = []

  try {
    // Nota: En producción, usar la API de Product Advertising de Amazon
    // Este es un ejemplo básico que necesita ser adaptado según el país
    const amazonTag = process.env.AMAZON_AFFILIATE_TAG || 'tag-20'

    // Por ahora retornamos datos de ejemplo
    // En producción deberías usar la API oficial de Amazon Affiliate
    const exampleDeals: ScrapedDeal[] = [
      {
        title: 'Echo Dot (5ta Gen) - Altavoz inteligente',
        description: 'Altavoz inteligente con Alexa',
        originalPrice: 59.99,
        currentPrice: 29.99,
        discount: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Echo+Dot',
        productUrl: 'https://amazon.com/dp/example',
        platform: 'amazon',
        category: 'electronica'
      },
      {
        title: 'Fire TV Stick 4K',
        description: 'Streaming en 4K con Alexa',
        originalPrice: 49.99,
        currentPrice: 24.99,
        discount: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=Fire+TV',
        productUrl: 'https://amazon.com/dp/example2',
        platform: 'amazon',
        category: 'electronica'
      }
    ]

    return exampleDeals
  } catch (error) {
    console.error('Error scraping Amazon:', error)
    return deals
  }
}

// Mercado Libre Deals Scraper
export async function scrapeMercadoLibreDeals(category: string = 'all'): Promise<ScrapedDeal[]> {
  const deals: ScrapedDeal[] = []

  try {
    // Mercado Libre tiene una API pública para ofertas
    // Endpoint de ejemplo para México (cambiar según país)
    const response = await axios.get(
      'https://api.mercadolibre.com/sites/MLM/search?q=ofertas&sort=price_asc&limit=20',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (response.data && response.data.results) {
      for (const item of response.data.results) {
        // Calcular descuento si hay precio original
        const originalPrice = item.original_price || item.price * 1.2
        const currentPrice = item.price
        const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)

        if (discount >= 10) {
          deals.push({
            title: item.title,
            description: item.title,
            originalPrice,
            currentPrice,
            discount,
            imageUrl: item.thumbnail?.replace('http:', 'https:'),
            productUrl: item.permalink,
            platform: 'mercadolibre',
            category: mapMercadoLibreCategory(item.category_id)
          })
        }
      }
    }

    return deals
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
