<script setup lang="ts">
import { onMounted } from 'vue'
import { useExpenses } from '@/composables/useExpenses'

const { expenses, loading, error, hasError, isEmpty, fetchExpenses } = useExpenses()

onMounted(() => {
  fetchExpenses()
})

function getStatusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    void: 'bg-gray-100 text-gray-500 border-gray-200 line-through'
  }
  return map[status] || 'bg-gray-50 text-gray-600'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    void: 'Anulado'
  }
  return map[status] || status
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Registro de Gastos</h2>
      <button @click="fetchExpenses" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
        🔄 Actualizar
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-gray-500 font-medium">⏳ Cargando gastos...</p>
    </div>

    <div v-else-if="hasError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-bold">❌ Error {{ error?.statusCode }}</p>
      <p>{{ error?.message }}</p>
    </div>

    <div v-else-if="isEmpty" class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p class="text-gray-500">📭 No hay gastos registrados.</p>
    </div>

    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 font-semibold">Fecha</th>
            <th class="px-4 py-3 font-semibold">Descripción</th>
            <th class="px-4 py-3 font-semibold">Categoría</th>
            <th class="px-4 py-3 font-semibold text-center">Estado</th>
            <th class="px-4 py-3 font-semibold text-right">Monto</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="expense in expenses" :key="expense.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-4 whitespace-nowrap">{{ new Date(expense.date).toLocaleDateString() }}</td>
            <td class="px-4 py-4 font-medium text-gray-800">{{ expense.description }}</td>
            <td class="px-4 py-4">{{ expense.category }}</td>
            <td class="px-4 py-4 text-center">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-medium border', getStatusClass(expense.status)]">
                {{ getStatusLabel(expense.status) }}
              </span>
            </td>
            <td class="px-4 py-4 text-right font-medium text-gray-800">${{ Number(expense.amount).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>