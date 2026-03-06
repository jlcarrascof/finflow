import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInvoices } from '../useInvoices'
import api from '@/services/api'

// 1. Mocking the API module
// We tell Vitest: "Intercept any calls to @/services/api and replace them with these fake functions"
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  }
}))

describe('useInvoices Composable', () => {
  // Clear mocks before each test so they don't interfere with each other
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── 1. INITIAL STATE TESTS ────────────────────────────────────────────────
  describe('Initial State', () => {
    it('should initialize with empty data and no errors', () => {
      const { invoices, loading, error, isEmpty, hasError } = useInvoices()
      
      expect(invoices.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
      expect(isEmpty.value).toBe(true)
      expect(hasError.value).toBe(false)
    })
  })

  // ─── 2. COMPUTED PROPERTIES TESTS ──────────────────────────────────────────
  describe('Computed Properties', () => {
    it('should correctly calculate totalOutstanding and activeInvoices', () => {
      const { invoices, totalOutstanding, activeInvoices } = useInvoices()
      
      // Inject fake data directly into the state to test the computed math
      invoices.value = [
        { id: 1, status: 'issued', total: 100 } as any,
        { id: 2, status: 'void', total: 500 } as any,    // Should be ignored in active
        { id: 3, status: 'overdue', total: 200 } as any, // Should be summed in outstanding
      ]

      // Assertions
      expect(activeInvoices.value.length).toBe(2) // Only 1 and 3 are active (not void)
      expect(totalOutstanding.value).toBe(300)    // 100 (issued) + 200 (overdue)
    })
  })

  // ─── 3. ASYNC API CALLS TESTS (THE MOCKS) ──────────────────────────────────
  describe('API Actions', () => {
    it('should fetch invoices successfully and update state', async () => {
      const { fetchInvoices, invoices, loading } = useInvoices()
      
      // Arrange: Prepare the fake response that Axios will return
      const mockResponse = { data: { data: [{ id: 1, number: 'FAC-001' }] } }
      vi.mocked(api.get).mockResolvedValueOnce(mockResponse)

      // Act: Call the function
      const fetchPromise = fetchInvoices()
      
      // Assert loading state BEFORE promise resolves
      expect(loading.value).toBe(true)
      
      await fetchPromise

      // Assert state AFTER promise resolves
      expect(loading.value).toBe(false)
      expect(invoices.value.length).toBe(1)
      expect(invoices.value[0]?.number).toBe('FAC-001')
      expect(api.get).toHaveBeenCalledWith('/invoices') // Verify correct endpoint was called
    })

    it('should handle API errors correctly during fetch', async () => {
      const { fetchInvoices, error, loading } = useInvoices()
      
      // Arrange: Simulate a network error
      const mockError = new Error('Network Error')
      vi.mocked(api.get).mockRejectedValueOnce(mockError)

      // Act
      await fetchInvoices()

      // Assert
      expect(loading.value).toBe(false)
      expect(error.value).toEqual(mockError)
    })

    it('should add a new invoice to the list upon successful creation', async () => {
      const { createInvoice, invoices } = useInvoices()
      
      const newInvoice = { id: 2, number: 'FAC-002', total: 150 }
      vi.mocked(api.post).mockResolvedValueOnce({ data: { data: newInvoice } })

      // Ensure the list has one initial item
      invoices.value = [{ id: 1, number: 'FAC-001', total: 100 } as any]

      // Act
      const result = await createInvoice({ contactId: 1, lines: [] } as any)

      // Assert
      expect(result).toEqual(newInvoice)
      expect(invoices.value.length).toBe(2) // The new invoice was pushed to the array
      expect(api.post).toHaveBeenCalledWith('/invoices', expect.any(Object))
    })

    it('should fetch a single invoice by ID', async () => {
      const { fetchInvoiceById, loading } = useInvoices()
      const mockInvoice = { id: 99, number: 'FAC-099' }
      
      // Simulamos la respuesta de la API
      vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockInvoice } })

      // Act: Disparamos la promesa sin el await todavía
      const fetchPromise = fetchInvoiceById(99)

      // 🔍 AQUÍ USAMOS LA VARIABLE: Verificamos que cargue mientras espera
      expect(loading.value).toBe(true)

      // Ahora sí esperamos que termine
      const result = await fetchPromise

      // Verificamos que devuelva la factura, quite el loading y llame al endpoint
      expect(result).toEqual(mockInvoice)
      expect(loading.value).toBe(false)
      expect(api.get).toHaveBeenCalledWith('/invoices/99')
    })

    it('should update invoice status and modify the local array', async () => {
      const { updateInvoiceStatus, invoices } = useInvoices()
      const updatedInvoice = { id: 1, number: 'FAC-001', status: 'paid' }
      
      // Metemos una factura manual en el estado para ver si la función la actualiza
      invoices.value = [{ id: 1, number: 'FAC-001', status: 'issued' } as any]
      
      // Simulamos el PATCH
      vi.mocked(api.patch).mockResolvedValueOnce({ data: { data: updatedInvoice } })

      const result = await updateInvoiceStatus(1, 'paid' as any)

      // Comprobamos la respuesta de la API y que el estado local haya mutado
      expect(result).toEqual(updatedInvoice)
      expect(invoices.value[0]?.status).toBe('paid')
      expect(api.patch).toHaveBeenCalledWith('/invoices/1/status', { status: 'paid' })
    })

    it('should void an invoice and update the local array', async () => {
      const { voidInvoice, invoices } = useInvoices()
      const voidedInvoice = { id: 2, number: 'FAC-002', status: 'void', voidReason: 'Cancelada por error' }
      
      invoices.value = [{ id: 2, number: 'FAC-002', status: 'issued' } as any]
      
      // Simulamos el POST de anulación
      vi.mocked(api.post).mockResolvedValueOnce({ data: { data: voidedInvoice } })

      const result = await voidInvoice(2, { voidReason: 'Cancelada por error' })

      expect(result).toEqual(voidedInvoice)
      expect(invoices.value[0]?.status).toBe('void')
      expect(api.post).toHaveBeenCalledWith('/invoices/2/void', { voidReason: 'Cancelada por error' })
    })
  })
})