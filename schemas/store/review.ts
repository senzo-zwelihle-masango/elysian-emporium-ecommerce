import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(500, 'Comment must be less than 500 characters'),
})

export type ReviewSchemaType = z.infer<typeof reviewSchema>
