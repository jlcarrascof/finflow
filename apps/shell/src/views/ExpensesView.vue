<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'

  // Importamos el MFE remoto de Gastos
  const RemoteExpenses = defineAsyncComponent(() => import('remote_expenses/App'))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <RemoteExpenses />

    </main>
  </div>
</template>