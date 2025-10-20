import { z } from 'zod'
import { Province, ShippingAddressType } from '@/lib/generated/prisma'

export const shippingSchema = z.object({
  label: z.string().max(30, 'Shipping Label name must be under 30 characters.'),
  type: z.enum(ShippingAddressType),
  fullName: z.string().min(1, 'FullName is required.'),
  phoneNumber: z.string().min(1, 'PhoneNumber is required.'),
  country: z.string().optional(),
  city: z.string().min(1, 'City is required.'),
  postalCode: z.string().min(1, 'Postal code is required.'),
  suburb: z.string().min(1, 'Suburb is required.'),
  province: z.enum(Province),
  streetAddress: z.string().min(1, ' Street Address is required.'),
  streetAddress2: z.string().optional(),
  isDefault: z.boolean(),
})

export type ShippingSchemaType = z.infer<typeof shippingSchema>
