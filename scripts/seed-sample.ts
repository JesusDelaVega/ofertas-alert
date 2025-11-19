import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleDeals = [
  {
    title: 'Samsung Galaxy A54 5G 128GB Negro',
    description: 'Smartphone con pantalla Super AMOLED de 6.4", cámara de 50MP',
    originalPrice: 8999,
    currentPrice: 6499,
    discount: 28,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_930324-MLM69749383507_062023-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/samsung-galaxy-a54',
    affiliateUrl: 'https://www.mercadolibre.com.mx/samsung-galaxy-a54',
    platform: 'mercadolibre',
    category: 'celulares'
  },
  {
    title: 'Laptop HP 15.6" Intel Core i5 8GB RAM 512GB SSD',
    description: 'Laptop para trabajo y estudio con Windows 11',
    originalPrice: 15999,
    currentPrice: 11999,
    discount: 25,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_601415-MLM69436998763_052023-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/laptop-hp-15',
    affiliateUrl: 'https://www.mercadolibre.com.mx/laptop-hp-15',
    platform: 'mercadolibre',
    category: 'computacion'
  },
  {
    title: 'Audífonos Sony WH-1000XM4 Bluetooth Noise Cancelling',
    description: 'Audífonos inalámbricos con cancelación de ruido premium',
    originalPrice: 6999,
    currentPrice: 4999,
    discount: 29,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_988498-MLM44249764270_122020-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/sony-wh1000xm4',
    affiliateUrl: 'https://www.mercadolibre.com.mx/sony-wh1000xm4',
    platform: 'mercadolibre',
    category: 'electronica'
  },
  {
    title: 'Smart TV Samsung 55" 4K UHD Crystal',
    description: 'Televisor inteligente con HDR y Tizen OS',
    originalPrice: 12999,
    currentPrice: 8999,
    discount: 31,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_758347-MLM50929781941_082022-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/samsung-tv-55',
    affiliateUrl: 'https://www.mercadolibre.com.mx/samsung-tv-55',
    platform: 'mercadolibre',
    category: 'electronica'
  },
  {
    title: 'PlayStation 5 Consola Standard Edition',
    description: 'Consola de videojuegos de última generación',
    originalPrice: 14999,
    currentPrice: 11999,
    discount: 20,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_770021-MLA46516512347_062021-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/playstation-5',
    affiliateUrl: 'https://www.mercadolibre.com.mx/playstation-5',
    platform: 'mercadolibre',
    category: 'videojuegos'
  },
  {
    title: 'iPad Air 5ta Gen 64GB WiFi',
    description: 'Tablet Apple con chip M1 y pantalla Liquid Retina',
    originalPrice: 13999,
    currentPrice: 10999,
    discount: 21,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_697975-MLA51559383498_092022-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/ipad-air-5',
    affiliateUrl: 'https://www.mercadolibre.com.mx/ipad-air-5',
    platform: 'mercadolibre',
    category: 'computacion'
  },
  {
    title: 'Apple Watch Series 9 GPS 41mm',
    description: 'Reloj inteligente con sensor de temperatura y oxígeno',
    originalPrice: 9999,
    currentPrice: 7499,
    discount: 25,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_604527-MLA71782897638_092023-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/apple-watch-9',
    affiliateUrl: 'https://www.mercadolibre.com.mx/apple-watch-9',
    platform: 'mercadolibre',
    category: 'electronica'
  },
  {
    title: 'Bocina JBL Charge 5 Bluetooth Portátil',
    description: 'Bocina resistente al agua con 20 horas de batería',
    originalPrice: 3499,
    currentPrice: 2499,
    discount: 29,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_624453-MLM48006650855_102021-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/jbl-charge-5',
    affiliateUrl: 'https://www.mercadolibre.com.mx/jbl-charge-5',
    platform: 'mercadolibre',
    category: 'electronica'
  },
  {
    title: 'iPhone 14 128GB Azul',
    description: 'Smartphone Apple con chip A15 Bionic',
    originalPrice: 19999,
    currentPrice: 14999,
    discount: 25,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_674014-MLA51821830888_102022-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/iphone-14',
    affiliateUrl: 'https://www.mercadolibre.com.mx/iphone-14',
    platform: 'mercadolibre',
    category: 'celulares'
  },
  {
    title: 'Monitor LG UltraGear 27" 144Hz Gaming',
    description: 'Monitor gaming IPS con 1ms y FreeSync Premium',
    originalPrice: 5999,
    currentPrice: 4299,
    discount: 28,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_866057-MLM48563139490_122021-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/lg-ultragear-27',
    affiliateUrl: 'https://www.mercadolibre.com.mx/lg-ultragear-27',
    platform: 'mercadolibre',
    category: 'computacion'
  },
  {
    title: 'Xiaomi Redmi Note 12 Pro 256GB',
    description: 'Smartphone con cámara de 108MP y carga rápida 67W',
    originalPrice: 7999,
    currentPrice: 5999,
    discount: 25,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_637633-MLM54545640169_032023-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/redmi-note-12-pro',
    affiliateUrl: 'https://www.mercadolibre.com.mx/redmi-note-12-pro',
    platform: 'mercadolibre',
    category: 'celulares'
  },
  {
    title: 'Nintendo Switch OLED Blanco',
    description: 'Consola portátil con pantalla OLED de 7 pulgadas',
    originalPrice: 8999,
    currentPrice: 6999,
    discount: 22,
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_620879-MLM48867566044_012022-F.webp',
    productUrl: 'https://www.mercadolibre.com.mx/nintendo-switch-oled',
    affiliateUrl: 'https://www.mercadolibre.com.mx/nintendo-switch-oled',
    platform: 'mercadolibre',
    category: 'videojuegos'
  }
]

async function main() {
  console.log('Seeding sample deals...')

  for (const deal of sampleDeals) {
    const existing = await prisma.deal.findFirst({
      where: { productUrl: deal.productUrl }
    })

    if (!existing) {
      const newDeal = await prisma.deal.create({
        data: deal
      })

      await prisma.priceHistory.create({
        data: {
          dealId: newDeal.id,
          price: deal.currentPrice,
          platform: deal.platform
        }
      })

      console.log(`Added: ${deal.title}`)
    }
  }

  console.log('\nDone! Sample deals added.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
