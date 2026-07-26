'use client'

import * as React from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: { id: string; image_url: string; display_order: number }[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
  const defaultImage = sortedImages[0]?.image_url || '/images/placeholder.png'
  const [activeImage, setActiveImage] = React.useState(defaultImage)

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-surface">
        <Image 
          src={activeImage} 
          alt="Product image" 
          fill 
          className="object-cover transition-opacity duration-300" 
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {sortedImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.image_url)}
              className={`relative aspect-square h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                activeImage === img.image_url ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
            >
              <Image 
                src={img.image_url} 
                alt="Thumbnail" 
                fill 
                className="object-cover" 
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
