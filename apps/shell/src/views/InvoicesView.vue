<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

// Importamos el MFE remoto de Facturas
const RemoteInvoices = defineAsyncComponent(() => import('remote_invoices/App'))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <RemoteInvoices />

    </main>
  </div>
</template>