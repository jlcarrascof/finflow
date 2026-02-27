// Formato oficial: FAC-0000001 (prefijo + guion + 7 dígitos)
// Borradores usan TMP-XXXXXXX — son eliminables
// FAC-XXXXXXX NUNCA se elimina — solo se anula (void)
export type InvoiceNumber = string

export type InvoiceStatus =
  | 'draft'    // Borrador — TMP-XXXXXXX, editable y eliminable
  | 'issued'   // Emitida — FAC-XXXXXXX, documento fiscal oficial
  | 'paid'     // Pagada en su totalidad
  | 'void'     // Anulada — conserva FAC-XXXXXXX, irreversible

export interface InvoiceLine {
  id:           number
  itemId:       number
  itemName:     string
  quantity:     number
  unitPrice:    number
  subtotal:     number
  description?: string
}

export interface Invoice {
  id:          number
  number:      InvoiceNumber   // TMP-XXXXXXX en draft, FAC-XXXXXXX al emitir
  contactId:   number
  contactName: string
  lines:       InvoiceLine[]
  subtotal:    number
  tax:         number
  total:       number
  status:      InvoiceStatus
  issueDate?:  string          // Solo existe cuando status !== 'draft'
  dueDate?:    string
  notes?:      string
  voidReason?: string          // Obligatorio si status === 'void'
  voidedAt?:   string
  createdAt:   string
  updatedAt:   string
}

export interface CreateInvoiceLineDto {
  itemId:    number
  quantity:  number
  unitPrice: number
}

export interface CreateInvoiceDto {
  contactId: number
  lines:     CreateInvoiceLineDto[]
  dueDate?:  string
  notes?:    string
}

// Una factura emitida NO se edita — solo se puede anular
export interface VoidInvoiceDto {
  voidReason: string   // Motivo obligatorio para auditoría
}
