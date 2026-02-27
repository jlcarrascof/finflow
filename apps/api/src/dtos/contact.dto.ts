import { z } from 'zod'

export const CreateContactSchema = z.object({
  name:    z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email:   z.string().email('Email inválido'),
  phone:   z.string().optional(),
  address: z.string().optional(),
  taxId:   z.string().optional(),
})

export const UpdateContactSchema = CreateContactSchema.partial()

export type CreateContactDto = z.infer<typeof CreateContactSchema>
export type UpdateContactDto = z.infer<typeof UpdateContactSchema>
