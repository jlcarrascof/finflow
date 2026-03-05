<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

// Importamos el MFE remoto de Items
const RemoteItems = defineAsyncComponent(() => import('remote_items/App'))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <RemoteItems />

    </main>
  </div>
</template>