import { z } from 'zod'
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/lib/generated/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export type OrderItemToCreate = {
  productId: string
  quantity: number
  price: Decimal
}

// Cart item schema for checkout
export const checkoutItemSchema = z.object({
  id: z.string().min(1, { message: 'Product ID is required' }),
  name: z.string().min(1, { message: 'Product name is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  images: z.url().nullable().optional(),
})

// Checkout schema
export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, { message: 'At least one item is required' }),
  addressId: z.string().min(1, { message: 'Shipping address is required' }).optional(),
  paymentMethod: z.enum(PaymentMethod).optional(),
  customerNotes: z.string().optional(),
  subtotal: z.number().min(0, { message: 'Subtotal must be positive' }),
  shippingCost: z.number().min(0, { message: 'Shipping cost must be positive' }),
  vatAmount: z.number().min(0, { message: 'VAT amount must be positive' }),
  totalAmount: z.number().min(0, { message: 'Total amount must be positive' }),
})

// Create order schema
export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, { message: 'At least one item is required' }),
  addressId: z.string().min(1, { message: 'Shipping address is required' }),
  paymentMethod: z.enum(PaymentMethod),
  customerNotes: z.string().optional(),
  totalAmount: z.number().min(0, { message: 'Total amount must be positive' }),
  shippingCost: z.number().min(0, { message: 'Shipping cost must be positive' }),
  vatAmount: z.number().min(0, { message: 'VAT amount must be positive' }),
})

// Update order status schema
export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
  cancellationReason: z.string().optional().nullable(),
  actualDeliveryDate: z.date().optional().nullable(),
})

// Update payment schema
export const updatePaymentSchema = z.object({
  paymentStatus: z.enum(PaymentStatus),
  transactionId: z.string().optional().nullable(),
  paymentGatewayId: z.string().optional().nullable(),
})

// Type exports
export type CheckoutItem = z.infer<typeof checkoutItemSchema>
export type CheckoutData = z.infer<typeof checkoutSchema>
export type CreateOrderData = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>
export type UpdatePaymentData = z.infer<typeof updatePaymentSchema>
