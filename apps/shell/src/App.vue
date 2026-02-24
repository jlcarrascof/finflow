<script setup lang="ts">
import { onMounted } from 'vue'
import { useContacts } from '@/composables/useContacts'

const { contacts, loading, error, hasError, fetchContacts } = useContacts()

onMounted(() => {
  fetchContacts()
})
</script>

<template>
  <div style="padding: 2rem; font-family: monospace;">
    <h1>finflow — prueba de conexión API</h1>

    <p v-if="loading">⏳ Cargando contactos...</p>

    <div v-else-if="hasError" style="color: red;">
      <p>❌ Error {{ error?.statusCode }}: {{ error?.message }}</p>
    </div>

    <div v-else>
      <p>✅ Contactos recibidos: {{ contacts.length }}</p>
      <pre>{{ JSON.stringify(contacts, null, 2) }}</pre>
    </div>
  </div>
</template>
