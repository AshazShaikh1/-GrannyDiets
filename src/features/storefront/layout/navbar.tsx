'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '@/features/cart/context/cart-context'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Close mobile menu on route change or screen resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { totalItems, toggleCart, isHydrated } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <Image src="/images/logo.png" alt="Granny Diets Logo" width={40} height={40} className="object-contain" />
              <span className="text-lg font-bold text-text-primary sm:text-xl">Granny Diets</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Shop</Link>
              <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/login" className="text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95" onClick={() => setIsMobileMenuOpen(false)}>
              <User className="h-5 w-5" />
            </Link>
            <button 
              className="relative text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer" 
              onClick={() => {
                setIsMobileMenuOpen(false)
                toggleCart(true)
              }}
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg z-40 flex flex-col p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-text-primary hover:text-primary p-2 rounded-md hover:bg-surface transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-text-primary hover:text-primary p-2 rounded-md hover:bg-surface transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-text-primary hover:text-primary p-2 rounded-md hover:bg-surface transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-medium text-text-primary hover:text-primary p-2 rounded-md hover:bg-surface transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
