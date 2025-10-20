'use server'

import { prisma } from '@/lib/prisma/client'

import { ProductInteractionType } from '@/lib/generated/prisma'

export async function getProductInteractionStatistics(productId: string) {
  try {
    // Get all interaction counts by type
    const interactions = await prisma.productInteraction.groupBy({
      by: ['type'],
      where: {
        productId,
      },
      _count: {
        type: true,
      },
    })

    // Convert to a more usable format
    const stats = interactions.reduce(
      (acc, interaction) => {
        acc[interaction.type] = interaction._count.type
        return acc
      },
      {} as Record<string, number>
    )

    return {
      success: true,
      stats: {
        views: stats[ProductInteractionType.view] || 0,
        shares: stats[ProductInteractionType.share] || 0,
        addToCart: stats[ProductInteractionType.addtocart] || 0,
        favorites: stats[ProductInteractionType.favorite] || 0,
        purchases: stats[ProductInteractionType.purchase] || 0,
        reviews: stats[ProductInteractionType.review] || 0,
      },
    }
  } catch (error) {
    console.error('Error getting product interaction stats:', error)
    return {
      success: false,
      error: 'Failed to get product interaction stats',
      stats: {
        views: 0,
        shares: 0,
        addToCart: 0,
        favorites: 0,
        purchases: 0,
        reviews: 0,
      },
    }
  }
}

export async function getTopInteractedProducts(limit: number = 10) {
  try {
    const topProducts = await prisma.productInteraction.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    })

    // Get product details for the top interacted products
    const productIds = topProducts.map((p) => p.productId)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        images: true,
        price: true,
        brand: {
          select: {
            name: true,
          },
        },
      },
    })

    // Combine interaction counts with product details
    const topProductsWithDetails = topProducts.map((interaction) => {
      const product = products.find((p) => p.id === interaction.productId)
      return {
        ...interaction,
        product,
      }
    })

    return {
      success: true,
      products: topProductsWithDetails,
    }
  } catch (error) {
    console.error('Error getting top interacted products:', error)
    return {
      success: false,
      error: 'Failed to get top interacted products',
      products: [],
    }
  }
}
