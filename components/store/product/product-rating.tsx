import React from 'react'
import { StarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ProductRatingStarsProps {
  rating: number
  reviewCount?: number
  totalStars?: number
  starClassName?: string
  containerClassName?: string
}

const ProductRating = ({
  rating,
  reviewCount,
  totalStars = 5,
  starClassName = 'text-yellow-400',
  containerClassName,
}: ProductRatingStarsProps) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  return (
    <div className={cn('flex items-center gap-2', containerClassName)}>
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, index) => {
          const starNumber = index + 1
          return (
            <StarIcon
              key={index}
              className={cn(
                'h-4 w-4',
                starClassName,
                starNumber <= fullStars
                  ? 'fill-current'
                  : hasHalfStar && starNumber === fullStars + 1
                    ? 'fill-current opacity-50'
                    : 'fill-none'
              )}
            />
          )
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-muted-foreground text-sm">
          {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}

export default ProductRating
