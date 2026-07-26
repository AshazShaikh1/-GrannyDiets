import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-text-secondary animate-pulse">Loading...</p>
    </div>
  )
}
