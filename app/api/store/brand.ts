import 'server-only'

import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'

export async function fetchStoreBrands() {
  noStore()
  const data = await prisma.brand.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      logo: true,
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

  //  product count to each brand
  return data.map((brand) => ({
    ...brand,
    productCount: brand.products.length,
  }))
}
