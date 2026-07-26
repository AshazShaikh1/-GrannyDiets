'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-text-primary group-[.toaster]:border-border shadow-lg",
          description: "group-[.toast]:text-text-secondary",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-surface group-[.toast]:text-text-secondary",
          success: "group-[.toaster]:border-success/50",
          error: "group-[.toaster]:border-error/50",
        },
      }}
    />
  )
}
