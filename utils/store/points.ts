import { prisma } from '@/lib/prisma/client'

// Points system constants
export const POINTS_CONFIG = {
  PER_RAND_SPENT: 1, // 1 point per R1 spent
  REVIEW_POINTS: 50, // Points awarded for writing a review
  SIGNUP_BONUS: 100, // Points awarded for signing up
  REFERRAL_BONUS: 200, // Points for successful referrals
} as const

/**
 * Award points to a user and update their membership tier
 */
export async function awardPoints(
  userId: string,
  points: number,
  action: string,
  tx?: typeof prisma
) {
  const prismaClient = tx || prisma

  try {
    // Update user points
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points,
        },
      },
      include: { membership: true },
    })

    // Record points history
    await prismaClient.membershipHistory.create({
      data: {
        userId,
        action,
        points,
      },
    })

    // Check if user qualifies for a higher membership tier
    const availableMemberships = await prismaClient.membership.findMany({
      where: {
        minPoints: { lte: updatedUser.points },
        maxPoints: { gte: updatedUser.points },
      },
      orderBy: { minPoints: 'desc' },
    })

    const newMembership = availableMemberships[0]

    // Update membership if user qualifies for a higher tier
    if (
      newMembership &&
      (!updatedUser.membership || newMembership.minPoints > updatedUser.membership.minPoints)
    ) {
      await prismaClient.user.update({
        where: { id: userId },
        data: { membershipId: newMembership.id },
      })

      // Record membership upgrade
      await prismaClient.membershipHistory.create({
        data: {
          userId,
          action: `Upgraded to ${newMembership.title}`,
          points: 0,
        },
      })
    }

    return {
      success: true,
      newPoints: updatedUser.points,
      membershipUpgrade:
        newMembership &&
        (!updatedUser.membership || newMembership.minPoints > updatedUser.membership.minPoints),
    }
  } catch (error) {
    console.error('Error awarding points:', error)
    return {
      success: false,
      error: 'Failed to award points',
    }
  }
}

/**
 * Calculate points for an order based on total amount
 */
export function calculateOrderPoints(totalAmount: number): number {
  return Math.floor(totalAmount * POINTS_CONFIG.PER_RAND_SPENT)
}

/**
 * Check if user has already received points for a specific action
 */
export async function hasReceivedPointsFor(userId: string, action: string): Promise<boolean> {
  try {
    const existingHistory = await prisma.membershipHistory.findFirst({
      where: {
        userId,
        action,
      },
    })

    return !!existingHistory
  } catch (error) {
    console.error('Error checking points history:', error)
    return false
  }
}

/**
 * Get user's points history
 */
export async function getUserPointsHistory(userId: string, limit = 10) {
  try {
    const history = await prisma.membershipHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return history
  } catch (error) {
    console.error('Error fetching points history:', error)
    return []
  }
}
