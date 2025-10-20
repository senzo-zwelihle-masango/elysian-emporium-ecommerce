import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

import { ProductServer, serializeProducts } from '@/types/store/product'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import ProductContainer from '../product/product-container'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { SparklesIcon } from 'lucide-react'

async function fetchFeaturedProducts(): Promise<ProductServer[]> {
  const products = await prisma.product.findMany({
    where: {
      tag: 'featured',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      brand: {
        select: {
          name: true,
        },
      },
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      category: {
        select: {
          name: true,
        },
      },
      features: true,
      specifications: true,
      content: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      reviews: {
        select: {
          rating: true,
        },
      },
      favorites: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  return products
}

const FeaturedProducts = async () => {
  noStore()
  const rawProducts = await fetchFeaturedProducts()
  // neon is returning decimal so we're serializing the decimal to string
  const products = serializeProducts(rawProducts)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-md'}
      gap={'none'}
      flow={'none'}
      id="featured-products"
      className="space-y-8"
    >
      {/* header */}
      <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
        Featured
      </Heading>
      {/* main */}

      <div className="mb-8">
        <ProductContainer initialProducts={products} />
      </div>

      {/* footer */}

      <Button size={'lg'}>
        <SparklesIcon />
        <Link href={'/products'}>Browse all</Link>
      </Button>
    </Container>
  )
}

export default FeaturedProducts
