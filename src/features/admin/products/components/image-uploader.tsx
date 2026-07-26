'use client'

import * as React from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type ProductImage } from '../schemas'
import Image from 'next/image'

interface ImageUploaderProps {
  initialImages?: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
}

export function ImageUploader({ initialImages = [], onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = React.useState<ProductImage[]>(initialImages)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    const supabase = createClient()
    const files = Array.from(e.target.files)
    
    const newImages: ProductImage[] = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath)
        newImages.push({
          image_url: publicUrl,
          display_order: images.length + newImages.length,
        })
      }
    }

    const updated = [...images, ...newImages]
    setImages(updated)
    onImagesChange(updated)
    setIsUploading(false)
  }

  const handleRemove = (index: number) => {
    // Note: We are just removing from state. 
    // Actual storage cleanup can be handled via a cron job or webhook later to keep this simple.
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, display_order: i }))
    setImages(updated)
    onImagesChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((img, i) => (
          <div key={img.image_url} className="group relative aspect-square rounded-md border border-border bg-surface overflow-hidden">
            <Image src={img.image_url} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 rounded-full bg-error p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-xs text-white">
              Order: {i}
            </div>
          </div>
        ))}
        
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-background transition-colors hover:bg-surface">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
          ) : (
            <>
              <UploadCloud className="h-6 w-6 text-text-muted mb-2" />
              <span className="text-xs text-text-secondary font-medium">Upload Image</span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}
