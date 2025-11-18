import Link from 'next/link'
import {
  Smartphone,
  Monitor,
  Gamepad2,
  Home,
  Dumbbell,
  Shirt,
  Gift,
  Tag
} from 'lucide-react'

const categories = [
  { name: 'Electrónica', slug: 'electronica', icon: Monitor, color: 'bg-blue-500' },
  { name: 'Celulares', slug: 'celulares', icon: Smartphone, color: 'bg-green-500' },
  { name: 'Computación', slug: 'computacion', icon: Monitor, color: 'bg-purple-500' },
  { name: 'Videojuegos', slug: 'videojuegos', icon: Gamepad2, color: 'bg-red-500' },
  { name: 'Hogar', slug: 'hogar', icon: Home, color: 'bg-yellow-500' },
  { name: 'Deportes', slug: 'deportes', icon: Dumbbell, color: 'bg-orange-500' },
  { name: 'Ropa', slug: 'ropa', icon: Shirt, color: 'bg-pink-500' },
  { name: 'Otros', slug: 'otros', icon: Gift, color: 'bg-gray-500' }
]

export const metadata = {
  title: 'Categorías - Ofertas Alert',
  description: 'Explora ofertas por categoría. Encuentra descuentos en electrónica, celulares, computación, videojuegos y más.'
}

export default function CategoriasPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Tag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Categorías
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora las mejores ofertas organizadas por categoría.
            Encuentra exactamente lo que buscas con los mejores descuentos.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/?category=${category.slug}`}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
