'use client'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Package, Truck, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { OrderStatus } from '@/lib/generated/prisma'
import { OrderWithRelations } from '@/types/store/prisma-relations'
import { CopyButton } from '@/utils/store/copy-button'
import { dateFormat, formatPrice } from '@/utils/store/format'
import { orderStatusColors, paymentStatusColors } from '@/types/store/order'

interface OrderDetailsPageContentProps {
  order: OrderWithRelations
}

const statusProgress: Record<OrderStatus, number> = {
  pending: 1,
  confirmed: 2,
  processing: 3,
  packed: 4,
  shipped: 5,
  outfordelivery: 6,
  delivered: 7,
  cancelled: 0,
  returned: 0,
}

export function OrderDetailsPageContent({ order }: OrderDetailsPageContentProps) {
  const subtotal = order.totalAmount - order.shippingCost - order.vatAmount

  return (
    <div className="space-y-6">
      {/* Order Header and Basic Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Order <span className="text-muted-foreground">#{order.orderNumber}</span>
            <CopyButton value={order.orderNumber} className="h-6 w-6 p-0" />
          </h2>
          <p className="text-muted-foreground text-sm">Placed on {dateFormat(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={orderStatusColors[order.status]} variant="outline">
            {order.status}
          </Badge>
          <Badge className={paymentStatusColors[order.paymentStatus]} variant="outline">
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Progress Tracker for Active Orders */}
      {!['Cancelled', 'Returned'].includes(order.status) && (
        <div className="space-y-3">
          <h3 className="font-medium">Order Progress</h3>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {' '}
            {/* Added overflow for small screens */}
            {[
              { status: 'Confirmed', icon: FileText },
              { status: 'Processing', icon: Package },
              { status: 'Packed', icon: Package },
              { status: 'Shipped', icon: Truck },
              { status: 'Delivered', icon: FileText },
            ].map(({ status, icon: Icon }, index) => {
              const isCompleted = statusProgress[order.status] > index + 1
              const isCurrent = statusProgress[order.status] === index + 2

              return (
                <div key={status} className="mx-2 flex flex-shrink-0 flex-col items-center">
                  {' '}
                  {/* Added flex-shrink-0 and mx-2 */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted || isCurrent ? 'bg-primary border-primary' : 'border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`mt-1 text-center text-sm ${
                      isCompleted || isCurrent ? 'text-primary font-medium' : 'text-gray-500'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-medium">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.product.slug}`} className="block transition-colors">
                  {item.product.name}
                </Link>
                <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="hidden text-right sm:block">
                {' '}
                {/* Hidden on small screens */}
                <p className="font-medium">{formatPrice(item.price)}</p>
                <p className="text-muted-foreground text-sm">each</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                <p className="text-muted-foreground text-sm">total</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Shipping shipping */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-medium">Shipping shipping</h3>
          <div className="rounded-lg border-2 p-3">
            <p className="text-sm">
              {order.shipping.streetAddress}
              <br />
              {order.shipping.streetAddress2 && (
                <>
                  {order.shipping.streetAddress2}
                  <br />
                </>
              )}
              {order.shipping.city}, {order.shipping.province}
              <br />
              {order.shipping.postalCode}
              <br />
              {order.shipping.country}
            </p>
            {order.shipping.fullName && (
              <p className="mt-1 text-xs">Recipient: {order.shipping.fullName}</p>
            )}
            {order.shipping.phoneNumber && (
              <p className="text-xs">Phone: {order.shipping.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Payment & Order Summary */}
        <div className="space-y-4 rounded-lg border-2 p-3">
          {/* Payment Method */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-medium">Payment Method</h3>
            <p className="text-sm">{order.paymentMethod}</p>
            {order.transactionId && (
              <p className="mt-1 text-xs">Transaction ID: {order.transactionId}</p>
            )}
          </div>

          {/* Order Total */}
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>{formatPrice(order.vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-medium">
                <span>Total:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Notes */}
      {order.customerNotes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-medium">Customer Notes</h3>
            <p className="rounded-lg p-3 text-sm">{order.customerNotes}</p>
          </div>
        </>
      )}

      {/* Important Dates */}
      <Separator />
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="mb-1 font-medium">Order Placed</h4>
          <p className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {dateFormat(order.createdAt)}
          </p>
        </div>
        {order.expectedDeliveryDate && (
          <div>
            <h4 className="mb-1 font-medium">Expected Delivery</h4>
            <p className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {dateFormat(order.expectedDeliveryDate)}
            </p>
          </div>
        )}
        {order.actualDeliveryDate && (
          <div>
            <h4 className="mb-1 font-medium">Delivered On</h4>
            <p className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {dateFormat(order.actualDeliveryDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
