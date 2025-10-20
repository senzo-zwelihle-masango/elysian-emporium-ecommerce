import React from 'react'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'

import { OrderWithRelations } from '@/types/store/prisma-relations'
import Link from 'next/link'
import { prisma } from '@/lib/prisma/client'
import { OrderDetailsPageContent } from '@/components/store/order/order-details-content'

async function getOrderData({ orderId }: { orderId: string }): Promise<OrderWithRelations> {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      shipping: {
        select: {
          id: true,
          fullName: true,
          streetAddress: true,
          streetAddress2: true,
          city: true,
          suburb: true,
          province: true,
          country: true,
          postalCode: true,
          phoneNumber: true,
          label: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              images: true,
              price: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    return notFound()
  }

  // Convert Decimal types from Prisma to number for client-side usage
  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    shippingCost: order.shippingCost.toNumber(),
    vatAmount: order.vatAmount.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    expectedDeliveryDate: order.expectedDeliveryDate,
    actualDeliveryDate: order.actualDeliveryDate,
  }
}

// Changed to match the pattern from your billboard example
type OrderDetailsPageParams = Promise<{ orderId: string }>

const OrderDetailsPage = async ({ params }: { params: OrderDetailsPageParams }) => {
  // Await params as it's now typed as a Promise
  const { orderId } = await params
  const order = await getOrderData({ orderId })

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="order-id"
      className="pt-24"
    >
      <div className="my-6 mb-6 flex items-center gap-4 md:mb-8">
        <Button
          variant={'ghost'}
          size={'sm'}
          className="shadow-sm transition-transform hover:scale-105"
        >
          <Link href={'/orders'}>
            <ChevronLeftIcon />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
      </div>

      <OrderDetailsPageContent order={order} />
    </Container>
  )
}

export default OrderDetailsPage
