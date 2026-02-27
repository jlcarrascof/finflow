import { z } from 'zod'

export const CreateItemSchema = z.object({
  name:        z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).trim(),
  description: z.string().max(500).optional(),
  price:       z.number().positive('El precio debe ser positivo'),
  stock:       z.number().int().min(0).default(0),
  category:    z.string().max(50).optional(),
})

export const UpdateItemSchema = CreateItemSchema.partial()

export type CreateItemDto = z.infer<typeof CreateItemSchema>
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>
