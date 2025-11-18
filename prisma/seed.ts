import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear categorías
  const categories = [
    { name: 'Electrónica', slug: 'electronica', icon: 'monitor' },
    { name: 'Celulares', slug: 'celulares', icon: 'smartphone' },
    { name: 'Computación', slug: 'computacion', icon: 'laptop' },
    { name: 'Videojuegos', slug: 'videojuegos', icon: 'gamepad' },
    { name: 'Hogar', slug: 'hogar', icon: 'home' },
    { name: 'Deportes', slug: 'deportes', icon: 'dumbbell' },
    { name: 'Ropa', slug: 'ropa', icon: 'shirt' },
    { name: 'Otros', slug: 'otros', icon: 'package' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('Categorías creadas')

  // Crear ofertas de ejemplo
  const sampleDeals = [
    {
      title: 'Echo Dot (5ta Generación) - Altavoz inteligente con Alexa',
      description: 'El Echo Dot más popular, ahora con mejor sonido y diseño',
      originalPrice: 59.99,
      currentPrice: 24.99,
      discount: 58,
      imageUrl: 'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=Echo+Dot',
      productUrl: 'https://amazon.com/dp/B09B8V1LZ3',
      affiliateUrl: 'https://amazon.com/dp/B09B8V1LZ3?tag=tuaffiliate-20',
      platform: 'amazon',
      category: 'electronica'
    },
    {
      title: 'Fire TV Stick 4K Max - Streaming con Alexa Voice Remote',
      description: 'Streaming en 4K Ultra HD con soporte Wi-Fi 6',
      originalPrice: 54.99,
      currentPrice: 34.99,
      discount: 36,
      imageUrl: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Fire+TV',
      productUrl: 'https://amazon.com/dp/B08MQZXN1X',
      affiliateUrl: 'https://amazon.com/dp/B08MQZXN1X?tag=tuaffiliate-20',
      platform: 'amazon',
      category: 'electronica'
    },
    {
      title: 'Audífonos Bluetooth TWS con cancelación de ruido',
      description: 'Audífonos inalámbricos con estuche de carga',
      originalPrice: 899,
      currentPrice: 399,
      discount: 56,
      imageUrl: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Audifonos',
      productUrl: 'https://mercadolibre.com/item123',
      affiliateUrl: 'https://mercadolibre.com/item123',
      platform: 'mercadolibre',
      category: 'electronica'
    },
    {
      title: 'Smartphone Samsung Galaxy A54 5G 128GB',
      description: 'Pantalla Super AMOLED de 6.4 pulgadas',
      originalPrice: 8999,
      currentPrice: 6499,
      discount: 28,
      imageUrl: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Galaxy+A54',
      productUrl: 'https://mercadolibre.com/item456',
      affiliateUrl: 'https://mercadolibre.com/item456',
      platform: 'mercadolibre',
      category: 'celulares'
    },
    {
      title: 'Kindle Paperwhite (16 GB) - Con luz cálida ajustable',
      description: 'Pantalla de 6.8" y hasta 10 semanas de batería',
      originalPrice: 139.99,
      currentPrice: 94.99,
      discount: 32,
      imageUrl: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Kindle',
      productUrl: 'https://amazon.com/dp/B08KTZ8249',
      affiliateUrl: 'https://amazon.com/dp/B08KTZ8249?tag=tuaffiliate-20',
      platform: 'amazon',
      category: 'electronica'
    },
    {
      title: 'Control DualSense PS5 - Starlight Blue',
      description: 'Control inalámbrico para PlayStation 5',
      originalPrice: 69.99,
      currentPrice: 49.99,
      discount: 29,
      imageUrl: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=DualSense',
      productUrl: 'https://amazon.com/dp/B0CQKLS4WS',
      affiliateUrl: 'https://amazon.com/dp/B0CQKLS4WS?tag=tuaffiliate-20',
      platform: 'amazon',
      category: 'videojuegos'
    },
    {
      title: 'Laptop Lenovo IdeaPad 3 15" - Ryzen 5, 8GB RAM',
      description: 'Laptop para trabajo y estudio con SSD de 256GB',
      originalPrice: 12999,
      currentPrice: 8999,
      discount: 31,
      imageUrl: 'https://via.placeholder.com/300x300/6366F1/FFFFFF?text=Lenovo',
      productUrl: 'https://mercadolibre.com/item789',
      affiliateUrl: 'https://mercadolibre.com/item789',
      platform: 'mercadolibre',
      category: 'computacion'
    },
    {
      title: 'Aspiradora Robot Xiaomi Mi Robot Vacuum',
      description: 'Aspiradora inteligente con mapeo láser',
      originalPrice: 5999,
      currentPrice: 3999,
      discount: 33,
      imageUrl: 'https://via.placeholder.com/300x300/14B8A6/FFFFFF?text=Robot+Vacuum',
      productUrl: 'https://mercadolibre.com/item101',
      affiliateUrl: 'https://mercadolibre.com/item101',
      platform: 'mercadolibre',
      category: 'hogar'
    }
  ]

  for (const deal of sampleDeals) {
    await prisma.deal.create({
      data: deal
    })
  }

  console.log('Ofertas de ejemplo creadas')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
