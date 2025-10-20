'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

export interface SearchProduct {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  rating: number
  reviewCount: number
}

export async function searchProducts(query: string, limit: number = 6): Promise<SearchProduct[]> {
  noStore()

  if (!query.trim()) {
    return []
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { name: { contains: query, mode: 'insensitive' } } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
      status: 'active',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return products.map((product) => {
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const reviewCount = product.reviews.length
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      images: product.images,
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviewCount,
    }
  })
}
