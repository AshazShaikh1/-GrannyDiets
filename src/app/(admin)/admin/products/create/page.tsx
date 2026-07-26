import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/admin/components/page-header'
import { ProductForm } from '@/features/admin/products/components/product-form'

export default async function CreateProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Create Product" description="Add a new product to your catalog." />
      <ProductForm categories={categories || []} />
    </div>
  )
}
