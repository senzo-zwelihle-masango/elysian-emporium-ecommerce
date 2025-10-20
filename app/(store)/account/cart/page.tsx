import { redirect } from 'next/navigation'
import React from 'react'

import { Container } from '@/components/ui/container'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ShoppingCartType } from '@/types/store/cart'

import CartClient from '@/components/store/cart/cart-client'
import { redisShoppingCart } from '@/redis/db/cart'

const CartRoutePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/sign-in')
  }

  const user = session.user.id

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch cart from Redis
  const cart: ShoppingCartType | null = await redisShoppingCart.get(`cart-${user}`)
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="cart"
      className="pt-24"
    >
      <CartClient items={cart?.items || []} userId={user} />
    </Container>
  )
}

export default CartRoutePage
