import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { FavoriteItemForClient } from '@/interfaces/favorite'
import { prisma } from '@/lib/prisma/client'
import { FavoritesPageWrapper } from '@/components/store/favorite/favorite-wrapper'
import FavoritesEmptyState from '@/components/store/favorite/favorite-empty-state'
import { FavoritesList } from '@/components/store/favorite/favorite-list'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function FavoritesPage() {
  noStore()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/sign-in')
  }

  const user = session.user.id

  if (!user) {
    redirect('/sign-in')
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user,
    },
    select: {
      id: true,
      productId: true,
      name: true,
      product: {
        select: {
          price: true,
          images: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const favoritedItemsForClient: FavoriteItemForClient[] = favorites.map((fav) => ({
    id: fav.id,
    productId: fav.productId,
    name: fav.name,
    price: fav.product?.price?.toNumber() || 0,
    images: fav.product?.images?.[0] || '/placeholder.jpg',
    slug: fav.product?.slug || 'unknown-product',
  }))

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="favorites"
      className="pt-24"
    >
      <FavoritesPageWrapper>
        {favoritedItemsForClient.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-y-6">
              <FavoritesList items={favoritedItemsForClient} />
            </div>
          </div>
        )}
      </FavoritesPageWrapper>
    </Container>
  )
}
