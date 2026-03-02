<script setup lang="ts">
import { onMounted } from 'vue'
import { useItems } from '@/composables/useItems'

// Asumimos que useItems tiene la misma firma que useContacts
const { items, loading, error, hasError, isEmpty, fetchItems } = useItems()

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <div class="item-list">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Catálogo de Productos</h2>
      <button 
        @click="fetchItems"
        class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
      >
        🔄 Actualizar
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-12">
      <p class="text-gray-500 font-medium">⏳ Cargando catálogo...</p>
    </div>

    <div v-else-if="hasError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-bold">❌ Error {{ error?.statusCode }}</p>
      <p>{{ error?.message }}</p>
      <ul v-if="error?.errors" class="mt-2 text-sm space-y-1">
        <li v-for="(messages, field) in error.errors" :key="field">
          <strong class="capitalize">{{ field }}:</strong> {{ messages.join(', ') }}
        </li>
      </ul>
    </div>

    <div v-else-if="isEmpty" class="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p class="text-gray-500">📭 No hay productos registrados en el inventario.</p>
    </div>

    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 font-semibold">Nombre del Ítem</th>
            <th class="px-4 py-3 font-semibold">Categoría</th>
            <th class="px-4 py-3 font-semibold text-right">Precio</th>
            <th class="px-4 py-3 font-semibold text-right">Stock</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="item in items" 
            :key="item.id" 
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-4">
              <span class="font-medium text-gray-800">{{ item.name }}</span>
              <p v-if="item.description" class="text-xs text-gray-400 mt-0.5 line-clamp-1">
                {{ item.description }}
              </p>
            </td>
            <td class="px-4 py-4">
              <span 
                v-if="item.category" 
                class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
              >
                {{ item.category }}
              </span>
              <span v-else class="text-gray-400 italic text-xs">Sin categoría</span>
            </td>
            <td class="px-4 py-4 text-right font-medium text-gray-800">
              ${{ Number(item.price).toFixed(2) }}
            </td>
            <td class="px-4 py-4 text-right">
              <span 
                :class="[
                  'font-medium', 
                  item.stock > 0 ? 'text-green-600' : 'text-red-500'
                ]"
              >
                {{ item.stock > 0 ? item.stock : 'Agotado' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>