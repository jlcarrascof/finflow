<script setup lang="ts">
import { onMounted } from 'vue'
import { useContacts } from '@/composables/useContacts'

const { contacts, loading, error, hasError, isEmpty, fetchContacts } = useContacts()

onMounted(() => {
  fetchContacts()
})
</script>

<template>
  <div class="p-8 font-mono">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Contactos</h2>

    <p v-if="loading" class="text-gray-500 italic">⏳ Cargando contactos...</p>

    <div v-else-if="hasError" class="text-red-600 border border-red-500 bg-red-50 p-4 rounded-md mb-4">
      <p class="font-bold mb-2">❌ Error {{ error?.statusCode }}</p>
      <p class="mb-2">{{ error?.message }}</p>
      
      <ul v-if="error?.errors" class="list-disc pl-5 mb-3">
        <li
          v-for="(messages, field) in error.errors"
          :key="field"
        >
          <strong>{{ field }}:</strong> {{ messages.join(', ') }}
        </li>
      </ul>
      <button @click="fetchContacts" class="bg-red-200 hover:bg-red-300 text-red-800 px-4 py-2 rounded transition-colors">
        🔄 Reintentar
      </button>
    </div>

    <p v-else-if="isEmpty" class="text-gray-500 italic">📭 No hay contactos registrados.</p>

    <ul v-else class="space-y-3">
      <li
        v-for="contact in contacts"
        :key="contact.id"
        class="bg-white p-4 rounded shadow-sm border border-gray-200 flex items-center"
      >
        <strong class="text-gray-900 mr-2">{{ contact.name }}</strong>
        <span class="text-gray-600">— {{ contact.email }}</span>
        
        <span v-if="contact.taxId" class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs ml-auto font-sans font-bold">
          {{ contact.taxId }}
        </span>
      </li>
    </ul>
  </div>
</template>