export interface Deal {
  id: string
  title: string
  description: string | null
  originalPrice: number
  currentPrice: number
  discount: number
  imageUrl: string | null
  productUrl: string
  affiliateUrl: string
  platform: 'amazon' | 'mercadolibre'
  category: string
  isActive: boolean
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscriber {
  id: string
  email: string | null
  telegramChatId: string | null
  pushSubscription: string | null
  categories: string
  minDiscount: number
  platforms: string
  emailEnabled: boolean
  pushEnabled: boolean
  telegramEnabled: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  isActive: boolean
}

export interface ScrapedDeal {
  title: string
  description?: string
  originalPrice: number
  currentPrice: number
  discount: number
  imageUrl?: string
  productUrl: string
  platform: 'amazon' | 'mercadolibre'
  category: string
}
