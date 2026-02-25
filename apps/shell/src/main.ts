import { createApp } from 'vue'
import { createPinia } from 'pinia'        // ← NUEVO
import router from './router'              // ← NUEVO (lo creamos en un momento)
import './style.css'                       // ← NUEVO: importar Tailwind
import App from './App.vue'

// Prueba de que @finflow/types resuelve correctamente (puedes quitarla ya)
// const testContact: Contact = { ... }

const app = createApp(App)
app.use(createPinia())                     // ← NUEVO
app.use(router)                            // ← NUEVO
app.mount('#app')
