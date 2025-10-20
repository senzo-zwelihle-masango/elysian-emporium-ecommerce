import { z } from 'zod'

export const settingsSchema = z.object({
  name: z.string().max(30, 'Name must be under 30 characters.'),
  image: z.string(),
  phoneNumber: z.string().optional(),
})

export type SettingsSchemaType = z.infer<typeof settingsSchema>
