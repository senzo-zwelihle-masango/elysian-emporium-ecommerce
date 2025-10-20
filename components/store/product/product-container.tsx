'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { Product } from '@/types/store/product'

import ProductGrid from './product-grid'

import { productContainerVariants } from '@/utils/animation/motion'

interface ProductContainerProps {
  initialProducts: Product[]
  title?: string
  subtitle?: string
  showFilters?: boolean
}

const ProductContainer = ({
  initialProducts,
  title,
  subtitle,
  showFilters = false,
}: ProductContainerProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(initialProducts)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [initialProducts])
  return (
    <motion.div initial="hidden" animate="visible" variants={productContainerVariants} className="">
      <ProductGrid
        products={products}
        title={title}
        subtitle={subtitle}
        showFilters={showFilters}
      />

      {/* <div className="text-center mt-12">
        <Button size="lg" variant="outline" effect="shineHover" asChild>
          <Link href="/products">
            View All Products
            <ArrowRightIcon />
          </Link>
        </Button>
      </div> */}
    </motion.div>
  )
}

export default ProductContainer
