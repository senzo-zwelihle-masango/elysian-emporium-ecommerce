'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { ProductInteractionType } from '@/lib/generated/prisma'

import { awardProductInteractionPoints } from '@/server/actions/user/rewards'

// Track product view - only once per user
export async function trackProductView(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // Check if user has already viewed this product
    const existingView = await prisma.productInteraction.findFirst({
      where: {
        productId,
        userId: session?.user?.id || 'anonymous',
        type: ProductInteractionType.view,
      },
    })

    // If user has already viewed this product, don't track again
    if (existingView) {
      return { success: true, isNewView: false }
    }

    // Create interaction record
    await prisma.productInteraction.create({
      data: {
        productId,
        userId: session?.user?.id || 'anonymous',
        type: ProductInteractionType.view,
      },
    })

    // Award points for viewing (if user is logged in and it's their first view)
    if (session?.user?.id) {
      await awardProductInteractionPoints()
    }

    return { success: true, isNewView: true }
  } catch (error) {
    console.error('Error tracking product view:', error)
    return {
      success: false,
      error: 'Failed to track product view',
      isNewView: false,
    }
  }
}

// Get unique product view count
export async function getProductViewCount(productId: string) {
  try {
    const viewCount = await prisma.productInteraction.count({
      where: {
        productId,
        type: ProductInteractionType.view,
      },
    })

    return { success: true, viewCount }
  } catch (error) {
    console.error('Error getting product view count:', error)
    return {
      success: false,
      error: 'Failed to get product view count',
      viewCount: 0,
    }
  }
}

// Track product share - only once per user per platform
export async function trackProductShare(productId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    // Check if user has already shared this product on this platform
    const existingShare = await prisma.productInteraction.findFirst({
      where: {
        productId,
        userId: session?.user?.id || 'anonymous',
        type: ProductInteractionType.share,
        // We can use the platform info in a custom field or just track unique shares per user
      },
    })

    // For simplicity, we'll allow users to share multiple times but only award points once
    // Create interaction record
    await prisma.productInteraction.create({
      data: {
        productId,
        userId: session?.user?.id || 'anonymous',
        type: ProductInteractionType.share,
      },
    })

    // Award points for sharing (if user is logged in and it's their first share)
    let pointsAwarded = false
    if (session?.user?.id && !existingShare) {
      await awardProductInteractionPoints()
      pointsAwarded = true
    }

    return { success: true, pointsAwarded }
  } catch (error) {
    console.error('Error tracking product share:', error)
    return {
      success: false,
      error: 'Failed to track product share',
      pointsAwarded: false,
    }
  }
}

// Get product share count
export async function getProductShareCount(productId: string) {
  try {
    const shareCount = await prisma.productInteraction.count({
      where: {
        productId,
        type: ProductInteractionType.share,
      },
    })

    return { success: true, shareCount }
  } catch (error) {
    console.error('Error getting product share count:', error)
    return {
      success: false,
      error: 'Failed to get product share count',
      shareCount: 0,
    }
  }
}
