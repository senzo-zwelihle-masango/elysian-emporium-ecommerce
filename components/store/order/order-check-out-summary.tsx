'use client'

import React from 'react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { CartItem, CheckoutTotals } from '@/types/store/check-out'
import { formatPrice } from '@/utils/store/format'

interface CheckoutSummaryProps {
  items: CartItem[]
  totals: CheckoutTotals
}

const OrderCheckOutSummary = ({ items, totals }: CheckoutSummaryProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 rounded-lg border p-4">
            <Image
              src={item.images || '/api/placeholder/64/64'}
              alt={item.name}
              width={40}
              height={40}
              quality={95}
              className="h-20 w-20 rounded object-cover"
            />

            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>

              <p className="text-muted-foreground text-sm">Quantity: {item.quantity}</p>
            </div>

            <div className="text-right">
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>

              <p className="text-muted-foreground text-sm">{formatPrice(item.price)} each</p>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>VAT (0%)</span> <span>{formatPrice(totals.vatAmount)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{totals.shippingCost === 0 ? 'Free' : formatPrice(totals.shippingCost)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(totals.totalAmount)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderCheckOutSummary
