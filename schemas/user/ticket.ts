import { z } from 'zod'
import { TicketPriority } from '@/lib/generated/prisma/index.d'

export const ticketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be under 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(1000, 'Description must be less than 1000 characters'),
  priority: z.enum(TicketPriority),
})

export type TicketSchemaType = z.infer<typeof ticketSchema>
