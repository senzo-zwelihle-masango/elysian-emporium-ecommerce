'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  EyeIcon,
  ShareIcon,
  ShoppingCartIcon,
  HeartIcon,
  TrendingUpIcon,
  StarIcon,
} from 'lucide-react'
import { useProductInteractions } from '@/hooks/use-product-interactions'

interface ProductInteractionsProps {
  productId: string
  productName: string
}

export function ProductInteractions({ productId, productName }: ProductInteractionsProps) {
  const { stats, loading } = useProductInteractions(productId)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Interactions</CardTitle>
          <CardDescription>Tracking engagement for {productName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeIcon className="text-muted-foreground h-4 w-4" />
                <span>View(s)</span>
              </div>
              <div className="bg-muted h-4 w-8 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShareIcon className="text-muted-foreground h-4 w-4" />
                <span>Shares</span>
              </div>
              <div className="bg-muted h-4 w-8 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="text-muted-foreground h-4 w-4" />
                <span>Add to Cart</span>
              </div>
              <div className="bg-muted h-4 w-8 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartIcon className="text-muted-foreground h-4 w-4" />
                <span>Favorites</span>
              </div>
              <div className="bg-muted h-4 w-8 animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate engagement rate
  const totalInteractions = stats.views + stats.shares + stats.addToCart + stats.favorites
  const engagementRate = stats.views > 0 ? Math.round((totalInteractions / stats.views) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Interactions</CardTitle>
        <CardDescription>Tracking engagement for {productName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeIcon className="text-muted-foreground h-4 w-4" />
              <span>Views</span>
            </div>
            <span className="font-medium">{stats.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShareIcon className="text-muted-foreground h-4 w-4" />
              <span>Shares</span>
            </div>
            <span className="font-medium">{stats.shares.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="text-muted-foreground h-4 w-4" />
              <span>Add to Cart</span>
            </div>
            <span className="font-medium">{stats.addToCart.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartIcon className="text-muted-foreground h-4 w-4" />
              <span>Favorites</span>
            </div>
            <span className="font-medium">{stats.favorites.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StarIcon className="text-muted-foreground h-4 w-4" />
              <span>Reviews</span>
            </div>
            <span className="font-medium">{stats.reviews.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="text-muted-foreground h-4 w-4" />
              <span>Engagement Rate</span>
            </div>
            <span className="font-medium">{engagementRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
