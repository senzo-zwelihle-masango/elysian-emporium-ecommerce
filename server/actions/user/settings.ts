'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { settingsSchema, SettingsSchemaType } from '@/schemas/user/settings'

export async function updateSettingsAction(data: SettingsSchemaType): Promise<ApiResponse> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return { status: 'error', message: 'Authentication required.' }
  }

  try {
    const result = settingsSchema.safeParse(data)
    if (!result.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    const updateSettings = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...result.data },
    })

    try {
      revalidatePath('/account/settings')
      revalidatePath('/account')
    } catch {}

    await createNotificationAction(
      'Settings updated successfully',
      NotificationType.success,
      updateSettings.id,
      'Settings',
      session.user.id
    )

    return { status: 'success', message: 'Settings Updated Successfully' }
  } catch (error) {
    await createNotificationAction(
      `Failed to update settings. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )

    return { status: 'error', message: 'Failed to update settings' }
  }
}
