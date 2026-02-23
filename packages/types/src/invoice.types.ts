export interface InvoiceLine {
  id: number
  itemId: number
  itemName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Invoice {
  id: number
  number: string
  contactId: number
  contactName: string
  lines: InvoiceLine[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'cancelled'
  dueDate: string
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
