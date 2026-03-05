import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Expense, ApiError } from '@finflow/types'

export function useExpenses() {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => expenses.value.length === 0)

  async function fetchExpenses(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<{ data: Expense[]; total: number }>('/expenses')
      expenses.value = data.data
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  return { expenses, loading, error, hasError, isEmpty, fetchExpenses }
}