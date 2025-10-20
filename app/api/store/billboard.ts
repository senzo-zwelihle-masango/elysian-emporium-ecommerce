import 'server-only'

import { prisma } from '@/lib/prisma/client'
import { Billboard } from '@/types/store/billboard'

export async function fetchActiveBillboards(): Promise<Billboard[]> {
  try {
    // console.log("Fetching active billboards from database...");
    const billboards = await prisma.billboard.findMany({
      where: {
        status: 'active',
      },
      include: {
        category: true,
        featuredProduct: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // console.log("Found billboards:", billboards.length);

    // Transform the data to match the expected format
    const transformedBillboards: Billboard[] = billboards.map((billboard) => ({
      id: billboard.id,
      label: billboard.label,
      description: billboard.description,
      image: billboard.image,
      featuredProductId: billboard.featuredProductId,
      featuredProduct: billboard.featuredProduct
        ? {
            id: billboard.featuredProduct.id,
            name: billboard.featuredProduct.name,
            price: billboard.featuredProduct.price.toNumber(),
            images: billboard.featuredProduct.images,
            brand: {
              name: billboard.featuredProduct.brand?.name || '',
            },
          }
        : null,
      category: {
        id: billboard.category.id,
        name: billboard.category.name,
      },
    }))

    return transformedBillboards
  } catch {
    // toast.error("Error fetching active billboards:");
    return []
  }
}
