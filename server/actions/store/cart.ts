'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma/client'

import { auth } from '@/lib/auth'

import { ShoppingCartType } from '@/types/store/cart'

import { redisShoppingCart } from '@/redis/db/cart'

// add to cart---store in redis
export async function addNewItemToCartAction(
  productId: string,
  quantity: number //
): Promise<{ success: boolean; message: string }> {
  // check user session
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required to favorite items.',
    }
  }

  const user = session.user.id

  if (!user) {
    redirect('/')
  }

  // Input validation
  if (typeof quantity !== 'number' || quantity <= 0) {
    return { success: false, message: 'Invalid quantity provided.' }
  }

  try {
    const cart: ShoppingCartType | null = await redisShoppingCart.get(`cart-${user}`)

    const selectedProduct = await prisma.product.findUnique({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,

        // we first check stock
        stock: true,
      },
      where: {
        id: productId,
      },
    })

    if (!selectedProduct) {
      return { success: false, message: 'Product not found.' }
    }

    if (selectedProduct.stock < quantity) {
      return {
        success: false,
        message: `Not enough stock. Only ${selectedProduct.stock} available.`,
      }
    }

    const myCart: ShoppingCartType = { userId: user, items: [] }

    if (cart && cart.items) {
      myCart.items = [...cart.items]
    }

    let itemFound = false

    // Check if item already in cart
    myCart.items = myCart.items.map((item) => {
      if (item.id === productId) {
        itemFound = true
        // Validate against product stock again
        const newQuantityInCart = item.quantity + quantity
        if (newQuantityInCart > selectedProduct.stock) {
          throw new Error(
            `Cannot add ${quantity} more. Max stock available: ${selectedProduct.stock}. You have ${item.quantity} in cart.`
          )
        }
        return { ...item, quantity: newQuantityInCart }
      }
      return item
    })

    if (!itemFound) {
      // Add new item if not found
      myCart.items.push({
        id: selectedProduct.id,
        images: selectedProduct.images[0],
        name: selectedProduct.name,
        price: selectedProduct.price.toNumber(),
        quantity: quantity,
      })
    }

    await redisShoppingCart.set(`cart-${user}`, myCart)

    revalidatePath('/', 'layout')
    revalidatePath(`/products/${selectedProduct.id}`)

    return { success: true, message: 'Product added to cart successfully!' }
  } catch (error: unknown) {
    console.error('Server Action Error (addNewItemToCartAction):', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    }
  }
}

// remove cart item
export async function deleteItemFromCartAction(
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
    return {
      success: false,
      message: 'Authentication required to delete item.',
    }
  }

  const productId = formData.get('productId')

  if (!productId || typeof productId !== 'string') {
    return { success: false, message: 'Invalid product ID.' }
  }

  try {
    const cart: ShoppingCartType | null = await redisShoppingCart.get(`cart-${user}`)

    if (cart && cart.items) {
      const initialItemCount = cart.items.length
      const updatedCart: ShoppingCartType = {
        userId: user,
        items: cart.items.filter((item) => item.id !== productId),
      }

      await redisShoppingCart.set(`cart-${user}`, updatedCart)

      if (updatedCart.items.length < initialItemCount) {
        revalidatePath('/cart')
        revalidatePath('/', 'layout')
        return { success: true, message: 'Item removed from cart!' }
      } else {
        return { success: false, message: 'Item not found in cart.' }
      }
    } else {
      return { success: false, message: 'Your cart is empty.' }
    }
  } catch (error) {
    console.error('Error deleting item from cart:', error)
    return { success: false, message: 'Failed to remove item from cart.' }
  }
}
