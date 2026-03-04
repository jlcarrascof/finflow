import { ref } from 'vue'
import api from '@/services/api'
import type { ApiError } from '@finflow/types'

// Definimos la interfaz basada en lo que escupe tu reports.service.ts
export interface DashboardSummary {
  totalInvoices: number
  totalRevenue: number
  totalExpenses: number
  pendingInvoices: number
  draftInvoices: number
}

export function useDashboard() {
  const summary = ref<DashboardSummary | null>(null)
  const loading = ref(false)
  const error   = ref<ApiError | null>(null)

  async function fetchSummary() {
    loading.value = true
    error.value   = null
    try {
      // Consumimos tu endpoint perfecto
      const { data } = await api.get<{ data: DashboardSummary }>('/reports/summary')
      summary.value = data.data
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  return { summary, loading, error, fetchSummary }
}