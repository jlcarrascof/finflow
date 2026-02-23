import { createApp } from 'vue'
import type { Contact } from '@finflow/types'
import App from './App.vue'

// Prueba de que @finflow/types resuelve correctamente
const testContact: Contact = {
  id: 1,
  name: 'Test',
  email: 'test@finflow.com',
  type: 'client',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

console.log('✅ @finflow/types resuelve:', testContact.name)

createApp(App).mount('#app')
