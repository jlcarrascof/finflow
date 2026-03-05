import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InvoiceList from '../InvoiceList.vue'
import { useInvoices } from '@/composables/useInvoices'

// 1. MOCK: Secuestramos el composable para inyectar datos falsos
vi.mock('@/composables/useInvoices', () => ({
  useInvoices: vi.fn()
}))

describe('InvoiceList Component', () => {
  it('should display the loading state correctly', () => {
    // Simulamos que la app está cargando
    vi.mocked(useInvoices).mockReturnValue({
      invoices: { value: [] },
      loading: { value: true },
      error: { value: null },
      hasError: { value: false },
      isEmpty: { value: false },
      fetchInvoices: vi.fn()
    } as any)

    // Montamos el componente en el navegador invisible
    const wrapper = mount(InvoiceList)

    // Buscamos el texto de carga en el HTML renderizado
    expect(wrapper.text()).toContain('⏳ Cargando facturas...')
  })

  it('should display an error message if the API fails', () => {
    // Simulamos un error 500
    vi.mocked(useInvoices).mockReturnValue({
      invoices: { value: [] },
      loading: { value: false },
      error: { value: { statusCode: 500, message: 'Server Down' } },
      hasError: { value: true },
      isEmpty: { value: false },
      fetchInvoices: vi.fn()
    } as any)

    const wrapper = mount(InvoiceList)

    // Verificamos que el cuadro rojo de error se muestre
    expect(wrapper.text()).toContain('❌ Error 500')
    expect(wrapper.text()).toContain('Server Down')
  })

  it('should render the invoice table with correct statuses and Tailwind classes', () => {
    // Simulamos 3 facturas con distintos estados
    const mockInvoices = [
      { id: 1, number: 'FAC-001', status: 'issued', total: 100, issueDate: '2026-03-05' },
      { id: 2, number: 'TMP-002', status: 'draft', total: 50 },
      { id: 3, number: 'FAC-003', status: 'paid', total: 200 }
    ]

    vi.mocked(useInvoices).mockReturnValue({
      invoices: { value: mockInvoices },
      loading: { value: false },
      error: { value: null },
      hasError: { value: false },
      isEmpty: { value: false },
      fetchInvoices: vi.fn()
    } as any)

    const wrapper = mount(InvoiceList)

    // 1. Verificamos que la tabla exista y tenga los números correctos
    expect(wrapper.text()).toContain('FAC-001')
    expect(wrapper.text()).toContain('TMP-002')

    // 2. Verificamos que las fechas se rendericen o muestren "Sin emitir"
    expect(wrapper.text()).toContain('Emitida:')
    expect(wrapper.text()).toContain('Sin emitir')

    // 3. Verificamos que las funciones puras hayan inyectado las clases de Tailwind correctas
    // Buscamos todos los elementos <span> que tienen las etiquetas de estado
    const badges = wrapper.findAll('span.rounded-full')
    
    // El primer badge (FAC-001) debe decir "Emitida" y tener clases azules
    expect(badges[0]?.text()).toBe('Emitida')
    expect(badges[0]?.classes()).toContain('bg-blue-50')
    expect(badges[0]?.classes()).toContain('text-blue-700')

    // El segundo badge (TMP-002) debe decir "Borrador" y tener clases grises
    expect(badges[1]?.text()).toBe('Borrador')
    expect(badges[1]?.classes()).toContain('bg-gray-100')

    // El tercer badge (FAC-003) debe decir "Pagada" y tener clases verdes
    expect(badges[2]?.text()).toBe('Pagada')
    expect(badges[2]?.classes()).toContain('bg-green-50')
  })
})