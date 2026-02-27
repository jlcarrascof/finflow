import { z } from 'zod'

export const CreatePaymentSchema = z.object({
  invoiceId: z.number().int().positive('El ID de factura es requerido'),
  amount:    z.number().positive('El monto debe ser positivo'),
  method:    z.enum(['cash', 'transfer', 'card', 'check'], {
    errorMap: () => ({ message: 'Método inválido: cash, transfer, card o check' }),
  }),
  paidAt:    z.string().datetime().optional(),
  notes:     z.string().max(255).optional(),
})

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>
