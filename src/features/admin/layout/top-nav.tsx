'use client'

import * as React from 'react'
import { Menu, UserCircle } from 'lucide-react'

export function TopNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 sm:justify-end">
      <button className="sm:hidden text-text-secondary hover:text-text-primary">
        <Menu className="h-6 w-6" />
      </button>
      
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
