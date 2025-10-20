'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma/client'

import { auth } from '@/lib/auth'

export async function addNewFavoriteItemAction(
  productId: string
): Promise<{ success: boolean; message: string; isFavorited: boolean }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required to favorite items.',
      isFavorited: false,
    }
  }

  const user = session.user.id

  if (!user) {
    return {
      success: false,
      message: 'Authentication required to favorite items.',
      isFavorited: false,
    }
  }

  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user,
        productId,
      },
    })

    let actionMessage: string
    let newFavoriteStatus: boolean
    let productSlug: string | undefined

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      actionMessage = 'Removed from favorites!'
      newFavoriteStatus = false
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { name: true, slug: true },
      })

      if (!product) {
        return {
          success: false,
          message: 'Product not found.',
          isFavorited: false,
        }
      }

      await prisma.favorite.create({
        data: {
          name: product.name,
          userId: user,
          productId,
        },
      })
      actionMessage = 'Added to favorites!'
      newFavoriteStatus = true
      productSlug = product.slug
    }

    const revalidateProductPath = productSlug ? `/products/${productSlug}` : `/products`

    revalidatePath(revalidateProductPath)
    revalidatePath('/favorites')
    revalidatePath('/', 'layout')

    return {
      success: true,
      message: actionMessage,
      isFavorited: newFavoriteStatus,
    }
  } catch (error) {
    console.error('Server Action Error (addNewFavoriteItemAction):', error)
    return {
      success: false,
      message: 'An unexpected error occurred.',
      isFavorited: false,
    }
  }
}

// delete fav item
export async function deleteFavoriteAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required to favorite items.',
    }
  }
  const user = session.user.id

  if (!user) {
    return { success: false, message: 'Authentication required.' }
  }

  const favoriteId = formData.get('favoriteId')

  if (!favoriteId || typeof favoriteId !== 'string') {
    return { success: false, message: 'Invalid favorite ID.' }
  }

  try {
    const deletedFavorite = await prisma.favorite.delete({
      where: {
        id: favoriteId,
        // Ensure user can only delete their own favorites
        userId: user,
      },
    })

    // Revalidate paths after deletion
    revalidatePath('/favorites')
    revalidatePath(`/products/${deletedFavorite.productId}`)
    revalidatePath('/', 'layout')

    return { success: true, message: 'Item removed from favorites!' }
  } catch (error) {
    console.error('Error deleting favorite:', error)

    return { success: false, message: 'Failed to remove item from favorites.' }
  }
}
