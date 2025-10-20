import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from 'sonner'
import { Container } from '@/components/ui/container'
import { prisma } from '@/lib/prisma/client'
import { ShoppingCartType } from '@/types/store/cart'
import { redisShoppingCart } from '@/redis/db/cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import CheckoutWizard from '@/components/store/check-out/check-out-wizard'

async function getCheckoutData(userId: string) {
  try {
    // Fetch user's addresses
    const addresses = await prisma.shipping.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    // Fetch cart from Redis
    const cart: ShoppingCartType | null = await redisShoppingCart.get(`cart-${userId}`)

    return {
      addresses,
      cart,
      user: { id: userId },
    }
  } catch (error) {
    console.error('Error fetching checkout data:', error)
    return {
      addresses: [],
      cart: null,
      user: { id: userId },
    }
  }
}

function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-3 hidden sm:block">
                <Skeleton className="h-4 w-20" />
              </div>
              {i < 4 && <Skeleton className="mx-4 h-0.5 flex-1" />}
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

const CheckoutRoutePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/sign-in?post_login_redirect_url=/checkout')
  }

  const user = session.user.id

  if (!user) {
    redirect('/sign-in?post_login_redirect_url=/checkout')
  }

  const checkoutData = await getCheckoutData(user)

  // Redirect to cart if no items
  if (!checkoutData.cart || checkoutData.cart.items.length === 0) {
    redirect('/account/cart')
  }
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
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutWizard
          initialAddresses={checkoutData.addresses}
          initialCartItems={checkoutData.cart.items}
        />
      </Suspense>

      <Toaster />
    </Container>
  )
}

export default CheckoutRoutePage
