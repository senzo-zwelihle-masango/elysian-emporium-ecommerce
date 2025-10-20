'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Decimal } from '@prisma/client/runtime/library'
import {
  checkoutSchema,
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentSchema,
} from '@/schemas/store/check-out'
import { Order } from '@/types/store/order'
import { redisShoppingCart } from '@/redis/db/cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma/client'
import {
  awardPoints,
  calculateOrderPoints,
  hasReceivedPointsFor,
  POINTS_CONFIG,
} from '@/utils/store/points'
import { toast } from 'sonner'

// this only applies when the total is more than 500!!!!
const SHIPPING_RATE = 99.0

// Get cart from Redis
export async function getCartFromRedis(userId: string) {
  try {
    const cart = await redisShoppingCart.get(`cart-${userId}`)
    return cart
  } catch (error) {
    console.error('Error fetching cart from Redis:', error)
    return null
  }
}

// Clear cart from Redis after successful order
export async function clearCartFromRedis(userId: string) {
  try {
    await redisShoppingCart.del(`cart-${userId}`)
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart from Redis:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

// Helper function to calculate order totals
function calculateOrderTotals(items: Array<{ quantity: number; price: number }>) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const calculatedShippingCost = subtotal >= 500 ? 0 : SHIPPING_RATE
  const vatAmount = 0
  const totalAmount = subtotal + calculatedShippingCost

  return {
    subtotal,
    vatAmount,
    shippingCost: calculatedShippingCost,
    totalAmount,
  }
}

// Validate cart items and check stock
export async function validateCartItemsAction(items: z.infer<typeof checkoutSchema>['items']) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  try {
    const productIds = items.map((item) => item.id)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        status: true,
      },
    })

    const validationResults = items.map((item) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) {
        return {
          productId: item.id,
          isValid: false,
          error: 'Product not found!',
        }
      }

      if (product.stock < item.quantity) {
        return {
          productId: item.id,
          isValid: false,
          error: `Only ${product.stock} items available in stock`,
        }
      }

      const expectedPrice = Number(product.price)
      if (Math.abs(expectedPrice - item.price) > 0.01) {
        return {
          productId: item.id,
          isValid: false,
          error: 'Price mismatch detected',
        }
      }

      return {
        productId: item.id,
        isValid: true,
        product: {
          id: product.id,
          name: product.name,
          price: expectedPrice,
          stock: product.stock,
        },
      }
    })

    const invalidItems = validationResults.filter((result) => !result.isValid)
    if (invalidItems.length > 0) {
      return {
        success: false,
        errors: invalidItems,
      }
    }

    const totals = calculateOrderTotals(items)

    return {
      success: true,
      validatedItems: validationResults,
      totals,
    }
  } catch {
    toast.error('Cart validation failed')
    return {
      success: false,
      error: 'Failed to validate cart items',
    }
  }
}

// Create a new order
export async function createOrderAction(data: z.infer<typeof createOrderSchema>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  try {
    const validated = createOrderSchema.parse(data)

    const address = await prisma.shipping.findUnique({
      where: { id: validated.addressId },
    })

    if (!address || address.userId !== user) {
      return {
        success: false,
        error: 'Invalid shipping address',
      }
    }

    const cartValidation = await validateCartItemsAction(validated.items)
    if (!cartValidation.success) {
      return {
        success: false,
        error: 'Cart validation failed',
        details: cartValidation.errors || cartValidation.error,
      }
    }

    const serverCalculatedTotals = calculateOrderTotals(validated.items)

    if (
      Math.abs(serverCalculatedTotals.totalAmount - validated.totalAmount) > 0.01 ||
      Math.abs(serverCalculatedTotals.shippingCost - validated.shippingCost) > 0.01 ||
      Math.abs(serverCalculatedTotals.vatAmount - validated.vatAmount) > 0.01
    ) {
      console.warn('Client-side totals differ from server-side calculations!')
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user,
          shippingId: validated.addressId,
          totalAmount: new Decimal(serverCalculatedTotals.totalAmount),
          shippingCost: new Decimal(serverCalculatedTotals.shippingCost),
          vatAmount: new Decimal(serverCalculatedTotals.vatAmount),
          paymentMethod: validated.paymentMethod,
          customerNotes: validated.customerNotes,
          status: 'pending',
          paymentStatus: 'pending',
        },
      })

      const orderItems = await Promise.all(
        validated.items.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.id,
              quantity: item.quantity,
              price: new Decimal(item.price),
            },
          })
        )
      )

      await Promise.all(
        validated.items.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          })
        )
      )

      // Award points for the order
      const pointsToAward = calculateOrderPoints(Number(serverCalculatedTotals.totalAmount))
      await awardPoints(
        user,
        pointsToAward,
        `Order #${newOrder.orderNumber}`,
        tx as Parameters<typeof awardPoints>[3]
      )

      return {
        ...newOrder,
        items: orderItems,
      }
    })

    await clearCartFromRedis(user)

    revalidatePath('/account/orders')
    revalidatePath('/checkout')
    revalidatePath('/account/cart')

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        paymentMethod: order.paymentMethod,
      },
    }
  } catch {
    toast.error('Failed to create order')
    return {
      success: false,
      error: 'Failed to create order',
    }
  }
}

// Update order status
export async function updateOrderStatusAction(
  orderId: string,
  data: z.infer<typeof updateOrderStatusSchema>
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  try {
    const validated = updateOrderStatusSchema.parse(data)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order || order.userId !== user) {
      return {
        success: false,
        error: 'Unauthorized or order not found',
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validated.status,
        transactionId: validated.transactionId,
        paymentGatewayId: validated.paymentGatewayId,
        cancellationReason: validated.cancellationReason,
        actualDeliveryDate: validated.status === 'delivered' ? new Date() : undefined,
      },
    })

    revalidatePath('/account/orders')
    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      order: updatedOrder,
    }
  } catch {
    toast.error('Failed to update order status')
    return {
      success: false,
      error: 'Failed to update order status',
    }
  }
}

// Update payment status
export async function updatePaymentStatusAction(
  orderId: string,
  data: z.infer<typeof updatePaymentSchema>
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  try {
    const validated = updatePaymentSchema.parse(data)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order || order.userId !== user) {
      return {
        success: false,
        error: 'Unauthorized or order not found',
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: validated.paymentStatus,
        transactionId: validated.transactionId,
        paymentGatewayId: validated.paymentGatewayId,
        status:
          validated.paymentStatus === 'paid' && order.status === 'pending'
            ? 'confirmed'
            : order.status,
      },
    })

    revalidatePath('/account/orders')
    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      order: updatedOrder,
    }
  } catch {
    toast.error('Failed to update payment status')
    return {
      success: false,
      error: 'Failed to update payment status',
    }
  }
}

// Get user's orders
export async function getUserOrdersAction() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      message: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) return redirect('/')

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
        shipping: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      orders,
    }
  } catch {
    toast.error('Failed to fetch orders')
    return {
      success: false,
      error: 'Failed to fetch orders',
    }
  }
}

// Get single order details
export async function getOrderDetailsAction(
  orderId: string
): Promise<{ success: true; order: Order } | { success: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      success: false,
      error: 'Authentication required.',
    }
  }

  const user = session.user.id
  if (!user) {
    return { success: false, error: 'Unauthorized: User not authenticated.' }
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
                sku: true,
              },
            },
          },
        },
        shipping: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return {
        success: false,
        error: 'Order not found or unauthorized access.',
      }
    }

    const processedOrder: Order = {
      ...order,
      totalAmount: Number(order.totalAmount),
      shippingCost: Number(order.shippingCost),
      vatAmount: Number(order.vatAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        images: item.product.images || [],
      })),
    }

    return {
      success: true,
      order: processedOrder,
    }
  } catch {
    toast.error('Failed to fetch order details')
    return {
      success: false,
      error: 'Failed to fetch order details due to an internal error.',
    }
  }
}

// Award points for product review
export async function awardReviewPointsAction(userId: string, productId: string) {
  try {
    const action = `Review for product ${productId}`

    // Check if user already received points for reviewing this product
    const alreadyAwarded = await hasReceivedPointsFor(userId, action)
    if (alreadyAwarded) {
      return {
        success: false,
        message: 'Points already awarded for this review',
      }
    }

    const result = await awardPoints(userId, POINTS_CONFIG.REVIEW_POINTS, action)

    if (result.success) {
      return {
        success: true,
        message: `${POINTS_CONFIG.REVIEW_POINTS} points awarded for your review!`,
        pointsAwarded: POINTS_CONFIG.REVIEW_POINTS,
      }
    } else {
      return result
    }
  } catch {
    toast.error('Failed to award points')
    return {
      success: false,
      error: 'Failed to award points',
    }
  }
}
