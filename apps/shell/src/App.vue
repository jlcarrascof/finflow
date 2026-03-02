<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Importamos el MFE dinámicamente
const MfeContacts = defineAsyncComponent(() => import('remote_contacts/App'))
</script>

<template>
  <div style="border: 4px dashed blue; padding: 10px; margin: 10px; text-align: center;">
    <h2 style="color: blue;">⬇️ Microfrontend de Contactos ⬇️</h2>
    <MfeContacts />
  </div>

  <RouterView />
</template>