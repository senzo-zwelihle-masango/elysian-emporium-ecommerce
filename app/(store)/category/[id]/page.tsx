import React from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'
import { prisma } from '@/lib/prisma/client'
import CategoryClient from '@/components/store/category/category-client'

async function fetchCategoryWithProducts(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
      active: true,
    },
    select: {
      id: true,
      name: true,
      products: {
        where: {
          status: 'active',
        },
        select: {
          id: true,
          name: true,
          slug: true,
          sku: true,
          price: true,
          stock: true,
          productVariant: true,
          productVariantValue: true,
          description: true,
          features: true,
          specifications: true,
          content: true,
          images: true,
          tag: true,
          status: true,
          brand: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!category) {
    return notFound()
  }

  return {
    ...category,
    products: category.products.map((product) => ({
      ...product,
      brand: product.brand.name,
      category: product.category.name,
      price: product.price.toString(),
      reviews: product.reviews,
    })),
  }
}

type CategoryParams = Promise<{ id: string }>

const StoreCategoryIdRoutePage = async ({ params }: { params: CategoryParams }) => {
  noStore()
  const { id: categoryId } = await params
  const categoryData = await fetchCategoryWithProducts(categoryId)

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="category-id"
      className="pt-24"
    >
      <CategoryClient category={categoryData} />
    </Container>
  )
}

export default StoreCategoryIdRoutePage
