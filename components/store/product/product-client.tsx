'use client'

import React from 'react'
import ProductDetail from './product-detail'
import { Product } from '@/types/store/product'

interface ProductClientProps {
  product: Product
}

export default function ProductClient({ product }: ProductClientProps) {
  return <ProductDetail product={product} />
}
