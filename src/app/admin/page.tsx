'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  Tag,
  MousePointer,
  RefreshCw
} from 'lucide-react'

interface Stats {
  totalDeals: number
  activeDeals: number
  totalClicks: number
}

interface Deal {
  id: string
  title: string
  platform: string
  discount: number
  currentPrice: number
  isActive: boolean
  createdAt: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentDeals, setRecentDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScraping, setIsScraping] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch recent deals
      const dealsRes = await fetch('/api/deals?limit=10')
      if (dealsRes.ok) {
        const dealsData = await dealsRes.json()
        setRecentDeals(dealsData.deals)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function runScraper() {
    setIsScraping(true)
    try {
      const res = await fetch('/api/cron/scrape')
      const data = await res.json()
      alert(`Scraping completado: ${data.newDeals} nuevas ofertas, ${data.updatedDeals} actualizadas`)
      fetchData()
    } catch (error) {
      console.error('Error running scraper:', error)
      alert('Error al ejecutar el scraper')
    } finally {
      setIsScraping(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={runScraper}
            disabled={isScraping}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
            {isScraping ? 'Scraping...' : 'Ejecutar Scraper'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ofertas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalDeals || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ofertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeDeals || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalClicks || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Ofertas Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDeals.map((deal) => (
                  <tr key={deal.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{deal.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{deal.platform}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        -{deal.discount}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${deal.currentPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        deal.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentDeals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay ofertas. Ejecuta el scraper para obtener ofertas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
