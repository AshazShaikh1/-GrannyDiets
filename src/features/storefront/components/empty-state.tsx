import * as React from 'react'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StorefrontEmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function StorefrontEmptyState({ title, description, actionLabel, actionHref }: StorefrontEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="mb-6 rounded-full bg-surface p-6 text-text-muted shadow-sm border border-border">
        <SearchX className="h-10 w-10" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-text-primary">{title}</h2>
      <p className="mb-8 max-w-md text-text-secondary">{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
