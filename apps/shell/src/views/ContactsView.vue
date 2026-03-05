<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'

  // MAGIA: Importamos el MFE remoto de forma perezosa
  const RemoteContacts = defineAsyncComponent(() => import('remote_contacts/App'))
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-6 py-8">
      
      <RemoteContacts />

    </main>
  </div>
</template>