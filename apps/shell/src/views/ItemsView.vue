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
      
      <Suspense>
        <RemoteItems />

        <template #fallback>
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 font-medium">Cargando módulo de Contactos...</p>
          </div>
        </template>        
      </Suspense>

    </main>
  </div>
</template>