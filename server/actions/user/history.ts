'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

export async function getUserPointsHistory() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const userId = session.user.id

  // last 50 events
  return prisma.membershipHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}
