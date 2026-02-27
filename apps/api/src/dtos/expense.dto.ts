import { z } from 'zod'

export const CreateExpenseSchema = z.object({
  description: z.string().min(2, 'La descripción debe tener al menos 2 caracteres').max(255).trim(),
  amount:      z.number().positive('El monto debe ser positivo'),
  category:    z.string().min(1, 'La categoría es requerida').max(50).trim(),
  date:        z.string().datetime().optional(),
})

export const UpdateExpenseSchema = CreateExpenseSchema.partial()

export const VoidExpenseSchema = z.object({
  voidReason: z.string().min(5, 'El motivo debe tener al menos 5 caracteres').max(255).trim(),
})

export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>
export type UpdateExpenseDto = z.infer<typeof UpdateExpenseSchema>
export type VoidExpenseDto   = z.infer<typeof VoidExpenseSchema>
