import 'server-only'

import { prisma } from '@/lib/prisma/client'
import { Promotion } from '@/types/store/promotion'

export async function fetchActivePromotions(): Promise<Promotion[]> {
  try {
    const promotions = await prisma.promotion.findMany({
      where: {
        active: true,
      },
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const transformedPromotions: Promotion[] = promotions.map((promotion) => ({
      id: promotion.id,
      label: promotion.label,
      description: promotion.description,
      image: promotion.image,
      active: promotion.active,
      brand: {
        id: promotion.brand.id,
        name: promotion.brand.name,
      },
    }))

    return transformedPromotions
  } catch {
    return []
  }
}
