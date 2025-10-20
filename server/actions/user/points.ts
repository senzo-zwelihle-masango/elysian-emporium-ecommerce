'use server'

import { prisma } from '@/lib/prisma/client'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { MembershipPointsRules } from './rules'
import { updateMembershipTier } from './update'

export async function awardPointsAction(
  userId: string,
  action: keyof typeof MembershipPointsRules,
  amount?: number
) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  const points =
    typeof MembershipPointsRules[action] === 'function'
      ? MembershipPointsRules[action](amount ?? 0)
      : MembershipPointsRules[action]

  // Increment user points
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: points } },
    include: { membership: true },
  })

  //   log mutation
  await prisma.membershipHistory.create({
    data: {
      userId,
      action,
      points,
    },
  })

  // Check for tier change
  const tierChange = await updateMembershipTier(updatedUser.id, points)

  if (tierChange?.newTier) {
    await createNotificationAction(
      `You earned ${points} points and reached the ${tierChange.newTier.title} tier!`,
      NotificationType.success,
      undefined,
      'membership_tier',
      updatedUser.id
    )
  } else {
    await createNotificationAction(
      `You earned ${points} points!`,
      NotificationType.information,
      undefined,
      'points',
      updatedUser.id
    )
  }

  return updatedUser
}
