'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error)
  }, [error])

  return (
    <html>
      <body className="font-sans antialiased bg-background text-text-primary min-h-screen flex flex-col items-center justify-center">
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95">
          <div className="mb-6 rounded-full bg-error/10 p-6 text-error">
            <AlertCircle className="h-16 w-16" />
          </div>
          <h1 className="mb-2 text-3xl font-black text-text-primary tracking-tight">Something went wrong!</h1>
          <p className="mb-8 text-text-secondary max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="lg" onClick={() => reset()} className="w-full sm:w-auto">
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
