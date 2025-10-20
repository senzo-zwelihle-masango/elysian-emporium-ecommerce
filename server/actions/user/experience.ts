'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { experienceSchema, ExperienceSchemaType } from '@/schemas/user/experience'

// new
export async function createExperienceAction(values: ExperienceSchemaType): Promise<ApiResponse> {
  // user session
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required.Please sign in',
    }
  }

  //   mutation
  try {
    // schema validation
    const validation = experienceSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newShipping = await prisma.experience.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Success.`,
      NotificationType.success,
      newShipping.id,
      'Experience',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Rating Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new rating. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to add rating',
    }
  }
}
