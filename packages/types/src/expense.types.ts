export type ExpenseStatus =
  | 'pending'   // Pendiente de revisión
  | 'approved'  // Aprobado
  | 'void'      // Anulado — existe pero sin efecto contable

export interface Expense {
  id: number
  description: string
  amount: number
  category: string
  status: ExpenseStatus
  receiptUrl?: string
  voidReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseDto {
  description: string
  amount: number
  category: string
  receiptUrl?: string
}

export interface VoidExpenseDto {
  voidReason: string
}
