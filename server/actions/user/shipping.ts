'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { shippingSchema, ShippingSchemaType } from '@/schemas/user/shipping'

// new
export async function createShippingAddressAction(
  values: ShippingSchemaType
): Promise<ApiResponse> {
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
    const validation = shippingSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newShipping = await prisma.shipping.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Successfully added ${newShipping.label} address.`,
      NotificationType.success,
      newShipping.id,
      'Shipping',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Shipping Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to add a new address. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to add address',
    }
  }
}

// update

export async function updateShippingAddressAction(
  data: ShippingSchemaType,
  shippingId: string
): Promise<ApiResponse> {
  // user session
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required.',
    }
  }

  try {
    const result = shippingSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateShipping = await prisma.shipping.update({
      where: {
        id: shippingId,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateShipping.label}" address.`,
      NotificationType.success,
      updateShipping.id,
      'Shipping',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Address Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update address. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update address',
    }
  }
}

// delete
export async function deleteShippingAddressAction(shippingId: string): Promise<ApiResponse> {
  // user session
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required.',
    }
  }

  try {
    // mutation
    const deleteShipping = await prisma.shipping.delete({
      where: {
        id: shippingId,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteShipping.label}" address.`,
      NotificationType.success,
      deleteShipping.id,
      'Shipping',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Address Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete address. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete address',
    }
  }
}
