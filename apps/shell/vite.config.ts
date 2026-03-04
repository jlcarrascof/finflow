import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: 'shell',
      remotes: {
        // Le decimos a la Shell dónde vive el manifiesto de Contactos
        remote_contacts: 'http://localhost:5001/assets/remoteEntry.js',
        // 👇 NUEVO: Le enseñamos a la Shell dónde vive Gastos 👇
        remote_expenses: 'http://localhost:5002/assets/remoteEntry.js'
      },
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5000,
    strictPort: true,
  },
  build: {
    // Top-level await es necesario para Module Federation en Vite
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})