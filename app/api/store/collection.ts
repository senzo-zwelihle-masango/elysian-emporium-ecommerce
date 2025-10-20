import 'server-only'

import { prisma } from '@/lib/prisma/client'
import { Collection } from '@/types/store/collection'

export async function fetchActiveCollections(): Promise<Collection[]> {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        label: true,
        description: true,
        image: true,
        color: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const transformedCollections: Collection[] = collections.map((collection) => ({
      id: collection.id,
      label: collection.label,
      description: collection.description,
      image: collection.image,
      color: collection.color,
      category: {
        id: collection.category.id,
        name: collection.category.name,
      },
    }))

    return transformedCollections
  } catch {
    return []
  }
}
