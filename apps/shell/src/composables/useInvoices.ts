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
    invoices.value.filter(inv => inv.status === 'overdue')
  )

  // Total pendiente de cobro (issued + partial + overdue)
  const totalOutstanding = computed(() =>
    invoices.value
      .filter(inv => ['issued', 'partial', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.total, 0)
  )

  // ── GET /invoices ──────────────────────────────────────────────────────────
  async function fetchInvoices(): Promise<void> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.get<Invoice[]>('/invoices')
      invoices.value = data
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
      const { data } = await api.get<Invoice>(`/invoices/${id}`)
      return data
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
      const { data } = await api.post<Invoice>('/invoices', payload)
      invoices.value.push(data)
      return data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── PATCH /invoices/:id/status ─────────────────────────────────────────────
  // Cambia el estado de una factura: draft → issued → paid, etc.
  // Una factura 'issued' NO se edita — solo se cambia su estado o se anula
  async function updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.patch<Invoice>(`/invoices/${id}/status`, { status })
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) invoices.value[index] = data
      return data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  // ── POST /invoices/:id/void ────────────────────────────────────────────────
  // Anula una factura — NUNCA se elimina, queda en BD con status 'void'
  // voidReason es obligatorio para auditoría fiscal
  async function voidInvoice(id: number, payload: VoidInvoiceDto): Promise<Invoice | null> {
    loading.value = true
    error.value   = null
    try {
      const { data } = await api.post<Invoice>(`/invoices/${id}/void`, payload)
      const index = invoices.value.findIndex(inv => inv.id === id)
      if (index !== -1) invoices.value[index] = data
      return data
    } catch (err) {
      error.value = err as ApiError
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    // estado
    invoices,
    loading,
    error,
    // computed
    hasError,
    isEmpty,
    activeInvoices,
    overdueInvoices,
    totalOutstanding,
    // métodos
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceStatus,
    voidInvoice,
  }
}
