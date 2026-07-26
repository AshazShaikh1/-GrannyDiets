import * as React from 'react'
import { LucideIcon } from 'lucide-react'

interface TrustBadgeProps {
  icon: LucideIcon
  title: string
  description: string
}

export function TrustBadge({ icon: Icon, title, description }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-surface border border-border shadow-sm transition-transform hover:-translate-y-1">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="mb-2 text-base font-semibold text-text-primary">{title}</h4>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  )
}
