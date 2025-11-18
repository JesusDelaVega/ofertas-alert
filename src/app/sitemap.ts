import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ofertas-alert.com'

  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Páginas de categorías
  const categories = ['electronica', 'celulares', 'computacion', 'videojuegos', 'hogar', 'deportes', 'ropa']
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages]
}
