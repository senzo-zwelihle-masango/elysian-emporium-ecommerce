import { OrderClient } from '@/components/store/order/order-client'
import { Container } from '@/components/ui/container'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { OrderWithRelations } from '@/types/store/prisma-relations'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const OrdersPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/sign-in')
  }

  const user = session.user.id

  if (!user) {
    redirect('/sign-in')
  }

  let orders: OrderWithRelations[] = []
  try {
    const fetchedOrders = await prisma.order.findMany({
      where: {
        userId: user,
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
      orderBy: {
        createdAt: 'desc',
      },
    })
    orders = fetchedOrders.map((order) => ({
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
    }))
  } catch {
    toast.error('Failed to fetch orders')
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="orders"
      className="pt-24"
    >
      <OrderClient orders={orders} />
    </Container>
  )
}

export default OrdersPage
