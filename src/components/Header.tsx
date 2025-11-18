'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Tag, Home, Grid } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Tag className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Ofertas Alert</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <Link
              href="/categorias"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Grid className="w-4 h-4" />
              Categorías
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <Link
                href="/categorias"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Grid className="w-4 h-4" />
                Categorías
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
