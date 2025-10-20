'use server'

import { headers } from 'next/headers'

import { prisma } from '@/lib/prisma/client'

import { auth } from '@/lib/auth'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { awardPointsAction } from './points'

export async function signUpForMembershipAction() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { membership: true },
  })

  if (user?.membershipId) {
    return { status: 'already', user }
  }

  // Pick the lowest tier as default
  const lowestTier = await prisma.membership.findFirst({
    orderBy: { minPoints: 'asc' },
  })

  if (!lowestTier) throw new Error('No membership tiers configured')

  // Assign membership with 0 points first
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      membershipId: lowestTier.id,
      points: 0,
    },
    include: { membership: true },
  })

  // Welcome notification
  await createNotificationAction(
    `Welcome to our membership program! You’ve been enrolled in the ${lowestTier.title} tier. Happy Shopping!`,
    NotificationType.success,
    undefined,
    'membership_signup',
    updatedUser.id
  )

  // Award welcome bonus (100 points, may cause tier upgrade)
  const userWithPoints = await awardPointsAction(userId, 'welcome_bonus')

  return { status: 'signed_up', user: userWithPoints }
}
