'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface ShopFiltersProps {
  categories: { id: string; name: string }[]
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialSearch = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [search, setSearch] = React.useState(initialSearch)
  const debouncedSearch = useDebounce(search, 300)

  // Update URL when search changes (debounced)
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }
    
    // Use replace to avoid filling history with every keystroke
    router.replace(`/shop?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]) // searchParams intentionally omitted to avoid loops

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface p-4 rounded-lg border border-border shadow-sm">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="category" className="text-sm font-medium text-text-secondary whitespace-nowrap">
          Filter by:
        </label>
        <select
          id="category"
          defaultValue={initialCategory}
          onChange={handleCategoryChange}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[150px]"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
