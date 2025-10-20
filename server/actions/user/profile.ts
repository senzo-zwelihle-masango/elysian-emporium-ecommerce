'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { profileSchema, ProfileSchemaType } from '@/schemas/user/profile'

export async function updateProfileAction(data: ProfileSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return { status: 'error', message: 'Authentication required.' }
  }

  try {
    const result = profileSchema.safeParse(data)
    if (!result.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    const updateProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...result.data },
    })

    try {
      revalidatePath('/account')
    } catch {}

    await createNotificationAction(
      'Profile updated successfully',
      NotificationType.success,
      updateProfile.id,
      'Profile',
      session.user.id
    )

    return { status: 'success', message: 'Profile Updated Successfully' }
  } catch (error) {
    await createNotificationAction(
      `Failed to update profile. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )

    return { status: 'error', message: 'Failed to update profile' }
  }
}
