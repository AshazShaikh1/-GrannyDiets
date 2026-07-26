import * as React from 'react'
import Link from 'next/link'
import { Globe, Camera, MessageSquare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Granny Diets</h3>
            <p className="text-sm text-white/70">
              Authentic, homemade pickles and spices bringing the taste of tradition to your kitchen.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="text-white/70 hover:text-white transition-all hover:scale-110"><Globe className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="text-white/70 hover:text-white transition-all hover:scale-110"><Camera className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" className="text-white/70 hover:text-white transition-all hover:scale-110"><MessageSquare className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>grannydiets70@gmail.com</li>
              <li>+91 7017509340</li>
              <li>Granny Diets Private Limited<br />Plot no – 337/2 Sarkara Chakrajmal<br />Teh Dhampur Distt Bijnor, Uttar Pradesh, 246761</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} Granny Diets Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
