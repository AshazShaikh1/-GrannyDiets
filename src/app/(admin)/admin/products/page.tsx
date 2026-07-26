import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/admin/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProductListClient } from '@/features/admin/products/components/product-list-client'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Products" 
        description="Manage your product catalog, prices, and inventory." 
        action={
          <Link href="/admin/products/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <ProductListClient products={products || []} />
    </div>
  )
}
