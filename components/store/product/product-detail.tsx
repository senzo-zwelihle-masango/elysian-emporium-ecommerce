'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from '@/types/store/product'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import ProductRating from './product-rating'
import ProductQuantity from './product-quantity'
import ProductCartButton from '../cart/product-cart-button'
import FavoriteButton from '../favorite/favorite-button'
import { addNewItemToCartAction } from '@/server/actions/store/cart'
import { useProductInteractions } from '@/hooks/use-product-interactions'
import { ProductShare } from './product-share'
import ProductCarousel from './product-carousel'
import BlockNoteRender from '@/components/tools/blocknote-render'
import { EyeIcon, ShareIcon } from 'lucide-react'
import { trackProductView } from '@/server/actions/store/interaction'

interface ProductDetailProps {
  product: Product
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  // product quantity amount states
  const [quantity, setQuantity] = useState(1)

  // Track product view when component mounts (only once per user)
  useEffect(() => {
    const trackView = async () => {
      try {
        await trackProductView(product.id)
      } catch (error) {
        console.error('Error tracking product view:', error)
      }
    }

    trackView()
  }, [product.id])

  //   grading and types
  const productAverageRating = setAverageRating(product.reviews)
  const productFormattedPrice = formatPrice(product.price)
  const productStockStatus = setStockStatus(product.stock, product.status)
  const productTag = setProductTag(product.tag)

  // Product interactions (views and shares)
  const { viewCount, shareCount, loading } = useProductInteractions(product.id)

  const formAction = async (formData: FormData) => {
    const currentQuantity = quantity
    const productId = formData.get('productId') as string

    if (currentQuantity <= 0) {
      toast.error('Please enter a valid quantity.')
      return
    }
    if (currentQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock.`)
      return
    }

    // Call the Server Cart Action with productId and the currentQuantity state
    const result = await addNewItemToCartAction(productId, currentQuantity)

    if (result?.success) {
      toast.success(`Added ${currentQuantity} item(s) to cart!`, {
        description: product.name,
      })
    } else {
      toast.error('Failed to add item to cart', {
        description: result?.message || 'Please try again',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images Carousel */}
        <div>
          {product.images && product.images.length > 0 ? (
            <ProductCarousel images={product.images} productName={product.name} />
          ) : (
            <div className="bg-muted relative flex aspect-square items-center justify-center overflow-hidden rounded-xl">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-2">{product.brand}</p>
          </div>

          <div className="flex items-center gap-4">
            <ProductRating rating={productAverageRating} reviewCount={product.reviews.length} />
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <EyeIcon className="h-4 w-4" />
              <span>{loading ? '...' : viewCount}</span>
              <span>views</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <ShareIcon className="h-4 w-4" />
              <span>{loading ? '...' : shareCount}</span>
              <span>shares</span>
            </div>
          </div>

          <p className="text-3xl font-bold">{productFormattedPrice}</p>

          <div className="flex flex-wrap gap-2">
            <Badge variant={productStockStatus.isAvailable ? 'default' : 'destructive'}>
              {productStockStatus.label}
            </Badge>
            {productTag.label && <Badge className={productTag.color}>{productTag.label}</Badge>}
          </div>

          <div className="prose prose-sm max-w-none">
            {product.description ? (
              <BlockNoteRender initialContent={product.description} />
            ) : (
              <p className="text-muted-foreground">No description available</p>
            )}
          </div>

          <Separator />

          {/* Action Section */}
          <div className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <ProductQuantity
                quantity={quantity}
                setQuantity={setQuantity}
                maxQuantity={product.stock}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ProductCartButton
                formAction={formAction}
                productId={product.id}
                stock={product.stock}
              />

              <div className="flex gap-3">
                <FavoriteButton
                  productId={product.id}
                  initialIsFavorited={product.isFavorited || false}
                />

                <ProductShare
                  productId={product.id}
                  productName={product.name}
                  productUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.id}`}
                  productImage={product.images?.[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Product Details</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Features</h3>
            <div className="prose prose-sm max-w-none">
              {product.features ? (
                <BlockNoteRender initialContent={product.features} />
              ) : (
                <p className="text-muted-foreground">No features available</p>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Specifications</h3>
            <div className="prose prose-sm max-w-none">
              {product.specifications ? (
                <BlockNoteRender initialContent={product.specifications} />
              ) : (
                <p className="text-muted-foreground">No specifications available</p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        {product.content && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Additional Information</h3>
            <div className="prose max-w-none">
              <BlockNoteRender initialContent={product.content} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProductDetail
