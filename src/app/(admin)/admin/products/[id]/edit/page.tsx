import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/admin/components/page-header'
import { ProductForm } from '@/features/admin/products/components/product-form'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: images } = await supabase
    .from('product_images')
    .select('id, image_url, display_order')
    .eq('product_id', params.id)
    .order('display_order')

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Product" description={`Update details for ${product.name}.`} />
      <ProductForm 
        initialData={product} 
        initialImages={images || []}
        categories={categories || []} 
      />
    </div>
  )
}
