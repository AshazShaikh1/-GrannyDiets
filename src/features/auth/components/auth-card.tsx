import * as React from 'react'
import Link from 'next/link'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  description?: string
  footerText?: string
  footerLink?: string
  footerLinkText?: string
}

export function AuthCard({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md space-y-6 rounded-lg bg-card p-8 shadow-sm border border-border">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-text-muted">{description}</p>
        )}
      </div>
      
      {children}
      
      {(footerText || footerLink) && (
        <div className="text-center text-sm text-text-secondary">
          {footerText}{' '}
          {footerLink && footerLinkText && (
            <Link href={footerLink} className="font-medium text-primary hover:underline">
              {footerLinkText}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
