'use server'

import { prisma } from '@/lib/prisma/client'

export async function updateMembershipTier(userId: string, pointsGained: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { membership: true },
  })
  if (!user) return null

  const tiers = await prisma.membership.findMany({
    orderBy: { minPoints: 'asc' },
  })

  // Find the highest tier the user qualifies for based on their total points
  const newTier = tiers.reduce((highestTier, currentTier) => {
    if (user.points >= currentTier.minPoints) {
      return currentTier
    }
    return highestTier
  }, tiers[0])

  // Check if the user should be upgraded to a higher tier
  if (newTier && newTier.id !== user.membershipId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipId: newTier.id },
    })

    return {
      oldTier: user.membership,
      newTier,
      pointsGained,
    }
  }

  return {
    oldTier: user.membership,
    newTier: null,
    pointsGained,
  }
}
