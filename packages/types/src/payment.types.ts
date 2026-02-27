export type PaymentMethod =
  | 'cash'
  | 'transfer'
  | 'card'
  | 'check'

export interface Payment {
  id:        number
  invoiceId: number
  amount:    number
  method:    PaymentMethod
  paidAt:    string
  notes?:    string
  createdAt: string
}

export interface CreatePaymentDto {
  invoiceId: number
  amount:    number
  method:    PaymentMethod
  paidAt?:   string
  notes?:    string
}
