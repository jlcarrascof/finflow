export interface Expense {
  id: number
  description: string
  amount: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateExpenseDto {
  description: string
  amount: number
  category: string
  receiptUrl?: string
}
