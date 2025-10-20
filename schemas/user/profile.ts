import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().max(30, 'Name must be under 30 characters.'),
  image: z.string(),
  phoneNumber: z.string().optional(),
})

export type ProfileSchemaType = z.infer<typeof profileSchema>
