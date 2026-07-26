import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: '404 - Page Not Found | Granny Diets',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 rounded-full bg-surface p-6 text-text-muted animate-in zoom-in">
        <FileQuestion className="h-16 w-16" />
      </div>
      <h1 className="mb-2 text-4xl font-black text-text-primary tracking-tight">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-text-primary">Page Not Found</h2>
      <p className="mb-8 text-lg text-text-secondary max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Back to Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Browse Pickles
          </Button>
        </Link>
      </div>
    </div>
  )
}
