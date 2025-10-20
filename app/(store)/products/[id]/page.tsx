import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'

import { Separator } from '@/components/ui/separator'

import { prisma } from '@/lib/prisma/client'
import ProductClient from '@/components/store/product/product-client'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ReviewList } from '@/components/store/review/review-list'
import CreateReviewForm from '@/components/forms/create/create-review'
import { Product } from '@/types/store/product'
import { ReviewListProps } from '@/interfaces/review'

async function fetchProduct({
  productId,
  userId,
}: {
  productId: string
  userId: string | null
}): Promise<Product & { fullReviews: ReviewListProps['reviews'] }> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
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
          id: true,
          rating: true,
          comment: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      favorites: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  })

  if (!product) {
    return notFound()
  }

  return {
    ...product,
    brand: product.brand.name,
    category: product.category.name,
    price: product.price.toString(),
    reviews: product.reviews.map((r) => ({ rating: r.rating })),
    fullReviews: product.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        name: review.user.name,
        image: review.user.image ?? null,
      },
    })),
    isFavorited: product.favorites ? product.favorites.length > 0 : false,
  }
}

type StoreParams = Promise<{ id: string }> // Keeping your exact params type

const StoreProductIdRoutePage = async ({ params }: { params: StoreParams }) => {
  noStore()
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user.id

  const { id: productId } = await params
  const product = await fetchProduct({
    productId,
    userId: user || null,
  })

  // Calculate average rating and total reviews from the full reviews
  const totalReviews = product.fullReviews.length
  const averageRating =
    totalReviews > 0 ? product.fullReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0

  // Check if the current user has already reviewed this product
  const userReview = user
    ? product.fullReviews.find((review) => review.user.id === user)
    : undefined

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="product-id"
      className="pt-24"
    >
      <ProductClient product={product} />

      <Separator className="my-10" />

      {/* Reviews Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex items-center justify-center lg:col-span-1">
          <div className="w-full max-w-md">
            {user ? (
              <CreateReviewForm
                productId={product.id}
                userId={user}
                existingRating={userReview?.rating}
                existingComment={userReview?.comment}
              />
            ) : (
              <div className="bg-card rounded-lg border p-6 text-center shadow-sm">
                <p className="text-muted-foreground">
                  <Link href="/api/auth/login" className="text-primary hover:underline">
                    Log in
                  </Link>{' '}
                  to write a review.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ReviewList
            reviews={product.fullReviews}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        </div>
      </div>
    </Container>
  )
}

export default StoreProductIdRoutePage
