'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  responsive?: boolean
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID

  if (!clientId) {
    // Placeholder cuando no hay client ID configurado
    return (
      <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 text-sm">
          Espacio publicitario
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Configura NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
        </p>
      </div>
    )
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
