'use client'

import * as React from 'react'
import { Menu, UserCircle } from 'lucide-react'
import Link from 'next/link'

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 sm:justify-end">
      <div className="flex items-center gap-4 sm:hidden">
        <button 
          onClick={onMenuClick}
          className="text-text-secondary hover:text-text-primary"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
          Granny
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-text-muted" />
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-medium text-text-primary">Admin User</span>
            <span className="text-xs text-text-muted">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  )
}
