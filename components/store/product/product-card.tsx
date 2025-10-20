'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ClockIcon, EyeIcon, PackageIcon, StarIcon, ZapIcon, ShareIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import {
  formatPrice,
  Product,
  setAverageRating,
  setProductTag,
  setStockStatus,
} from '@/types/store/product'

import { useProductInteractions } from '@/hooks/use-product-interactions'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const productAverageRating = setAverageRating(product.reviews)
  const productFormattedPrice = formatPrice(product.price)
  const productStockStatus = setStockStatus(product.stock, product.status)
  const productTag = setProductTag(product.tag)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { viewCount, shareCount, loading } = useProductInteractions(product.id)

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card className="group bg-card overflow-hidden border shadow-md transition-all duration-500 hover:shadow-xl">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-square md:w-80">
                <Link href={`/product/${product.id}`}>
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={product.images[0] || '/svg/vercel-placeholder.svg?height=400&width=400'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />

                    {/* Gradient Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <AnimatePresence>
                    {product.tag === 'new' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Badge className="rounded-full py-1 shadow-lg">
                          <ZapIcon className="mr-1 h-3 w-3" />
                          New
                        </Badge>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: 0.1,
                      }}
                    >
                      {productTag.label && (
                        <Badge className={`${productTag.color} text-white`}>
                          {productTag.label}
                        </Badge>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-8">
                <div className="space-y-4">
                  {/* Brand & Category */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <p className="text-primary text-sm font-medium tracking-wide">
                      {product.brand}
                    </p>
                    <Badge variant="outline">{product.category}</Badge>
                  </motion.div>

                  {/* Product Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <h3 className="hover:text-primary line-clamp-2 text-2xl leading-tight font-bold transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </motion.div>

                  {/* SKU */}
                  <motion.div
                    className="text-muted-foreground text-xs"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <span>SKU: {product.sku}</span>
                  </motion.div>

                  {/* Description */}

                  {/* Rating */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                        >
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(productAverageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </motion.div>
                      ))}
                      <span className="text-muted-foreground text-sm">
                        {productAverageRating.toFixed(1)} ({product.reviews.length} reviews)
                      </span>
                    </div>
                  </motion.div>

                  {/* Price & Status */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <span className="text-primary text-3xl font-bold">{productFormattedPrice}</span>
                    {productStockStatus.label && (
                      <Badge className={`${productStockStatus.color} text-white`}>
                        {productStockStatus.label}
                      </Badge>
                    )}
                  </motion.div>

                  {/* Views and Share */}
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      <span>{loading ? '...' : viewCount}</span>
                      <span>views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShareIcon className="h-4 w-4" />
                      <span>{loading ? '...' : shareCount}</span>
                      <span>shares</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <motion.div
                  className="mt-auto w-full pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <Link href={`/product/${product.id}`} className="w-full">
                    {productStockStatus.isAvailable ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button size="lg" className="w-full">
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View Product
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full"
                      >
                        <Button disabled className="w-full">
                          {product.status === 'comingsoon' ? (
                            <>
                              <ClockIcon className="mr-2 h-4 w-4" />
                              Coming Soon
                            </>
                          ) : (
                            <>
                              <PackageIcon className="mr-2 h-4 w-4" />
                              Out of Stock
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group bg-card relative flex h-full flex-col overflow-hidden border shadow-md transition-all duration-500 hover:shadow-xl">
        <AspectRatio ratio={1} className="relative overflow-hidden rounded-t-xl">
          {/* product image */}
          <Link href={`/product/${product.id}`}>
            <motion.div
              className="relative aspect-square overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={
                  product.images[currentImageIndex] ||
                  '/svg/vercel-placeholder.svg?height=400&width=320'
                }
                alt={product.name}
                fill
                quality={95}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
          {/* product badges */}
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <AnimatePresence>
              {product.tag === 'new' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Badge className="rounded-full py-1 shadow-lg">
                    <ZapIcon className="mr-1 h-3 w-3" />
                    New
                  </Badge>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                {productTag.label && (
                  <Badge className={`${productTag.color}`}>{productTag.label}</Badge>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Image Dots */}
          {product.images.length > 1 && (
            <motion.div
              className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {product.images.slice(0, 4).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </AspectRatio>
        {/* content */}
        <CardContent className="flex flex-1 flex-col space-y-4 p-6">
          {/* Product Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link href={`/product/${product.id}`}>
              <h3 className="line-clamp-2 min-h-[2rem] font-[family-name:var(--font-PolySansBulky)] text-xl leading-tight transition-colors">
                {product.name}
              </h3>
            </Link>
          </motion.div>
          {/* Brand & Category */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="text-primary text-sm tracking-wide">{product.brand}</p>
            <Badge variant="outline">{product.category}</Badge>
          </motion.div>
          {/* SKU & Variant */}
          <motion.div
            className="flex items-center justify-between text-xs"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <span className="text-muted-foreground">SKU: {product.sku}</span>
            {product.productVariant && (
              <div className="flex items-center gap-1">
                <span>{product.productVariant}</span>
                {product.productVariantValue && (
                  <motion.div
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.productVariantValue }}
                    title={product.productVariantValue}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
              </div>
            )}
          </motion.div>

          {/* Rating & Stats */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
                >
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(productAverageRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>
              ))}
              <span className="text-muted-foreground text-sm">
                {productAverageRating.toFixed(1)} ({product.reviews.length} Reviews)
              </span>
            </div>
          </motion.div>

          {/* Price & Status */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <span className="text-2xl font-bold">{productFormattedPrice}</span>
            {productStockStatus.label && (
              <Badge className={`${productStockStatus.color}`}>{productStockStatus.label}</Badge>
            )}
          </motion.div>

          {/* Views and Share */}
          <motion.div
            className="text-muted-foreground flex items-center justify-between text-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              <span>{loading ? '...' : viewCount}</span>
              <span>view(s)</span>
            </div>
            <div className="flex items-center gap-1">
              <ShareIcon className="h-4 w-4" />
              <span>{loading ? '...' : shareCount}</span>
              <span>shares</span>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <motion.div
            className="w-full space-y-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            {/* Action buttons row */}
            <Link href={`/product/${product.id}`} className="w-full">
              {productStockStatus.isAvailable ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button size="lg" className="w-full">
                    View
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button disabled className="w-full">
                    {product.status === 'comingsoon' ? (
                      <>
                        <ClockIcon className="mr-2 h-4 w-4" />
                        Coming Soon
                      </>
                    ) : (
                      <>
                        <PackageIcon className="mr-2 h-4 w-4" />
                        Out of Stock
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProductCard
