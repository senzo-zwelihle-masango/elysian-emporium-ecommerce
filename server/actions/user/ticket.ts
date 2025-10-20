'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { prisma } from '@/lib/prisma/client'

import { ApiResponse } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import { ticketSchema, TicketSchemaType } from '@/schemas/user/ticket'

// new
export async function createNewTicketAction(values: TicketSchemaType): Promise<ApiResponse> {
  // user session
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      status: 'error',
      message: 'Authentication required. Please sign in',
    }
  }

  //   mutation
  try {
    // schema validation
    const validation = ticketSchema.safeParse(values)

    if (!validation.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const newTicket = await prisma.ticket.create({
      data: {
        ...validation.data,
        status: 'open', // default status for new tickets
        userId: session.user.id,
      },
    })

    // create notification
    await createNotificationAction(
      `Support ticket created successfully.`,
      NotificationType.success,
      newTicket.id,
      'Ticket',
      // Send notification to the user
      session.user.id
    )
    return {
      status: 'success',
      message: 'Ticket Created Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to create a new ticket. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to create ticket please try again.',
    }
  }
}

// Add other user ticket actions here if needed in the future
