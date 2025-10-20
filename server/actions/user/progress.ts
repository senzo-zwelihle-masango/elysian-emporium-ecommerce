'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

export async function getUserMembershipProgress() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return {
      points: 0,
      currentTier: null,
      nextTier: null,
      progress: 0,
    }
  }

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      points: true,
      membership: true,
    },
  })

  if (!user || !user.membership) {
    return {
      points: user?.points || 0,
      currentTier: null,
      nextTier: null,
      progress: 0,
    }
  }

  // Get all tiers, ordered by minPoints
  const tiers = await prisma.membership.findMany({
    orderBy: { minPoints: 'asc' },
  })

  // Find the next tier based on the current tier's minPoints
  const currentTierIndex = tiers.findIndex((tier) => tier.id === user.membership?.id)
  const nextTier =
    currentTierIndex !== -1 && currentTierIndex < tiers.length - 1
      ? tiers[currentTierIndex + 1]
      : null

  // Calculate the progress percentage
  const pointsInCurrentTier = user.points - user.membership.minPoints
  const totalPointsForNextTier = nextTier ? nextTier.minPoints - user.membership.minPoints : 0

  const progress =
    totalPointsForNextTier > 0 ? (pointsInCurrentTier / totalPointsForNextTier) * 100 : 100

  return {
    points: user.points,
    currentTier: user.membership,
    nextTier,
    progress: Math.min(100, Math.max(0, progress)),
  }
}
