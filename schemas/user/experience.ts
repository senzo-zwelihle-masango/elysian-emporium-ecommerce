import { z } from 'zod'

export const experienceSchema = z.object({
  rating: z.number().min(1, 'Please pick atleast one emoji, to submit your experience.'),
  comment: z.string().optional(),
})

export type ExperienceSchemaType = z.infer<typeof experienceSchema>
