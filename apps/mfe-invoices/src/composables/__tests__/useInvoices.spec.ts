import { describe, it, expect } from 'vitest'
import { useInvoices } from '../useInvoices'

describe('useInvoices Composable', () => {
  it('Should initialize with an empty invoices array and no errors', () => {
    // 1. Arrange & Act (Preparar y Actuar)
    const { invoices, loading, error } = useInvoices()

    // 2. Assert (Afirmar)
    expect(invoices.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })
})