'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Clock, Tag, History } from 'lucide-react'

interface DealCardProps {
  id: string
  title: string
  description?: string | null
  originalPrice: number
  currentPrice: number
  discount: number
  imageUrl?: string | null
  affiliateUrl: string
  platform: string
  category: string
  expiresAt?: Date | null
}

export default function DealCard({
  id,
  title,
  description,
  originalPrice,
  currentPrice,
  discount,
  imageUrl,
  affiliateUrl,
  platform,
  category,
  expiresAt
}: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = async () => {
    // Registrar click
    try {
      await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: id, source: 'web' })
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }

    // Abrir enlace
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-xl transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge de descuento */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </span>
        </div>

        {/* Badge de plataforma */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            platform === 'amazon'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {platform === 'amazon' ? 'Amazon' : 'Mercado Libre'}
          </span>
        </div>

        {/* Imagen */}
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={300}
              height={300}
              className="object-contain p-4"
              unoptimized
            />
          ) : (
            <div className="text-gray-400 text-sm">Sin imagen</div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Categoría */}
        <div className="flex items-center gap-1 mb-2">
          <Tag className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500 capitalize">{category}</span>
        </div>

        {/* Título */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">
          {title}
        </h3>

        {/* Precios */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              ${currentPrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-green-600 font-medium">
            Ahorras ${(originalPrice - currentPrice).toFixed(2)}
          </p>
        </div>

        {/* Expiración */}
        {expiresAt && (
          <div className="flex items-center gap-1 text-xs text-orange-600 mb-3">
            <Clock className="w-3 h-3" />
            <span>Expira pronto</span>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            href={`/oferta/${id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" />
            Detalles
          </Link>
          <button
            onClick={handleClick}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Comprar
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
