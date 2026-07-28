'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, Menu, X, ShieldCheck, LogOut } from 'lucide-react'
import { useCart } from '@/features/cart/context/cart-context'
import { logoutAction } from '@/features/auth/actions/auth'

interface NavbarProps {
  isDev?: boolean
  isLoggedIn?: boolean
}

export function Navbar({ isDev = false, isLoggedIn = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

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
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-secondary hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isDev && (
              <Link 
                href="/admin/dashboard" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md transition-all hover:scale-105 active:scale-95"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95" onClick={() => setIsMobileMenuOpen(false)} title="Dashboard">
                  <User className="h-5 w-5" />
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer" aria-label="Log Out" title="Log Out">
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-text-secondary hover:text-primary transition-all hover:scale-110 active:scale-95" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-5 w-5" />
              </Link>
            )}
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
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium p-2 rounded-md transition-colors ${
                  pathname === link.href ? 'text-primary bg-primary/10' : 'text-text-primary hover:text-primary hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isDev && (
              <div className="border-t border-border pt-4 mt-2">
                <Link 
                  href="/admin/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-white bg-primary hover:bg-primary/90 p-2 rounded-md transition-colors"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Go to Admin Panel
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <div className="border-t border-border pt-4 mt-2 flex flex-col gap-4">
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-text-primary hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  My Dashboard
                </Link>
                <form action={logoutAction}>
                  <button 
                    type="submit" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center gap-2 text-base font-medium text-error hover:text-error/80 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </form>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
