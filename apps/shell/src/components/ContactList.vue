<script setup lang="ts">
import { onMounted } from 'vue'
import { useContacts } from '@/composables/useContacts'

const { contacts, loading, error, hasError, isEmpty, fetchContacts } = useContacts()

onMounted(() => {
  fetchContacts()
})
</script>

<template>
  <div class="contact-list">
    <h2>Contactos</h2>

    <!-- Estado: cargando -->
    <p v-if="loading">⏳ Cargando contactos...</p>

    <!-- Estado: error tipado -->
    <div v-else-if="hasError" class="error-box">
      <p><strong>❌ Error {{ error?.statusCode }}</strong></p>
      <p>{{ error?.message }}</p>
      <!-- Errores de validación campo por campo -->
      <ul v-if="error?.errors">
        <li
          v-for="(messages, field) in error.errors"
          :key="field"
        >
          <strong>{{ field }}:</strong> {{ messages.join(', ') }}
        </li>
      </ul>
      <button @click="fetchContacts">🔄 Reintentar</button>
    </div>

    <!-- Estado: sin datos -->
    <p v-else-if="isEmpty">📭 No hay contactos registrados.</p>

    <!-- Estado: datos cargados -->
    <ul v-else>
      <li
        v-for="contact in contacts"
        :key="contact.id"
      >
        <strong>{{ contact.name }}</strong>
        — {{ contact.email }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.contact-list {
  padding: 2rem;
  font-family: monospace;
}
.error-box {
  color: red;
  border: 1px solid red;
  padding: 1rem;
  border-radius: 4px;
}
.badge {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 8px;
}
</style>
