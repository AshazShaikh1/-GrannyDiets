import * as React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, ShoppingBag, MapPin, User, LogOut } from 'lucide-react'
import { logoutAction } from '@/features/auth/actions/auth'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'My Account | Granny Diets',
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login?redirect=/dashboard')
  }

  // Fetch profile to greet the user
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] || 'Guest'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">My Account</h1>
        <p className="text-text-secondary mt-1">Welcome back, {firstName}!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-text-secondary hover:bg-surface hover:text-primary transition-colors whitespace-nowrap lg:whitespace-normal"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            ))}
            <div className="hidden lg:block h-px w-full bg-border my-4" />
            <form action={logoutAction} className="hidden lg:block">
              <button 
                type="submit" 
                className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-error hover:bg-error/10 transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                Sign Out
              </button>
            </form>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 bg-surface rounded-xl border border-border p-6 sm:p-8 min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  )
}
