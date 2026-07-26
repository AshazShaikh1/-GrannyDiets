'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-error/10 p-6 text-error">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-text-primary">Something went wrong!</h2>
      <p className="mb-8 max-w-md text-text-secondary">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <Button variant="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
