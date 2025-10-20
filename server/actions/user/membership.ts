'use server'

import { prisma } from '@/lib/prisma/client'

export async function getUserMembershipInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      membership: true,
      membershipHistory: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const allTiers = await prisma.membership.findMany({
    orderBy: { minPoints: 'asc' },
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      points: user.points,
      membership: user.membership,
      membershipHistory: user.membershipHistory,
    },
    allTiers,
  }
}
