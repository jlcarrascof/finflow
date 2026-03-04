import { ref, computed } from 'vue'
import api from '@/services/api'
import type {
  Invoice,
  CreateInvoiceDto,
  VoidInvoiceDto,
  InvoiceStatus,
  ApiError,
} from '@finflow/types'

export function useInvoices() {
  // ── Estado reactivo ────────────────────────────────────────────────────────
  const invoices = ref<Invoice[]>([])
  const loading  = ref(false)
  const error    = ref<ApiError | null>(null)

  // ── Computed ───────────────────────────────────────────────────────────────
  const hasError = computed(() => error.value !== null)
  const isEmpty  = computed(() => invoices.value.length === 0)

  // Facturas activas: excluye las anuladas (void)
  const activeInvoices = computed(() =>
    invoices.value.filter(inv => inv.status !== 'void')
  )

  // Facturas vencidas: para dashboard o alertas
  const overdueInvoices = computed(() =>
    invoices.value.filter(inv => inv.status === 'overdue' as any)
  )

  // Total pendiente de cobro
  const totalOutstanding = computed(() =>
    invoices.value
      .filter(inv => ['issued', 'partial', 'overdue'].includes(inv.status as string))
      .reduce((sum, inv) => sum + Number(inv.total), 0)
  )

  // ── GET /invoices ──────────────────────────────────────────────────────────
  async function fetchInvoices(): Promise<void> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<{ data: Invoice[]; total: number }>('/invoices')
      invoices.value = data.data
    } catch (err) {
      error.value = err as ApiError
    } finally {
      loading.value = false
    }
  }

  // ── GET /invoices/:id ──────────────────────────────────────────────────────
  async function fetchInvoiceById(id: number): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<{ data: Invoice }>(`/invoices/${id}`)
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── POST /invoices ─────────────────────────────────────────────────────────
  async function createInvoice(payload: CreateInvoiceDto): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post<{ data: Invoice }>('/invoices', payload)
      invoices.value.push(data.data)
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── PATCH /invoices/:id/status ─────────────────────────────────────────────
  async function updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.patch<{ data: Invoice }>(`/invoices/${id}/status`, { status })
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) invoices.value[index] = data.data
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── POST /invoices/:id/void ────────────────────────────────────────────────
  async function voidInvoice(id: number, payload: VoidInvoiceDto): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post<{ data: Invoice }>(`/invoices/${id}/void`, payload)
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) invoices.value[index] = data.data
      return data.data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    invoices,
    loading,
    error,
    hasError,
    isEmpty,
    activeInvoices,
    overdueInvoices,
    totalOutstanding,
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceStatus,
    voidInvoice,
  }
}