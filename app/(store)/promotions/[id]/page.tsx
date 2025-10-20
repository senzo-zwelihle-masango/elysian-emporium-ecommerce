import React from 'react'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'
import { prisma } from '@/lib/prisma/client'
import PromotionClient from '@/components/store/promotion/promotion-client'

async function fetchPromotion(promotionId: string) {
  const promotion = await prisma.promotion.findUnique({
    where: {
      id: promotionId,
      active: true,
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      brand: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
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
          createdAt: true,
          updatedAt: true,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!promotion) {
    return notFound()
  }

  return {
    ...promotion,
    products: promotion.products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand.name,
      price: product.price.toString(),
      stock: product.stock,
      productVariant: product.productVariant,
      productVariantValue: product.productVariantValue,
      description: product.description,
      category: product.category.name,
      features: product.features,
      specifications: product.specifications,
      content: product.content,
      images: product.images,
      tag: product.tag,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      reviews: product.reviews,
    })),
  }
}

type PromotionParams = Promise<{ id: string }>

const PromotionPage = async ({ params }: { params: PromotionParams }) => {
  noStore()
  const { id: promotionId } = await params
  const promotion = await fetchPromotion(promotionId)

  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="promotion-detail"
      className="pt-24 pb-12"
    >
      <PromotionClient promotion={promotion} />
    </Container>
  )
}

export default PromotionPage
