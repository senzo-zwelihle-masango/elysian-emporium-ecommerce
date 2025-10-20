'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { awardReviewPointsAction } from './order'

export async function createNewReviewAction(productId: string, rating: number, comment: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  if (!productId || !rating || !comment) {
    throw new Error('Missing fields. Please ensure that all fields are filled in!')
  }

  // Validate rating is between 1-5
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }

  // Validate comment length
  if (comment.trim().length < 10) {
    throw new Error('Comment must be at least 10 characters long.')
  }

  if (comment.length > 500) {
    throw new Error('Comment must be less than 500 characters.')
  }

  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: user,
        },
      },
    })

    const isNewReview = !existingReview

    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId,
          userId: user,
        },
      },
      update: {
        rating,
        comment: comment.trim(),
        updatedAt: new Date(),
      },
      create: {
        productId,
        userId: user,
        rating,
        comment: comment.trim(),
      },
    })

    // Award points only for new reviews
    let pointsMessage = ''
    if (isNewReview) {
      const pointsResult = await awardReviewPointsAction(user, productId)
      if (pointsResult.success && 'message' in pointsResult) {
        pointsMessage = ` ${pointsResult.message}`
      }
    }

    revalidatePath(`/product/${productId}`)
    return {
      success: true,
      message: `Review ${isNewReview ? 'submitted' : 'updated'} successfully!${pointsMessage}`,
    }
  } catch (error) {
    console.error('Error creating/updating review:', error)
    throw new Error('Failed to submit review. Please try again.')
  }
}

export async function updateReviewAction(reviewId: string, rating: number, comment: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  if (!reviewId || !rating || !comment) {
    throw new Error('Missing required fields.')
  }

  // Validate rating is between 1-5
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.')
  }

  // Validate comment length
  if (comment.trim().length < 10) {
    throw new Error('Comment must be at least 10 characters long.')
  }

  if (comment.length > 500) {
    throw new Error('Comment must be less than 500 characters.')
  }

  try {
    // Check if the review belongs to the current user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    })

    if (!existingReview) {
      throw new Error('Review not found.')
    }

    if (existingReview.userId !== user) {
      throw new Error('You can only edit your own reviews.')
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment: comment.trim(),
        updatedAt: new Date(),
      },
    })

    revalidatePath(`/product/${existingReview.productId}`)
    return { success: true, message: 'Review updated successfully!' }
  } catch (error) {
    console.error('Error updating review:', error)
    throw new Error('Failed to update review. Please try again.')
  }
}

export async function deleteReviewAction(reviewId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  if (!reviewId) {
    throw new Error('Review ID is required.')
  }

  try {
    // Check if the review belongs to the current user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    })

    if (!existingReview) {
      throw new Error('Review not found.')
    }

    if (existingReview.userId !== user) {
      throw new Error('You can only delete your own reviews.')
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    revalidatePath(`/product/${existingReview.productId}`)
    return { success: true, message: 'Review deleted successfully!' }
  } catch (error) {
    console.error('Error deleting review:', error)
    throw new Error('Failed to delete review. Please try again.')
  }
}

export async function getReviewsForProduct(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export async function getUserReviewForProduct(productId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return null
  }

  const user = session.user.id
  if (!user) return null

  try {
    const review = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: user,
        },
      },
    })

    return review
  } catch (error) {
    console.error('Error fetching user review:', error)
    return null
  }
}
