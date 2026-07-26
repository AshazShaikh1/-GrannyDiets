'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/features/auth/components/form-error'
import { productSchema, type ProductSchema, type ProductImage } from '../schemas'
import { createProductAction, updateProductAction } from '../actions'
import { ImageUploader } from './image-uploader'
import { toast } from 'sonner'

interface ProductFormProps {
  initialData?: ProductSchema & { id: string }
  initialImages?: ProductImage[]
  categories: { id: string, name: string }[]
}

export function ProductForm({ initialData, initialImages = [], categories }: ProductFormProps) {
  const router = useRouter()
  const [error, setError] = React.useState<string>()
  const [images, setImages] = React.useState<ProductImage[]>(initialImages)

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '', slug: '', category_id: '', mrp: 0, selling_price: 0, stock: 0, is_featured: false, is_active: true
    }
  })

  // Auto-generate slug from name
  const name = watch('name')
  React.useEffect(() => {
    if (!initialData && name) {
      setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }, [name, initialData, setValue])

  const onSubmit = async (data: ProductSchema) => {
    setError(undefined)
    
    let res;
    if (initialData) {
      res = await updateProductAction(initialData.id, data, images)
    } else {
      res = await createProductAction(data, images)
    }

    if (res.error) {
      setError(res.error)
      toast.error(res.error)
    } else {
      toast.success(initialData ? 'Product updated successfully' : 'Product created successfully')
      router.push('/admin/products')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FormError message={error} />
      
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Name</label>
            <Input error={!!errors.name} {...register('name')} />
            {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Slug</label>
            <Input error={!!errors.slug} {...register('slug')} />
            {errors.slug && <p className="text-xs text-error">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Category</label>
            <select
              className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              {...register('category_id')}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-error">{errors.category_id.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-4">Pricing & Inventory</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">MRP (₹)</label>
            <Input type="number" step="0.01" error={!!errors.mrp} {...register('mrp', { valueAsNumber: true })} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Selling Price (₹)</label>
            <Input type="number" step="0.01" error={!!errors.selling_price} {...register('selling_price', { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Stock Quantity</label>
            <Input type="number" error={!!errors.stock} {...register('stock', { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-4">Images</h2>
        <ImageUploader initialImages={images} onImagesChange={setImages} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-4">Details</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Short Description</label>
          <Input error={!!errors.short_description} {...register('short_description')} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Full Description</label>
          <textarea
            className="flex min-h-25 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus"
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Ingredients</label>
          <Input error={!!errors.ingredients} {...register('ingredients')} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Weight Value</label>
            <Input type="number" step="0.1" error={!!errors.weight_value} {...register('weight_value', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Weight Unit (e.g. g, ml)</label>
            <Input error={!!errors.weight_unit} {...register('weight_unit')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Shelf Life</label>
            <Input placeholder="e.g. 6 Months" error={!!errors.shelf_life} {...register('shelf_life')} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm">
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <input type="checkbox" {...register('is_featured')} className="h-4 w-4 rounded border-border text-primary focus:ring-focus" />
          Featured Product
        </label>
        
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <input type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-border text-primary focus:ring-focus" />
          Active Status
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
