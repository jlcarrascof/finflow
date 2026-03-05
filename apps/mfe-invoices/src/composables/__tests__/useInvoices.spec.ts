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
  })
})