import { Membership } from '@/lib/generated/prisma/client'

export function getMembershipBenefits(membership: Membership | null) {
  if (!membership) {
    return [
      'Sign up for membership to unlock exclusive benefits',
      'Earn points with every purchase',
      'Access to special discounts and promotions',
    ]
  }

  return membership.benefits
}

export function getNextTierBenefits(currentMembership: Membership | null, allTiers: Membership[]) {
  if (!currentMembership) {
    const firstTier = allTiers.find((tier) => tier.minPoints === 0)
    return firstTier ? firstTier.benefits : []
  }

  const nextTier = allTiers.find((tier) => tier.minPoints > currentMembership.minPoints)
  return nextTier ? nextTier.benefits : []
}

export function getPointsToNextTier(
  currentPoints: number,
  currentMembership: Membership | null,
  allTiers: Membership[]
) {
  if (!currentMembership) {
    const firstTier = allTiers.find((tier) => tier.minPoints === 0)
    return firstTier ? firstTier.minPoints - currentPoints : 0
  }

  const nextTier = allTiers.find((tier) => tier.minPoints > currentMembership.minPoints)
  return nextTier ? nextTier.minPoints - currentPoints : 0
}

export function formatPoints(points: number): string {
  return points.toLocaleString()
}

export function getProgressToNextTier(
  currentPoints: number,
  currentMembership: Membership | null,
  allTiers: Membership[]
) {
  if (!currentMembership) {
    const firstTier = allTiers.find((tier) => tier.minPoints === 0)
    if (!firstTier) return 0
    return Math.min(100, Math.max(0, (currentPoints / firstTier.minPoints) * 100))
  }

  const nextTier = allTiers.find((tier) => tier.minPoints > currentMembership.minPoints)
  if (!nextTier) return 100 // Already at highest tier

  const pointsInCurrentTier = currentPoints - currentMembership.minPoints
  const pointsNeededForNextTier = nextTier.minPoints - currentMembership.minPoints

  return Math.min(100, Math.max(0, (pointsInCurrentTier / pointsNeededForNextTier) * 100))
}
