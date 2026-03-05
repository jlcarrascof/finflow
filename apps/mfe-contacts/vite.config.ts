import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path' // ← NUEVO: Importación necesaria para el alias

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote_contacts',
      filename: 'remoteEntry.js',
      // Aquí es donde ocurre la magia: Exponemos el componente principal
      exposes: {
        './App': './src/App.vue',
      },
      // Las mismas dependencias compartidas que en la Shell
      shared: ['vue', 'pinia', 'vue-router']
    })
  ],
  // 👇 NUEVO: Bloque resolve para el alias @ 👇
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5001, // Le asignamos un puerto fijo y distinto a la Shell (5000)
    strictPort: true,
  },
  preview: { 
    port: 5001,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})