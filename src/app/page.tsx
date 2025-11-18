import { prisma } from '@/lib/prisma'
import DealCard from '@/components/DealCard'
import AdBanner from '@/components/AdBanner'
import { Zap, TrendingDown, ShoppingCart, Shield } from 'lucide-react'

async function getDeals() {
  const deals = await prisma.deal.findMany({
    where: { isActive: true },
    orderBy: [
      { discount: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 20
  })
  return deals
}

export default async function HomePage() {
  const deals = await getDeals()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Las Mejores Ofertas al Instante
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Encuentra descuentos increíbles en Amazon y Mercado Libre.
              Actualizamos las ofertas constantemente para que no te pierdas ninguna.
            </p>
            <a
              href="#ofertas"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
              Ver Ofertas
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Actualización Constante</h3>
              <p className="text-sm text-gray-600">Ofertas frescas cada hora</p>
            </div>
            <div className="text-center">
              <TrendingDown className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Grandes Descuentos</h3>
              <p className="text-sm text-gray-600">Hasta 80% de ahorro</p>
            </div>
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Dos Plataformas</h3>
              <p className="text-sm text-gray-600">Amazon y Mercado Libre</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">100% Confiable</h3>
              <p className="text-sm text-gray-600">Ofertas verificadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Ad Banner */}
      <section className="py-4 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner slot="1234567890" format="auto" />
        </div>
      </section>

      {/* Deals Grid */}
      <section id="ofertas" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ofertas Destacadas
          </h2>

          {deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  title={deal.title}
                  description={deal.description}
                  originalPrice={deal.originalPrice}
                  currentPrice={deal.currentPrice}
                  discount={deal.discount}
                  imageUrl={deal.imageUrl}
                  affiliateUrl={deal.affiliateUrl}
                  platform={deal.platform}
                  category={deal.category}
                  expiresAt={deal.expiresAt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No hay ofertas disponibles en este momento.
              </p>
              <p className="text-sm text-gray-500">
                Vuelve pronto, actualizamos las ofertas constantemente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Middle Ad */}
      <section className="py-4 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner slot="0987654321" format="horizontal" />
        </div>
      </section>

      {/* More deals could go here */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ¿Buscas algo específico?
          </h2>
          <p className="text-gray-600 mb-6">
            Explora nuestras categorías para encontrar exactamente lo que necesitas
          </p>
          <a
            href="/categorias"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Ver Categorías
          </a>
        </div>
      </section>

      {/* Bottom Ad */}
      <section className="py-4 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner slot="1122334455" format="auto" />
        </div>
      </section>
    </div>
  )
}
