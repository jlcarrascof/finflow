<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useDashboard } from '@/composables/useDashboard'
import VueApexCharts from 'vue3-apexcharts'

const { summary, loading, error, fetchSummary } = useDashboard()

onMounted(() => {
  fetchSummary()
})

// Configuración del gráfico de Dona (Donut)
const chartOptions = computed(() => {
  return {
    chart: { 
      type: 'donut',
      fontFamily: 'inherit',
    },
    labels: ['Ingresos (Pagadas)', 'Gastos (Aprobados)'],
    colors: ['#10B981', '#EF4444'], // Verde Tailwind y Rojo Tailwind
    dataLabels: { 
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%"
      }
    },
    legend: { position: 'bottom' },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "$" + val.toFixed(2)
        }
      }
    }
  }
})

// Los datos reales que alimentan el gráfico
const chartSeries = computed(() => {
  if (!summary.value) return [0, 0]
  return [summary.value.totalRevenue, summary.value.totalExpenses]
})
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Resumen Financiero</h2>
      <button 
        @click="fetchSummary" 
        class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
      >
        🔄 Actualizar
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-gray-500 font-medium">⏳ Calculando métricas...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-bold">❌ Error cargando el dashboard</p>
      <p>{{ error?.message }}</p>
    </div>

    <div v-else-if="summary" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Ingresos Totales</p>
          <p class="text-2xl font-black text-gray-800">${{ summary.totalRevenue.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-red-500">
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Gastos Totales</p>
          <p class="text-2xl font-black text-gray-800">${{ summary.totalExpenses.toFixed(2) }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-yellow-500">
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Facturas Pendientes</p>
          <p class="text-2xl font-black text-gray-800">{{ summary.pendingInvoices }}</p>
        </div>
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gray-400">
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Borradores</p>
          <p class="text-2xl font-black text-gray-800">{{ summary.draftInvoices }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 text-center">
          Balance de Flujo de Caja
        </h3>
        <div class="flex justify-center">
          <VueApexCharts
            v-if="summary.totalRevenue > 0 || summary.totalExpenses > 0"
            type="donut"
            width="400"
            :options="chartOptions"
            :series="chartSeries"
          />
          <div v-else class="py-12 text-gray-400 italic text-sm">
            No hay datos suficientes de ingresos o gastos para graficar.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>