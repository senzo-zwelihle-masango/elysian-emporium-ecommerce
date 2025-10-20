'use client'

import React, { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import {
  FilterIcon,
  Grid3X3Icon,
  ListIcon,
  SortAscIcon,
  BoxesIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductCard from './product-card'
import { StoreProductGridSkeleton } from './product-skeleton'

import { Product } from '@/types/store/product'

import {
  gridEmptyStateVariants,
  gridHeaderVariants,
  gridItemVariants,
} from '@/utils/animation/motion'

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  showFilters?: boolean
}

const ProductGrid = ({ products, title, subtitle, showFilters = false }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleViewModeChange = (newMode: 'grid' | 'list') => {
    if (newMode === viewMode) return

    setIsTransitioning(true)

    // Smooth transition with proper timing
    setTimeout(() => {
      setViewMode(newMode)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 200)
  }
  if (products.length === 0) {
    return (
      <div className="space-y-12">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            className="space-y-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={gridHeaderVariants}
          >
            {title && (
              <div className="space-y-2">
                <motion.h1
                  className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {title}
                </motion.h1>
                <motion.div
                  className="to-ultramarine-700 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            )}
            {subtitle && (
              <motion.p
                className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={gridEmptyStateVariants}
        >
          <motion.div
            className="relative mb-8"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="to-ultramarine-700 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500 opacity-80 blur-2xl" />
            <div className="relative rounded-full border p-8 shadow-2xl">
              <BoxesIcon size={30} />
            </div>
          </motion.div>

          <motion.h1
            className="mb-4 text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No products found
          </motion.h1>

          <motion.p
            className="mb-8 max-w-md text-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            We couldn&apos;t find any products matching your criteria. Try adjusting your filters or
            explore our full collection.
          </motion.p>

          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="to-ultramarine-700 hover:from-coral-red-700 hover:to-ultramarine-700 rounded-full bg-gradient-to-r from-blue-500"
              >
                <SparklesIcon className="mr-2" />
                Browse All Products
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    )
  }
  return (
    <div className="w-full max-w-none">
      <div className="space-y-12">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            className="space-y-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={gridHeaderVariants}
          >
            {title && (
              <div className="space-y-2">
                <motion.h1
                  className="text-5xl md:text-6xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {title}
                </motion.h1>
                <motion.div
                  className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 96 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            )}
            {subtitle && (
              <motion.p
                className="mx-auto max-w-3xl text-xl leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* store product toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="w-full shadow-sm">
            <div className="space-y-4 p-4">
              {/* Mobile Layout - Stacked */}
              <div className="flex flex-col space-y-4 sm:hidden">
                {/* Top row - Badge and Search */}
                <div className="flex items-center justify-between gap-3">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium whitespace-nowrap"
                  >
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </Badge>

                  {showFilters && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0"
                    >
                      <Button variant="outline" size="sm" className="rounded-full px-3">
                        <SearchIcon className="mr-1.5 h-4 w-4" />
                        Search
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Bottom row - Filter buttons and view toggle */}
                <div className="flex items-center justify-between">
                  {showFilters && (
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="rounded-full px-3">
                          <SortAscIcon className="mr-1.5 h-4 w-4" />
                          Sort
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="rounded-full px-3">
                          <FilterIcon className="mr-1.5 h-4 w-4" />
                          Filter
                        </Button>
                      </motion.div>
                    </div>
                  )}

                  {/* View mode toggle */}
                  <div className="bg-primary flex items-center rounded-full p-1">
                    <motion.button
                      onClick={() => handleViewModeChange('grid')}
                      className={`rounded-full p-2 transition-all duration-300 ${
                        viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isTransitioning}
                    >
                      <Grid3X3Icon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewModeChange('list')}
                      className={`rounded-full p-2 transition-all duration-300 ${
                        viewMode === 'list' ? 'bg-background shadow-sm' : 'text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isTransitioning}
                    >
                      <ListIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Single Row */}
              <div className="hidden items-center justify-between gap-6 sm:flex">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </Badge>

                  {showFilters && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {showFilters && (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <SortAscIcon className="mr-2 h-4 w-4" />
                          Sort
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <FilterIcon className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </motion.div>
                    </>
                  )}

                  <div className="bg-primary flex items-center rounded-full p-1">
                    <motion.button
                      onClick={() => handleViewModeChange('grid')}
                      className={`rounded-full p-2 transition-all duration-300 ${
                        viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isTransitioning}
                    >
                      <Grid3X3Icon className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewModeChange('list')}
                      className={`rounded-full p-2 transition-all duration-300 ${
                        viewMode === 'list' ? 'bg-background shadow-sm' : 'text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isTransitioning}
                    >
                      <ListIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* products */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <StoreProductGridSkeleton count={products.length} viewMode={viewMode} />
              </motion.div>
            ) : (
              <motion.div
                key={`products-${viewMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                }}
                className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                <LayoutGroup>
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      variants={gridItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{
                        layout: {
                          type: 'spring',
                          stiffness: 100,
                          damping: 15,
                          duration: 0.6,
                        },
                      }}
                      className="h-full"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ProductGrid
