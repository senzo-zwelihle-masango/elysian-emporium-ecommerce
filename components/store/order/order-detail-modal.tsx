'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Package, Truck, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { OrderStatus } from '@/lib/generated/prisma'
import { OrderWithRelations } from '@/types/store/prisma-relations'
import { CopyButton } from '@/utils/store/copy-button'
import { orderStatusColors, paymentStatusColors } from '@/types/store/order'

interface OrderDetailsModalProps {
  order: OrderWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  formatCurrency: (amount: number) => string
  formatDate: (date: Date) => string
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

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
  formatCurrency,
  formatDate,
}: OrderDetailsModalProps) {
  // const subtotal = order.totalAmount - order.shippingCost - order.vatAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Order Details</span>
            <div className="flex items-center gap-2 text-base font-normal">
              <span className="text-muted-foreground">#{order.orderNumber}</span>
              <CopyButton value={order.orderNumber} className="h-6 w-6 p-0" />{' '}
              {/* Use the new CopyButton */}
            </div>
          </DialogTitle>
          <DialogDescription>Placed on {formatDate(order.createdAt)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status & Payment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Order Status</h3>
              <Badge className={orderStatusColors[order.status]} variant="outline">
                {order.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Payment Status</h3>
              <Badge className={paymentStatusColors[order.paymentStatus]} variant="outline">
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Progress Tracker for Active Orders */}
          {!['Cancelled', 'Returned'].includes(order.status) && (
            <div className="space-y-3">
              <h3 className="font-medium">Order Progress</h3>
              <div className="flex items-center justify-between">
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
                    <div key={status} className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          isCompleted || isCurrent
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300 bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`mt-1 text-xs ${
                          isCompleted || isCurrent ? 'font-medium text-blue-600' : 'text-gray-500'
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
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
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
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="block transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500">each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
