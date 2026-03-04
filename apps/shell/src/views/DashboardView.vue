<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

// Importamos el MFE remoto del Dashboard
const RemoteDashboard = defineAsyncComponent(() => import('remote_dashboard/App'))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-6xl mx-auto px-6 py-8">
      
      <RemoteDashboard />

    </main>
  </div>
</template>