'use client'

import { useEffect, useState } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface PriceHistoryItem {
  price: number
  platform: string
  createdAt: string
}

interface PriceStats {
  minPrice: number
  maxPrice: number
  avgPrice: number
  currentPrice: number
  originalPrice: number
  priceChange: number
}

interface PriceChartProps {
  dealId: string
  days?: number
}

export default function PriceChart({ dealId, days = 30 }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistoryItem[]>([])
  const [stats, setStats] = useState<PriceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/deals/${dealId}/history?days=${days}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setHistory(data.history)
        setStats(data.stats)
      } catch {
        setError('No se pudo cargar el historial')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [dealId, days])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 animate-pulse">
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        {error || 'Sin datos de historial'}
      </div>
    )
  }

  // Simple chart using SVG
  const chartWidth = 300
  const chartHeight = 100
  const padding = 10

  let points = ''
  if (history.length > 1) {
    const prices = history.map(h => h.price)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)
    const range = maxP - minP || 1

    points = history
      .map((h, i) => {
        const x = padding + (i / (history.length - 1)) * (chartWidth - 2 * padding)
        const y = chartHeight - padding - ((h.price - minP) / range) * (chartHeight - 2 * padding)
        return `${x},${y}`
      })
      .join(' ')
  }

  const TrendIcon = stats.priceChange < 0 ? TrendingDown : stats.priceChange > 0 ? TrendingUp : Minus
  const trendColor = stats.priceChange < 0 ? 'text-green-600' : stats.priceChange > 0 ? 'text-red-600' : 'text-gray-500'

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-sm mb-3">Historial de Precios ({days} días)</h3>

      {/* Chart */}
      {history.length > 1 ? (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-24 mb-3">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
        </svg>
      ) : (
        <div className="h-24 flex items-center justify-center text-gray-400 text-sm mb-3">
          Se necesitan más datos para mostrar la gráfica
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-2 rounded">
          <span className="text-gray-500">Mínimo</span>
          <p className="font-bold text-green-600">${stats.minPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white p-2 rounded">
          <span className="text-gray-500">Máximo</span>
          <p className="font-bold text-red-600">${stats.maxPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white p-2 rounded">
          <span className="text-gray-500">Promedio</span>
          <p className="font-bold">${stats.avgPrice.toFixed(2)}</p>
        </div>
        <div className="bg-white p-2 rounded">
          <span className="text-gray-500">Tendencia</span>
          <p className={`font-bold flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(stats.priceChange).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Buy recommendation */}
      {stats.currentPrice <= stats.minPrice && (
        <div className="mt-3 bg-green-100 text-green-800 text-xs p-2 rounded text-center font-medium">
          Precio más bajo registrado
        </div>
      )}
    </div>
  )
}
