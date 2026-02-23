// Formato oficial: FAC-0000001 (prefijo + guion + 7 dígitos)
// El number NUNCA se modifica una vez emitida la factura
// Una factura NUNCA se elimina — se anula (void) con referencia a nota de crédito
export type InvoiceNumber = string

export type InvoiceStatus =
  | 'draft'    // Borrador — editable, aún no es documento fiscal
  | 'issued'   // Emitida — documento fiscal oficial, no editable
  | 'paid'     // Pagada — cobrada en su totalidad
  | 'partial'  // Pago parcial recibido
  | 'overdue'  // Vencida — no pagada después de la fecha límite
  | 'void'     // Nula — anulada, existe en BD pero sin efecto fiscal

export interface InvoiceLine {
  id: number
  itemId: number
  itemName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Invoice {
  id: number                  // ID interno — NUNCA se altera
  number: InvoiceNumber       // FAC-0000001 — NUNCA se altera una vez emitida
  contactId: number
  contactName: string
  lines: InvoiceLine[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  dueDate: string
  voidReason?: string         // Obligatorio si status === 'void'
  voidedAt?: string           // Fecha de anulación
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceLineDto {
  itemId: number
  quantity: number
  unitPrice: number
}

export interface CreateInvoiceDto {
  contactId: number
  lines: CreateInvoiceLineDto[]
  dueDate: string
  tax?: number
}

// Una factura emitida NO se edita — solo se puede anular
export interface VoidInvoiceDto {
  voidReason: string          // Motivo obligatorio para auditoría
}
