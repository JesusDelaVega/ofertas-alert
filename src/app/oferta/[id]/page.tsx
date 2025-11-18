import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Tag, Clock, Store } from 'lucide-react'
import PriceChart from '@/components/PriceChart'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const deal = await prisma.deal.findUnique({
    where: { id },
    select: { title: true, discount: true, currentPrice: true }
  })

  if (!deal) return { title: 'Oferta no encontrada' }

  return {
    title: `${deal.title} - ${deal.discount}% OFF | Ofertas Alert`,
    description: `Ahorra ${deal.discount}% en ${deal.title}. Precio actual: $${deal.currentPrice}. Ver historial de precios y comparativas.`
  }
}

export default async function DealPage({ params }: PageProps) {
  const { id } = await params

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      clicks: {
        select: { id: true }
      }
    }
  })

  if (!deal) notFound()

  // Find similar products for comparison
  const similarDeals = await prisma.deal.findMany({
    where: {
      category: deal.category,
      isActive: true,
      id: { not: deal.id },
      // Try to match by similar title words
      OR: deal.title.split(' ').slice(0, 2).map(word => ({
        title: { contains: word }
      }))
    },
    take: 4,
    orderBy: { discount: 'desc' }
  })

  const savings = deal.originalPrice - deal.currentPrice

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ofertas
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                {deal.imageUrl && (
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{deal.discount}%
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    deal.platform === 'amazon'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {deal.platform === 'amazon' ? 'Amazon' : 'Mercado Libre'}
                  </span>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {deal.category}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {deal.title}
                </h1>

                {deal.description && (
                  <p className="text-gray-600 mb-4">{deal.description}</p>
                )}

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${deal.currentPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                </div>

                <p className="text-green-700 font-medium mb-6">
                  Ahorras ${savings.toFixed(2)} ({deal.discount}% de descuento)
                </p>

                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  Ver Oferta
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Actualizado: {new Date(deal.updatedAt).toLocaleDateString('es-MX')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    {deal.clicks.length} clicks
                  </span>
                </div>
              </div>
            </div>

            {/* Comparativas */}
            {similarDeals.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Productos Similares</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similarDeals.map(similar => (
                    <Link
                      key={similar.id}
                      href={`/oferta/${similar.id}`}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex gap-3">
                        {similar.imageUrl && (
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={similar.imageUrl}
                              alt={similar.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{similar.title}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-green-600 font-bold">
                              ${similar.currentPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-red-500">-{similar.discount}%</span>
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            similar.platform === 'amazon'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {similar.platform === 'amazon' ? 'Amazon' : 'ML'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price history */}
            <PriceChart dealId={deal.id} />

            {/* Quick stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-sm mb-3">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Descuento</span>
                  <span className="font-bold text-red-600">{deal.discount}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ahorro</span>
                  <span className="font-bold text-green-600">${savings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plataforma</span>
                  <span className="font-medium">{deal.platform === 'amazon' ? 'Amazon' : 'Mercado Libre'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className={`font-medium ${deal.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {deal.isActive ? 'Activa' : 'Expirada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Affiliate disclosure */}
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
              <strong>Nota:</strong> Este sitio participa en programas de afiliados.
              Podemos recibir una comisión por compras realizadas a través de nuestros enlaces.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
