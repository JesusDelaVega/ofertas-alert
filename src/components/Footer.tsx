import Link from 'next/link'
import { Tag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold text-white">Ofertas Alert</span>
            </div>
            <p className="text-sm mb-4">
              Encuentra las mejores ofertas de Amazon y Mercado Libre.
              Actualizamos constantemente para traerte los mejores descuentos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-blue-400 transition-colors">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-blue-400 transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-blue-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Ofertas Alert. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Como participante del Programa de Afiliados de Amazon y Mercado Libre,
            ganamos comisiones por compras realizadas a través de nuestros enlaces.
          </p>
        </div>
      </div>
    </footer>
  )
}
