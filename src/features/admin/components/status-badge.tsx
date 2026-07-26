import * as React from 'react'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase()
  
  let colorClass = 'bg-background text-text-secondary border-border'
  
  if (['active', 'delivered', 'paid', 'success'].includes(normalized)) {
    colorClass = 'bg-success/15 text-success border-success/30'
  } else if (['inactive', 'cancelled', 'failed', 'error'].includes(normalized)) {
    colorClass = 'bg-error/15 text-error border-error/30'
  } else if (['pending', 'processing', 'shipped'].includes(normalized)) {
    colorClass = 'bg-warning/15 text-warning border-warning/30'
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
