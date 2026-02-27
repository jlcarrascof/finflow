import { z } from 'zod'

export const CreateInvoiceLineSchema = z.object({
  itemId:    z.number().int().positive('El ID del item es requerido'),
  quantity:  z.number().int().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.number().positive('El precio unitario debe ser positivo'),
})

export const CreateInvoiceSchema = z.object({
  contactId: z.number().int().positive('El ID del contacto es requerido'),
  lines:     z.array(CreateInvoiceLineSchema).min(1, 'La factura debe tener al menos una línea'),
  dueDate:   z.string().datetime().optional(),
  notes:     z.string().max(500).optional(),
})

export const VoidInvoiceSchema = z.object({
  voidReason: z.string().min(5, 'El motivo debe tener al menos 5 caracteres').max(255).trim(),
})

export type CreateInvoiceDto     = z.infer<typeof CreateInvoiceSchema>
export type CreateInvoiceLineDto = z.infer<typeof CreateInvoiceLineSchema>
export type VoidInvoiceDto       = z.infer<typeof VoidInvoiceSchema>
