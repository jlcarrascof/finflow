import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InvoiceList from '../InvoiceList.vue'
import { useInvoices } from '@/composables/useInvoices'
import { ref } from 'vue' // 👈 EL SALVAVIDAS

// 1. MOCK: Secuestramos el composable
vi.mock('@/composables/useInvoices', () => ({
  useInvoices: vi.fn()
}))

describe('InvoiceList Component', () => {
  it('should display the loading state correctly', () => {
    vi.mocked(useInvoices).mockReturnValue({
      invoices: ref([]),
      loading: ref(true),
      error: ref(null),
      hasError: ref(false),
      isEmpty: ref(false),
      fetchInvoices: vi.fn()
    } as any)

    const wrapper = mount(InvoiceList)
    expect(wrapper.text()).toContain('⏳ Cargando facturas...')
  })

  it('should display an error message if the API fails', () => {
    vi.mocked(useInvoices).mockReturnValue({
      invoices: ref([]),
      loading: ref(false), // 👈 Ahora Vue sí entenderá que es false
      error: ref({ statusCode: 500, message: 'Server Down' }),
      hasError: ref(true),
      isEmpty: ref(false),
      fetchInvoices: vi.fn()
    } as any)

    const wrapper = mount(InvoiceList)

    expect(wrapper.text()).toContain('❌ Error 500')
    expect(wrapper.text()).toContain('Server Down')
  })

  it('should render the invoice table with correct statuses and Tailwind classes', () => {
    const mockInvoices = [
      { id: 1, number: 'FAC-001', status: 'issued', total: 100, issueDate: '2026-03-05' },
      { id: 2, number: 'TMP-002', status: 'draft', total: 50 },
      { id: 3, number: 'FAC-003', status: 'paid', total: 200 }
    ]

    vi.mocked(useInvoices).mockReturnValue({
      invoices: ref(mockInvoices),
      loading: ref(false),
      error: ref(null),
      hasError: ref(false),
      isEmpty: ref(false),
      fetchInvoices: vi.fn()
    } as any)

    const wrapper = mount(InvoiceList)

    // 1. Verificamos contenido de la tabla
    expect(wrapper.text()).toContain('FAC-001')
    expect(wrapper.text()).toContain('TMP-002')
    expect(wrapper.text()).toContain('Emitida:')
    expect(wrapper.text()).toContain('Sin emitir')

    // 2. Verificamos los badges de Tailwind
    const badges = wrapper.findAll('span.rounded-full')
    
    expect(badges[0]?.text()).toBe('Emitida')
    expect(badges[0]?.classes()).toContain('bg-blue-50')
    expect(badges[0]?.classes()).toContain('text-blue-700')

    expect(badges[1]?.text()).toBe('Borrador')
    expect(badges[1]?.classes()).toContain('bg-gray-100')

    expect(badges[2]?.text()).toBe('Pagada')
    expect(badges[2]?.classes()).toContain('bg-green-50')
  })
})