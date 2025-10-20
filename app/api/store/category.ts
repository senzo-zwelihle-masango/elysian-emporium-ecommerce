import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchStoreCategories() {
  noStore()
  const data = await prisma.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      products: {
        where: {
          status: 'active',
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  //  product count to each category
  return data.map((category) => ({
    ...category,
    productCount: category.products.length,
  }))
}
