<script setup lang="ts">
import { onMounted } from 'vue'
import { useInvoices } from '@/composables/useInvoices'

const { invoices, loading, error, hasError, isEmpty, fetchInvoices } = useInvoices()

onMounted(() => {
  fetchInvoices()
})

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    issued: 'bg-blue-50 text-blue-700 border-blue-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    void: 'bg-red-50 text-red-700 border-red-200 line-through'
  }
  return map[status] || 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    draft: 'Borrador',
    issued: 'Emitida',
    paid: 'Pagada',
    void: 'Anulada'
  }
  return map[status] || status
}

// 👇 NUEVA FUNCIÓN NINJA 👇
function getClientName(invoice: any) {
  return invoice.contact?.name || invoice.contactName || `ID: ${invoice.contactId}`
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Facturación</h2>
      <button @click="fetchInvoices" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
        🔄 Actualizar
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-gray-500 font-medium">⏳ Cargando facturas...</p>
    </div>

    <div v-else-if="hasError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-bold">❌ Error {{ error?.statusCode }}</p>
      <p>{{ error?.message }}</p>
    </div>

    <div v-else-if="isEmpty" class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p class="text-gray-500">📭 No hay facturas emitidas ni en borrador.</p>
    </div>

    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 font-semibold">Número</th>
            <th class="px-4 py-3 font-semibold">Cliente</th>
            <th class="px-4 py-3 font-semibold">Fecha Emisión</th>
            <th class="px-4 py-3 font-semibold text-center">Estado</th>
            <th class="px-4 py-3 font-semibold text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-4 whitespace-nowrap font-mono font-medium text-gray-800">
              {{ invoice.number }}
            </td>
            <td class="px-4 py-4 font-medium text-gray-800">
              {{ getClientName(invoice) }}
            </td>
            <td class="px-4 py-4">
              <div class="flex flex-col">
                <span v-if="invoice.issueDate" class="text-sm font-medium text-gray-800">
                  Emitida: {{ new Date(invoice.issueDate).toLocaleDateString() }}
                </span>
                <span v-else class="text-sm text-gray-400 italic">
                  Sin emitir
                </span>
                
                <span v-if="invoice.dueDate" class="text-xs mt-0.5" :class="invoice.issueDate ? 'text-gray-500' : 'text-gray-400'">
                  Vence: {{ new Date(invoice.dueDate).toLocaleDateString() }}
                </span>
              </div>
            </td>
            <td class="px-4 py-4 text-center">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-medium border', getStatusClass(invoice.status)]">
                {{ getStatusLabel(invoice.status) }}
              </span>
            </td>
            <td class="px-4 py-4 text-right font-medium text-gray-800">${{ Number(invoice.total).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>