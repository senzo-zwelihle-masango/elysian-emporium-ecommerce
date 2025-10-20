'use server'

import { unstable_noStore as noStore } from 'next/cache'

import { ProductTag } from '@/lib/generated/prisma'
import type { Prisma, ProductTag as ProductTagType } from '@/lib/generated/prisma'

import { prisma } from '@/lib/prisma/client'

import { ProductFilterParams, ProductServer } from '@/types/store/product'

export async function fetchProducts(params: ProductFilterParams): Promise<ProductServer[]> {
  noStore()

  const { search, category, minPrice, maxPrice, sortBy, tag, brand } = params

  const where: Prisma.ProductWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { name: { contains: search, mode: 'insensitive' } } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { name: category }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) {
      where.price.gte = minPrice
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice
    }
  }

  if (tag) {
    where.tag = tag as ProductTagType
  }

  if (brand) {
    where.brand = {
      name: brand,
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
    createdAt: 'desc',
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'name-asc':
        orderBy = { name: 'asc' }
        break
      case 'name-desc':
        orderBy = { name: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
        break
    }
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      brand: {
        select: {
          id: true,
          name: true,
        },
      },
      price: true,
      stock: true,
      productVariant: true,
      productVariantValue: true,
      description: true,
      category: true,
      features: true,
      specifications: true,
      content: true,
      images: true,
      tag: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      swatch: {
        select: {
          id: true,
          productId: true,
          type: true,
          name: true,
          value: true,
          images: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      favorites: true,
    },
    orderBy,
  })
  return products
}

export async function fetchAllCategories(): Promise<string[]> {
  noStore()
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    select: {
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return categories.map((category) => category.name)
}

export async function fetchAllTags(): Promise<ProductTag[]> {
  return Object.values(ProductTag)
}

export async function fetchAllBrands(): Promise<string[]> {
  noStore()
  const brands = await prisma.brand.findMany({
    select: {
      name: true,
    },
    where: {
      active: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return brands.map((brand) => brand.name)
}
